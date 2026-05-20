import type { DVN } from './dvns';
import type { Chain } from './chains';
import { CHAIN_EID_NAMES } from './chains';
import {
  LAYERZERO_METADATA_URL,
  getCanonicalDvnName,
  getUnavailableDvnReasons,
} from './layerzero-metadata';

export interface ExportConfig {
  sourceChain: Chain;
  destChain: Chain;
  requiredDVNs: DVN[];
  optionalDVNs: DVN[];
  optionalThreshold: number;
  mode?: 'wire-ready' | 'explore';
}

function formatStringArray(values: string[], indent: string): string {
  if (values.length === 0) return '[]';

  const lines = values.map((value) => `${indent}'${value}',`);
  return `[\n${lines.join('\n')}\n${indent.slice(0, -2)}]`;
}

function formatDvnConfig(
  requiredNames: string[],
  optionalNames: string[],
  optionalThreshold: number,
): string {
  const required = formatStringArray(requiredNames, '          ');

  if (optionalNames.length === 0 || optionalThreshold === 0) {
    return `[\n        ${required},\n        [],\n      ]`;
  }

  const optional = formatStringArray(optionalNames, '          ');
  return `[\n        ${required},\n        [${optional}, ${optionalThreshold}],\n      ]`;
}

function validationBlock(reasons: string[]): string {
  return `// Cannot generate a wire-ready LayerZero config for this selection yet.
//
// ${reasons.join('\n// ')}
//
// The exporter only emits copy-pasteable config when every selected DVN is an
// active official provider on both selected chains in LayerZero metadata:
// ${LAYERZERO_METADATA_URL}
//
// Choose a supported chain pair and official DVN providers, or verify and add
// custom metadata before wiring.`;
}

export function generateConfig(config: ExportConfig): string {
  const {
    sourceChain,
    destChain,
    requiredDVNs,
    optionalDVNs,
    optionalThreshold,
    mode = 'wire-ready',
  } = config;

  if (mode === 'explore') {
    return validationBlock([
      'Explore mode is for understanding DVN diversity and metadata gaps.',
      'Switch to Wire-ready mode to generate a copy-pasteable LayerZero config.',
    ]);
  }
  const boundedOptionalThreshold = Math.max(
    0,
    Math.min(optionalThreshold, optionalDVNs.length),
  );
  const effectiveCount = requiredDVNs.length + boundedOptionalThreshold;

  if (effectiveCount === 0) {
    return validationBlock([
      'Select at least one required DVN or an optional DVN threshold greater than zero.',
    ]);
  }

  const selectedDVNs = [...requiredDVNs, ...optionalDVNs];
  const unavailableReasons = getUnavailableDvnReasons({
    sourceChain,
    destChain,
    dvns: selectedDVNs,
  });

  if (unavailableReasons.length > 0) {
    return validationBlock(unavailableReasons);
  }

  const requiredNames = requiredDVNs.map((dvn) => getCanonicalDvnName(dvn));
  const optionalNames = optionalDVNs.map((dvn) => getCanonicalDvnName(dvn));
  const sourceEidName =
    CHAIN_EID_NAMES[sourceChain.eid] || `UNKNOWN_${sourceChain.eid}`;
  const destEidName = CHAIN_EID_NAMES[destChain.eid] || `UNKNOWN_${destChain.eid}`;
  const dvnConfig = formatDvnConfig(
    requiredNames,
    optionalNames,
    boundedOptionalThreshold,
  );

  return `import { ExecutorOptionType } from '@layerzerolabs/lz-v2-utilities';
import type { OAppEnforcedOption, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat';
import { EndpointId } from '@layerzerolabs/lz-definitions';
import { generateConnectionsConfig } from '@layerzerolabs/metadata-tools';

const sourceContract: OmniPointHardhat = {
  eid: EndpointId.${sourceEidName},
  contractName: 'MyOApp',
};

const destinationContract: OmniPointHardhat = {
  eid: EndpointId.${destEidName},
  contractName: 'MyOApp',
};

const EVM_ENFORCED_OPTIONS: OAppEnforcedOption[] = [
  {
    msgType: 1,
    optionType: ExecutorOptionType.LZ_RECEIVE,
    gas: 80000,
    value: 0,
  },
];

export default async function () {
  const connections = await generateConnectionsConfig([
    [
      sourceContract,
      destinationContract,
      ${dvnConfig},
      [15, 15],
      [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS],
    ],
  ]);

  return {
    contracts: [
      { contract: sourceContract },
      { contract: destinationContract },
    ],
    connections,
  };
}`;
}
