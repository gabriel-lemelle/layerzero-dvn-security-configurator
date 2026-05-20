import assert from 'node:assert/strict';
import test from 'node:test';
import type { DVN } from './dvns';
import { grade } from './grader';

function makeDvn(id: string, category: DVN['category']): DVN {
  return {
    id,
    name: id,
    category,
    operator: 'Test operator',
    trustModel: 'Test trust model',
    canonicalName: id,
  };
}

const nativeA = makeDvn('native-a', 'native');
const nativeB = makeDvn('native-b', 'native');
const zkA = makeDvn('zk-a', 'zk-light-client');
const zkB = makeDvn('zk-b', 'zk-light-client');
const attestationA = makeDvn('attestation-a', 'attestation');
const attestationB = makeDvn('attestation-b', 'attestation');
const multisigA = makeDvn('multisig-a', 'multisig-consortium');

test('T1: 0 required and 0 optional grades F', () => {
  const result = grade({
    requiredDVNs: [],
    optionalDVNs: [],
    optionalThreshold: 0,
  });

  assert.equal(result.grade, 'F');
  assert.equal(result.effective, 0);
});

test('T2: 1 required and 0 optional grades F', () => {
  const result = grade({
    requiredDVNs: [nativeA],
    optionalDVNs: [],
    optionalThreshold: 0,
  });

  assert.equal(result.grade, 'F');
  assert.equal(result.effective, 1);
  assert.equal(result.categoriesPresent.size, 1);
  assert.equal(result.kelpDaoWarning, true);
});

test('T3: 2 optional with threshold 1 grades F', () => {
  const result = grade({
    requiredDVNs: [],
    optionalDVNs: [nativeA, zkA],
    optionalThreshold: 1,
  });

  assert.equal(result.grade, 'F');
  assert.equal(result.effective, 1);
});

test('T4: 2 optional same category with threshold 2 grades C', () => {
  const result = grade({
    requiredDVNs: [],
    optionalDVNs: [nativeA, nativeB],
    optionalThreshold: 2,
  });

  assert.equal(result.grade, 'C');
  assert.equal(result.categoriesPresent.size, 1);
});

test('T5: 2 required same category grades C', () => {
  const result = grade({
    requiredDVNs: [zkA, zkB],
    optionalDVNs: [],
    optionalThreshold: 0,
  });

  assert.equal(result.grade, 'C');
  assert.equal(result.categoriesPresent.size, 1);
});

test('T6: native plus zk required grades A', () => {
  const result = grade({
    requiredDVNs: [nativeA, zkA],
    optionalDVNs: [],
    optionalThreshold: 0,
  });

  assert.equal(result.grade, 'A');
  assert.equal(result.categoriesPresent.size, 2);
  assert.equal(result.kelpDaoWarning, undefined);
  assert.match(result.nextStep?.label ?? '', /A\+/);
});

test('T7: native required plus attestation optional threshold 1 grades A', () => {
  const result = grade({
    requiredDVNs: [nativeA],
    optionalDVNs: [attestationA],
    optionalThreshold: 1,
  });

  assert.equal(result.grade, 'A');
  assert.deepEqual([...result.categoriesPresent].sort(), ['attestation', 'native']);
});

test('T8: native required plus two same-category optional with threshold 1 grades A', () => {
  const result = grade({
    requiredDVNs: [nativeA],
    optionalDVNs: [attestationA, attestationB],
    optionalThreshold: 1,
  });

  assert.equal(result.grade, 'A');
  assert.equal(result.effective, 2);
  assert.deepEqual([...result.categoriesPresent].sort(), ['attestation', 'native']);
});

test('T9: native required plus two same-category optional with threshold 2 grades A', () => {
  const result = grade({
    requiredDVNs: [nativeA],
    optionalDVNs: [attestationA, attestationB],
    optionalThreshold: 2,
  });

  assert.equal(result.grade, 'A');
  assert.equal(result.effective, 3);
  assert.deepEqual([...result.categoriesPresent].sort(), ['attestation', 'native']);
});

test('clamps optional threshold before computing effective count', () => {
  const result = grade({
    requiredDVNs: [nativeA],
    optionalDVNs: [zkA],
    optionalThreshold: 99,
  });

  assert.equal(result.grade, 'A');
  assert.equal(result.effective, 2);
  assert.equal(result.threshold, '2 / 2');
});

test('scores optional threshold categories independent of optional DVN order', () => {
  const firstOrder = grade({
    requiredDVNs: [nativeA],
    optionalDVNs: [zkA, attestationA, multisigA],
    optionalThreshold: 2,
  });
  const secondOrder = grade({
    requiredDVNs: [nativeA],
    optionalDVNs: [multisigA, attestationA, zkA],
    optionalThreshold: 2,
  });

  assert.equal(firstOrder.grade, 'A+');
  assert.equal(secondOrder.grade, 'A+');
  assert.equal(firstOrder.categoriesPresent.size, secondOrder.categoriesPresent.size);
});

test('uses the weakest threshold-satisfying optional subset for diversity grade', () => {
  const result = grade({
    requiredDVNs: [nativeA],
    optionalDVNs: [zkA, attestationA, nativeB],
    optionalThreshold: 1,
  });

  assert.equal(result.grade, 'C');
  assert.equal(result.categoriesPresent.size, 1);
});

test('returns A+ as a bonus for 3+ DVNs across 3+ categories', () => {
  const result = grade({
    requiredDVNs: [nativeA, zkA, attestationA],
    optionalDVNs: [multisigA],
    optionalThreshold: 0,
  });

  assert.equal(result.grade, 'A+');
  assert.equal(result.effective, 3);
  assert.equal(result.categoriesPresent.size, 3);
  assert.equal(result.nextStep, undefined);
});
