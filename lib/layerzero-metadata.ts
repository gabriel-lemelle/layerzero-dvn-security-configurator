import type { Chain } from './chains';
import type { DVN } from './dvns';

export const LAYERZERO_METADATA_URL =
  'https://metadata.layerzero-api.com/v1/metadata';

export const LAYERZERO_CHAIN_KEYS: Record<Chain['id'], string> = {
  'ethereum-sepolia': 'sepolia',
  'arbitrum-sepolia': 'arbitrum-sepolia',
  'optimism-sepolia': 'optimism-sepolia',
  'base-sepolia': 'base-sepolia',
};

const ACTIVE_TESTNET_DVNS: Record<string, Set<string>> = {
  sepolia: new Set(),
  'arbitrum-sepolia': new Set([
    'AltLayer',
    'Anchorage',
    'BitGo',
    'BWare',
    'Citrea',
    'Frax',
    'Horizen',
    'Japan Blockchain Foundation',
    'LayerZero Labs',
    'Nethermind',
    'Paxos',
    'Wyoming',
  ]),
  'optimism-sepolia': new Set([
    'BitGo',
    'BWare',
    'Citrea',
    'Frax',
    'Horizen',
    'LayerZero Labs',
    'Nethermind',
    'Wyoming',
  ]),
  'base-sepolia': new Set([
    'BitGo',
    'Horizen',
    'LayerZero Labs',
    'Nethermind',
    'P2P',
  ]),
};

export function getActiveDvnCount(chain: Chain): number {
  const chainKey = LAYERZERO_CHAIN_KEYS[chain.id];
  return ACTIVE_TESTNET_DVNS[chainKey]?.size ?? 0;
}

export function hasActiveDvnMetadata(chain: Chain): boolean {
  return getActiveDvnCount(chain) > 0;
}

export function getCanonicalDvnName(dvn: DVN): string {
  return dvn.canonicalName;
}

export function isDvnActiveOnChain(dvn: DVN, chain: Chain): boolean {
  const chainKey = LAYERZERO_CHAIN_KEYS[chain.id];
  return ACTIVE_TESTNET_DVNS[chainKey]?.has(dvn.canonicalName) ?? false;
}

export function isDvnActiveForChainPair(
  dvn: DVN,
  sourceChain: Chain,
  destChain: Chain,
): boolean {
  return isDvnActiveOnChain(dvn, sourceChain) && isDvnActiveOnChain(dvn, destChain);
}

export function getUnavailableDvnReasons({
  sourceChain,
  destChain,
  dvns,
}: {
  sourceChain: Chain;
  destChain: Chain;
  dvns: DVN[];
}): string[] {
  const reasons: string[] = [];
  const sourceChainKey = LAYERZERO_CHAIN_KEYS[sourceChain.id];
  const destChainKey = LAYERZERO_CHAIN_KEYS[destChain.id];
  const sourceDvns = ACTIVE_TESTNET_DVNS[sourceChainKey] ?? new Set<string>();
  const destDvns = ACTIVE_TESTNET_DVNS[destChainKey] ?? new Set<string>();

  for (const dvn of dvns) {
    const missingChains = [
      sourceDvns.has(dvn.canonicalName) ? undefined : sourceChain.name,
      destDvns.has(dvn.canonicalName) ? undefined : destChain.name,
    ].filter(Boolean);

    if (missingChains.length > 0) {
      reasons.push(
        `${dvn.canonicalName} is not listed as an active DVN on ${missingChains.join(
          ' and ',
        )}.`,
      );
    }
  }

  return reasons;
}
