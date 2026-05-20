export interface Chain {
  id: string;
  name: string;
  eid: number;
  addressKey: 'ethereum_sepolia' | 'arbitrum_sepolia' | 'optimism_sepolia' | 'base_sepolia';
}

export const CHAINS: Chain[] = [
  {
    id: 'arbitrum-sepolia',
    name: 'Arbitrum Sepolia',
    eid: 40231,
    addressKey: 'arbitrum_sepolia',
  },
  {
    id: 'optimism-sepolia',
    name: 'Optimism Sepolia',
    eid: 40232,
    addressKey: 'optimism_sepolia',
  },
  {
    id: 'base-sepolia',
    name: 'Base Sepolia',
    eid: 40245,
    addressKey: 'base_sepolia',
  },
  {
    id: 'ethereum-sepolia',
    name: 'Ethereum Sepolia',
    eid: 40161,
    addressKey: 'ethereum_sepolia',
  },
];

export const CHAIN_EID_NAMES: Record<number, string> = {
  40161: 'SEPOLIA_V2_TESTNET',
  40231: 'ARBSEP_V2_TESTNET',
  40232: 'OPTSEP_V2_TESTNET',
  40245: 'BASESEP_V2_TESTNET',
};
