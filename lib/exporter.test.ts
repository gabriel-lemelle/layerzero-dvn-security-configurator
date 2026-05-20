import assert from 'node:assert/strict';
import test from 'node:test';
import type { DVN } from './dvns';
import { generateConfig } from './exporter';
import { CHAINS } from './chains';

function makeDvn(
  id: string,
  name: string,
  category: DVN['category'],
  canonicalName = name,
): DVN {
  return {
    id,
    name,
    category,
    operator: 'Test operator',
    trustModel: 'Test trust model',
    canonicalName,
  };
}

const ethereum = CHAINS.find((chain) => chain.id === 'ethereum-sepolia') ?? CHAINS[0];
const optimism =
  CHAINS.find((chain) => chain.id === 'optimism-sepolia') ?? CHAINS[2];
const base = CHAINS.find((chain) => chain.id === 'base-sepolia') ?? CHAINS[3];

const layerZero = makeDvn(
  'layerzero-labs',
  'LayerZero Labs',
  'native',
);
const horizen = makeDvn('horizen-labs', 'Horizen', 'zk-light-client');
const nethermind = makeDvn(
  'nethermind',
  'Nethermind',
  'multisig-consortium',
);
const unsupported = makeDvn('unsupported', 'Unsupported', 'zk-light-client');

test('returns a blocking message when no effective DVNs are selected', () => {
  const code = generateConfig({
    sourceChain: base,
    destChain: optimism,
    requiredDVNs: [],
    optionalDVNs: [],
    optionalThreshold: 0,
  });

  assert.match(code, /Cannot generate a wire-ready LayerZero config/);
  assert.match(code, /Select at least one required DVN/);
});

test('generates the official metadata-tools layerzero.config.ts shape', () => {
  const code = generateConfig({
    sourceChain: base,
    destChain: optimism,
    requiredDVNs: [layerZero, horizen],
    optionalDVNs: [],
    optionalThreshold: 0,
  });

  assert.match(code, /generateConnectionsConfig/);
  assert.match(code, /export default async function/);
  assert.match(code, /contracts: \[/);
  assert.match(code, /connections,/);
  assert.match(code, /EndpointId.BASESEP_V2_TESTNET/);
  assert.match(code, /EndpointId.OPTSEP_V2_TESTNET/);
  assert.match(code, /'LayerZero Labs'/);
  assert.match(code, /'Horizen'/);
});

test('renders optional DVNs and clamps threshold', () => {
  const code = generateConfig({
    sourceChain: base,
    destChain: optimism,
    requiredDVNs: [layerZero],
    optionalDVNs: [horizen, nethermind],
    optionalThreshold: 99,
  });

  assert.match(code, /\[\s*'Horizen',\s*'Nethermind',\s*\], 2\]/);
});

test('supports optional-only metadata-tools config when threshold is effective', () => {
  const code = generateConfig({
    sourceChain: base,
    destChain: optimism,
    requiredDVNs: [],
    optionalDVNs: [layerZero, horizen],
    optionalThreshold: 2,
  });

  assert.match(code, /\[\s*\[\],\s*\[\[\s*'LayerZero Labs',\s*'Horizen',\s*\], 2\],\s*\]/);
});

test('blocks Ethereum Sepolia while official metadata lists no active DVNs', () => {
  const code = generateConfig({
    sourceChain: ethereum,
    destChain: base,
    requiredDVNs: [layerZero],
    optionalDVNs: [],
    optionalThreshold: 0,
  });

  assert.match(code, /LayerZero Labs is not listed as an active DVN on Ethereum Sepolia/);
});

test('blocks DVNs that are not active official providers on both chains', () => {
  const code = generateConfig({
    sourceChain: base,
    destChain: optimism,
    requiredDVNs: [unsupported],
    optionalDVNs: [],
    optionalThreshold: 0,
  });

  assert.match(code, /Unsupported is not listed as an active DVN/);
});
