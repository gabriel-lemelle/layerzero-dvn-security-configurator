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
    addresses: {
      ethereum_sepolia: '0x0000000000000000000000000000000000000001',
      arbitrum_sepolia: '0x0000000000000000000000000000000000000002',
      optimism_sepolia: '0x0000000000000000000000000000000000000003',
      base_sepolia: '0x0000000000000000000000000000000000000004',
    },
  };
}

const nativeA = makeDvn('native-a', 'native');
const nativeB = makeDvn('native-b', 'native');
const zkA = makeDvn('zk-a', 'zk-light-client');
const attestationA = makeDvn('attestation-a', 'attestation');
const attestationB = makeDvn('attestation-b', 'attestation');

test('T1: 0 required and 0 optional grades F', () => {
  assert.equal(grade({ requiredDVNs: [], optionalDVNs: [], optionalThreshold: 0 }).grade, 'F');
});

test('T2: 1 required and 0 optional grades F', () => {
  assert.equal(grade({ requiredDVNs: [nativeA], optionalDVNs: [], optionalThreshold: 0 }).grade, 'F');
});

test('T3: 2 optional with threshold 1 grades F', () => {
  assert.equal(grade({ requiredDVNs: [], optionalDVNs: [nativeA, zkA], optionalThreshold: 1 }).grade, 'F');
});

test('T4: 2 optional same category with threshold 2 grades C', () => {
  assert.equal(grade({ requiredDVNs: [], optionalDVNs: [nativeA, nativeB], optionalThreshold: 2 }).grade, 'C');
});

test('T5: 2 required same category grades C', () => {
  assert.equal(grade({ requiredDVNs: [nativeA, nativeB], optionalDVNs: [], optionalThreshold: 0 }).grade, 'C');
});

test('T6: native plus zk required grades A', () => {
  assert.equal(grade({ requiredDVNs: [nativeA, zkA], optionalDVNs: [], optionalThreshold: 0 }).grade, 'A');
});

test('T7: native required plus attestation optional threshold 1 grades A', () => {
  assert.equal(grade({ requiredDVNs: [nativeA], optionalDVNs: [attestationA], optionalThreshold: 1 }).grade, 'A');
});

test('T8: native required plus two same-category optional with threshold 1 grades A', () => {
  assert.equal(grade({ requiredDVNs: [nativeA], optionalDVNs: [attestationA, attestationB], optionalThreshold: 1 }).grade, 'A');
});

test('T9: native required plus two same-category optional with threshold 2 grades A', () => {
  assert.equal(grade({ requiredDVNs: [nativeA], optionalDVNs: [attestationA, attestationB], optionalThreshold: 2 }).grade, 'A');
});
