import type { DVN } from './dvns';
import type { Chain } from './chains';
import { CHAIN_EID_NAMES } from './chains';

export interface ExportConfig {
  sourceChain: Chain;
  destChain: Chain;
  requiredDVNs: DVN[];
  optionalDVNs: DVN[];
  optionalThreshold: number;
}

function sortAddresses(dvns: DVN[], chainKey: Chain['addressKey']): { address: string; name: string }[] {
  return dvns
    .map(dvn => ({
      address: dvn.addresses[chainKey].toLowerCase(),
      name: dvn.name,
    }))
    .sort((a, b) => a.address.localeCompare(b.address));
}

function formatAddressArray(sorted: { address: string; name: string }[], indent: string): string {
  if (sorted.length === 0) return '[]';
  const lines = sorted.map(({ address, name }) => `${indent}  '${address}', // ${name}`);
  return `[\n${lines.join('\n')}\n${indent}]`;
}

export function generateConfig(config: ExportConfig): string {
  const { sourceChain, destChain, requiredDVNs, optionalDVNs, optionalThreshold } = config;

  if (requiredDVNs.length === 0) {
    return '// Add at least one DVN to the Composer to generate config';
  }

  const sourceEidName = CHAIN_EID_NAMES[sourceChain.eid] || `UNKNOWN_${sourceChain.eid}`;
  const destEidName = CHAIN_EID_NAMES[destChain.eid] || `UNKNOWN_${destChain.eid}`;

  // Sort addresses for both chains (source for sendConfig, dest for receiveConfig)
  const sortedRequiredSource = sortAddresses(requiredDVNs, sourceChain.addressKey);
  const sortedOptionalSource = sortAddresses(optionalDVNs, sourceChain.addressKey);
  const sortedRequiredDest = sortAddresses(requiredDVNs, destChain.addressKey);
  const sortedOptionalDest = sortAddresses(optionalDVNs, destChain.addressKey);

  const indent = '          ';

  return `// REVIEW REQUIRED: DVN addresses in this demo are static and may be placeholders.
// Verify every DVN address against official LayerZero metadata before deployment:
// https://metadata.layerzero-api.com/v1/metadata/dvns

import { EndpointId } from '@layerzerolabs/lz-definitions'

export const connection = {
  from: { eid: EndpointId.${sourceEidName}, contractName: 'MyOApp' },
  to:   { eid: EndpointId.${destEidName},   contractName: 'MyOApp' },
  config: {
    sendConfig: {
      ulnConfig: {
        confirmations: BigInt(15),
        requiredDVNs: ${formatAddressArray(sortedRequiredSource, indent)},
        optionalDVNs: ${formatAddressArray(sortedOptionalSource, indent)},
        optionalDVNThreshold: ${optionalThreshold},
      },
    },
    receiveConfig: {
      ulnConfig: {
        confirmations: BigInt(15),
        requiredDVNs: ${formatAddressArray(sortedRequiredDest, indent)},
        optionalDVNs: ${formatAddressArray(sortedOptionalDest, indent)},
        optionalDVNThreshold: ${optionalThreshold},
      },
    },
  },
}`;
}
