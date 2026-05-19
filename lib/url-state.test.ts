import assert from 'node:assert/strict';
import test from 'node:test';
import { CHAINS } from './chains';
import { DVNS } from './dvns';
import { parseUrlConfig, serializeUrlConfig } from './url-state';

const sourceChain = CHAINS[0];
const destChain = CHAINS[1];
const requiredDVNs = [DVNS[0], DVNS[1]];
const optionalDVNs = [DVNS[3], DVNS[8]];

test('serializes full composer state into URL params', () => {
  const query = serializeUrlConfig({
    sourceChain,
    destChain,
    requiredDVNs,
    optionalDVNs,
    optionalThreshold: 1,
  });

  assert.equal(
    query,
    `source=${sourceChain.id}&dest=${destChain.id}&req=${requiredDVNs.map((dvn) => dvn.id).join('%2C')}&opt=${optionalDVNs.map((dvn) => dvn.id).join('%2C')}&threshold=1`
  );
});

test('parses a shared URL into known chains and DVNs', () => {
  const parsed = parseUrlConfig(
    `?source=${sourceChain.id}&dest=${destChain.id}&req=${requiredDVNs.map((dvn) => dvn.id).join(',')}&opt=${optionalDVNs.map((dvn) => dvn.id).join(',')}&threshold=1`
  );

  assert.equal(parsed.sourceChain?.id, sourceChain.id);
  assert.equal(parsed.destChain?.id, destChain.id);
  assert.deepEqual(parsed.requiredDVNs?.map((dvn) => dvn.id), requiredDVNs.map((dvn) => dvn.id));
  assert.deepEqual(parsed.optionalDVNs?.map((dvn) => dvn.id), optionalDVNs.map((dvn) => dvn.id));
  assert.equal(parsed.optionalThreshold, 1);
});

test('drops unknown and duplicate DVNs while clamping threshold', () => {
  const parsed = parseUrlConfig(
    `?req=${DVNS[0].id},missing,${DVNS[0].id}&opt=${DVNS[0].id},${DVNS[3].id}&threshold=5`
  );

  assert.deepEqual(parsed.requiredDVNs?.map((dvn) => dvn.id), [DVNS[0].id]);
  assert.deepEqual(parsed.optionalDVNs?.map((dvn) => dvn.id), [DVNS[3].id]);
  assert.equal(parsed.optionalThreshold, 1);
});
