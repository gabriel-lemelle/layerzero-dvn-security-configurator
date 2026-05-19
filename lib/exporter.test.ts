import assert from 'node:assert/strict';
import test from 'node:test';
import type { DVN } from './dvns';
import { generateConfig } from './exporter';
import { CHAINS } from './chains';

function makeDvn(id: string, name: string, ethereumAddress: string, arbitrumAddress: string): DVN {
  return {
    id,
    name,
    category: 'native',
    operator: 'Test operator',
    trustModel: 'Test trust model',
    addresses: {
      ethereum_sepolia: ethereumAddress,
      arbitrum_sepolia: arbitrumAddress,
      optimism_sepolia: '0x0000000000000000000000000000000000000003',
      base_sepolia: '0x0000000000000000000000000000000000000004',
    },
  };
}

const ethereum = CHAINS.find((chain) => chain.id === 'ethereum-sepolia') ?? CHAINS[0];
const arbitrum = CHAINS.find((chain) => chain.id === 'arbitrum-sepolia') ?? CHAINS[1];
const laterAddress = '0xcccccccccccccccccccccccccccccccccccccccc';
const earlierAddress = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const mixedCaseOptional = '0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB';
const firstDvn = makeDvn('first', 'First DVN', laterAddress, '0xdddddddddddddddddddddddddddddddddddddddd');
const secondDvn = makeDvn('second', 'Second DVN', earlierAddress, '0x1111111111111111111111111111111111111111');
const optionalDvn = makeDvn('optional', 'Optional DVN', mixedCaseOptional, '0x2222222222222222222222222222222222222222');

test('returns placeholder when no required DVNs are selected', () => {
  const code = generateConfig({
    sourceChain: ethereum,
    destChain: arbitrum,
    requiredDVNs: [],
    optionalDVNs: [optionalDvn],
    optionalThreshold: 1,
  });

  assert.match(code, /Add at least one DVN/);
});

test('sorts required DVN addresses alphabetically with lowercase comparison', () => {
  const code = generateConfig({
    sourceChain: ethereum,
    destChain: arbitrum,
    requiredDVNs: [firstDvn, secondDvn],
    optionalDVNs: [],
    optionalThreshold: 0,
  });

  assert.ok(code.indexOf(earlierAddress) < code.indexOf(laterAddress));
});

test('lowercases exported optional DVN addresses and renders threshold', () => {
  const code = generateConfig({
    sourceChain: ethereum,
    destChain: arbitrum,
    requiredDVNs: [secondDvn],
    optionalDVNs: [optionalDvn],
    optionalThreshold: 1,
  });

  assert.match(code, /'0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', \/\/ Optional DVN/);
  assert.match(code, /optionalDVNThreshold: 1/);
});

test('uses source chain addresses for send config and destination chain addresses for receive config', () => {
  const code = generateConfig({
    sourceChain: ethereum,
    destChain: arbitrum,
    requiredDVNs: [secondDvn],
    optionalDVNs: [],
    optionalThreshold: 0,
  });

  assert.match(code, /'0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', \/\/ Second DVN/);
  assert.match(code, /'0x1111111111111111111111111111111111111111', \/\/ Second DVN/);
});
