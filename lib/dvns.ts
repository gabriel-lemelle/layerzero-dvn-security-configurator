export interface DVN {
  id: string;
  name: string;
  category: 'native' | 'zk-light-client' | 'attestation' | 'multisig-consortium';
  operator: string;
  trustModel: string;
  canonicalName: string;
  note?: string;
}

export const DVNS: DVN[] = [
  {
    id: 'layerzero-labs',
    name: 'LayerZero Labs',
    category: 'native',
    operator: 'LayerZero Labs',
    trustModel: 'LayerZero-operated DVN infrastructure listed in official metadata.',
    canonicalName: 'LayerZero Labs',
  },
  {
    id: 'horizen-labs',
    name: 'Horizen',
    category: 'zk-light-client',
    operator: 'Horizen Labs',
    trustModel: 'ZK-oriented verification provider listed in official metadata.',
    canonicalName: 'Horizen',
  },
  {
    id: 'nethermind',
    name: 'Nethermind',
    category: 'multisig-consortium',
    operator: 'Nethermind',
    trustModel: 'Infrastructure-operated verifier listed in official metadata.',
    canonicalName: 'Nethermind',
  },
  {
    id: 'bitgo',
    name: 'BitGo',
    category: 'attestation',
    operator: 'BitGo',
    trustModel: 'Institutional infrastructure verifier listed in official metadata.',
    canonicalName: 'BitGo',
  },
  {
    id: 'frax',
    name: 'Frax',
    category: 'native',
    operator: 'Frax',
    trustModel: 'Protocol-operated verifier listed in official metadata.',
    canonicalName: 'Frax',
  },
  {
    id: 'bware',
    name: 'BWare',
    category: 'attestation',
    operator: 'BWare',
    trustModel: 'Infrastructure verifier listed in official metadata.',
    canonicalName: 'BWare',
  },
  {
    id: 'wyoming',
    name: 'Wyoming',
    category: 'attestation',
    operator: 'Wyoming',
    trustModel: 'Independent verifier listed in official metadata.',
    canonicalName: 'Wyoming',
  },
  {
    id: 'citrea',
    name: 'Citrea',
    category: 'zk-light-client',
    operator: 'Citrea',
    trustModel: 'ZK-oriented verifier listed in official metadata.',
    canonicalName: 'Citrea',
  },
  {
    id: 'altlayer',
    name: 'AltLayer',
    category: 'attestation',
    operator: 'AltLayer',
    trustModel: 'Rollup infrastructure verifier listed in official metadata.',
    canonicalName: 'AltLayer',
  },
  {
    id: 'anchorage',
    name: 'Anchorage',
    category: 'attestation',
    operator: 'Anchorage',
    trustModel: 'Institutional infrastructure verifier listed in official metadata.',
    canonicalName: 'Anchorage',
  },
  {
    id: 'joc',
    name: 'Japan Blockchain Foundation',
    category: 'attestation',
    operator: 'Japan Blockchain Foundation',
    trustModel: 'Independent verifier listed in official metadata.',
    canonicalName: 'Japan Blockchain Foundation',
  },
  {
    id: 'paxos',
    name: 'Paxos',
    category: 'attestation',
    operator: 'Paxos',
    trustModel: 'Institutional infrastructure verifier listed in official metadata.',
    canonicalName: 'Paxos',
  },
  {
    id: 'p2p',
    name: 'P2P',
    category: 'attestation',
    operator: 'P2P',
    trustModel: 'Validator infrastructure verifier listed in official metadata.',
    canonicalName: 'P2P',
  },
];

export const DVN_CATEGORY_LABELS: Record<DVN['category'], string> = {
  native: 'Native',
  'zk-light-client': 'ZK Light Client',
  attestation: 'Attestation',
  'multisig-consortium': 'Multisig Consortium',
};
