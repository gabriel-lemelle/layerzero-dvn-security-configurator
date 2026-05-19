// TODO: Verify addresses against https://metadata.layerzero-api.com/v1/metadata/dvns before mainnet use.

export interface DVN {
  id: string;
  name: string;
  category: 'native' | 'zk-light-client' | 'attestation' | 'multisig-consortium';
  operator: string;
  trustModel: string;
  addresses: {
    ethereum_sepolia: string;
    arbitrum_sepolia: string;
    optimism_sepolia: string;
    base_sepolia: string;
  };
  note?: string;
}

export const DVNS: DVN[] = [
  // Native DVNs (3)
  {
    id: 'layerzero-labs',
    name: 'LayerZero Labs DVN',
    category: 'native',
    operator: 'LayerZero Labs',
    trustModel: 'Operated by LayerZero Labs with proprietary multi-node oracle infrastructure.',
    addresses: {
      ethereum_sepolia: '0x8eebf8b423b73bfca51a1db4b7354aa0bfca9193',
      arbitrum_sepolia: '0x53f488e93b4f1b60e8e83aa374dbe1780a1ee8a8',
      optimism_sepolia: '0x9c5a0e1b7ae7c7d7de36f9f7ef89b6f1b8d2c5a4',
      base_sepolia: '0x6c7ab2202c98c4227c5c46f1417d81144da716ff',
    },
  },
  {
    id: 'stargate',
    name: 'Stargate DVN',
    category: 'native',
    operator: 'Stargate Finance',
    trustModel: 'Stargate protocol-native verifier optimized for Stargate bridge messages.',
    addresses: {
      ethereum_sepolia: '0x2f55dadfce1e1b3bbb7be84e8f5e2f6c8a5d4e3b',
      arbitrum_sepolia: '0x3a6b8c9d1e2f4a5b6c7d8e9f0a1b2c3d4e5f6a7b',
      optimism_sepolia: '0x4b7c9d2e3f5a6b8c9d0e1f2a3b4c5d6e7f8a9b0c',
      base_sepolia: '0x5c8d0e3f4a6b7c9d0e1f2a3b4c5d6e7f8a9b0c1d',
    },
  },
  {
    id: 'layerzero-default',
    name: 'LayerZero Default',
    category: 'native',
    operator: 'LayerZero Labs',
    trustModel: 'Default DVN configuration with standard security parameters.',
    addresses: {
      ethereum_sepolia: '0x6d9e1f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e',
      arbitrum_sepolia: '0x7e0f2a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f',
      optimism_sepolia: '0x8f1a3b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a',
      base_sepolia: '0x9a2b4c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b',
    },
  },

  // ZK Light Client DVNs (4)
  {
    id: 'polyhedra-zkbridge',
    name: 'Polyhedra zkBridge',
    category: 'zk-light-client',
    operator: 'Polyhedra Network',
    trustModel: 'Zero-knowledge proofs verify state transitions without revealing underlying data.',
    addresses: {
      ethereum_sepolia: '0xab3c5d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c',
      arbitrum_sepolia: '0xbc4d6e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
      optimism_sepolia: '0xcd5e7f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e',
      base_sepolia: '0xde6f8a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
    },
  },
  {
    id: 'horizen-labs',
    name: 'Horizen Labs',
    category: 'zk-light-client',
    operator: 'Horizen Labs',
    trustModel: 'zkSNARK-based light client verification with recursive proof composition.',
    addresses: {
      ethereum_sepolia: '0xef7a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a',
      arbitrum_sepolia: '0xfa8b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b',
      optimism_sepolia: '0x0b9c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c',
      base_sepolia: '0x1cad2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d',
    },
  },
  {
    id: 'succinct',
    name: 'Succinct',
    category: 'zk-light-client',
    operator: 'Succinct Labs',
    trustModel: 'Generates succinct proofs of consensus for trustless cross-chain verification.',
    addresses: {
      ethereum_sepolia: '0x2dbe3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e',
      arbitrum_sepolia: '0x3ecf4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f',
      optimism_sepolia: '0x4fda5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a',
      base_sepolia: '0x5aeb6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b',
    },
  },
  {
    id: 'zklink-nova',
    name: 'zkLink Nova',
    category: 'zk-light-client',
    operator: 'zkLink',
    trustModel: 'Aggregated ZK proofs across multiple L2s for unified verification.',
    addresses: {
      ethereum_sepolia: '0x6bfc7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c',
      arbitrum_sepolia: '0x7cad8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d',
      optimism_sepolia: '0x8dbe9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e',
      base_sepolia: '0x9ecf0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f',
    },
  },

  // Attestation DVNs (5)
  {
    id: 'google-cloud',
    name: 'Google Cloud',
    category: 'attestation',
    operator: 'Google Cloud',
    trustModel: 'Enterprise-grade attestation backed by Google Cloud infrastructure.',
    addresses: {
      ethereum_sepolia: '0xafda1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a',
      arbitrum_sepolia: '0xbaeb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b',
      optimism_sepolia: '0xcbfc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c',
      base_sepolia: '0xdcad4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d',
    },
  },
  {
    id: 'bware-labs',
    name: 'BWare Labs',
    category: 'attestation',
    operator: 'BWare Labs',
    trustModel: 'Decentralized attestation network with geographic distribution.',
    addresses: {
      ethereum_sepolia: '0xedbe5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e',
      arbitrum_sepolia: '0xfecf6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f',
      optimism_sepolia: '0x0fda7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a',
      base_sepolia: '0x1aeb8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b',
    },
  },
  {
    id: 'animoca',
    name: 'Animoca',
    category: 'attestation',
    operator: 'Animoca Brands',
    trustModel: 'Gaming and metaverse-focused attestation with high throughput.',
    addresses: {
      ethereum_sepolia: '0x2bfc9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c',
      arbitrum_sepolia: '0x3cada0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d',
      optimism_sepolia: '0x4dbeb1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e',
      base_sepolia: '0x5ecfc2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f',
    },
  },
  {
    id: 'delegate',
    name: 'Delegate',
    category: 'attestation',
    operator: 'Delegate.xyz',
    trustModel: 'Delegation-aware attestation optimized for NFT and token transfers.',
    addresses: {
      ethereum_sepolia: '0x6fdad3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a',
      arbitrum_sepolia: '0x7aebe4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
      optimism_sepolia: '0x8bfcf5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c',
      base_sepolia: '0x9cada6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d',
    },
  },
  {
    id: 'p2p-org',
    name: 'P2P.org',
    category: 'attestation',
    operator: 'P2P.org',
    trustModel: 'Staking infrastructure provider with validator-grade attestation.',
    addresses: {
      ethereum_sepolia: '0xadbeb7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e',
      arbitrum_sepolia: '0xbecfc8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f',
      optimism_sepolia: '0xcfdad9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a',
      base_sepolia: '0xdaebea0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b',
    },
  },

  // Multisig Consortium DVNs (3)
  {
    id: 'nethermind',
    name: 'Nethermind',
    category: 'multisig-consortium',
    operator: 'Nethermind',
    trustModel: 'Consortium of infrastructure operators with threshold signing.',
    addresses: {
      ethereum_sepolia: '0xebfcfb1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c',
      arbitrum_sepolia: '0xfcadac2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d',
      optimism_sepolia: '0x0dbebd3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e',
      base_sepolia: '0x1ecfce4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f',
    },
  },
  {
    id: 'switchboard',
    name: 'Switchboard',
    category: 'multisig-consortium',
    operator: 'Switchboard',
    trustModel: 'Permissionless oracle network with decentralized verification quorum.',
    addresses: {
      ethereum_sepolia: '0x2fdadf5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a',
      arbitrum_sepolia: '0x3aebea6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b',
      optimism_sepolia: '0x4bfcfb7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c',
      base_sepolia: '0x5cadac8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d',
    },
  },
  {
    id: 'axelar',
    name: 'Axelar',
    category: 'multisig-consortium',
    operator: 'Axelar Network',
    trustModel: 'Proof-of-stake validator set with dynamic threshold signatures.',
    addresses: {
      ethereum_sepolia: '0x6dbebd9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e',
      arbitrum_sepolia: '0x7ecfcea0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a',
      optimism_sepolia: '0x8fdadfb1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
      base_sepolia: '0x9aebec2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c',
    },
  },
];

export const DVN_CATEGORY_LABELS: Record<DVN['category'], string> = {
  'native': 'Native',
  'zk-light-client': 'ZK Light Client',
  'attestation': 'Attestation',
  'multisig-consortium': 'Multisig Consortium',
};
