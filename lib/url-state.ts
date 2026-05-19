import type { Chain } from './chains';
import { CHAINS } from './chains';
import type { DVN } from './dvns';
import { DVNS } from './dvns';

export interface UrlConfigState {
  sourceChain: Chain;
  destChain: Chain;
  requiredDVNs: DVN[];
  optionalDVNs: DVN[];
  optionalThreshold: number;
}

const PARAM_SOURCE = 'source';
const PARAM_DESTINATION = 'dest';
const PARAM_REQUIRED = 'req';
const PARAM_OPTIONAL = 'opt';
const PARAM_THRESHOLD = 'threshold';

const chainById = new Map(CHAINS.map((chain) => [chain.id, chain]));
const dvnById = new Map(DVNS.map((dvn) => [dvn.id, dvn]));

function parseList(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
}

function uniqueKnownDvns(ids: string[]): DVN[] {
  const seen = new Set<string>();

  return ids.reduce<DVN[]>((dvns, id) => {
    const dvn = dvnById.get(id);
    if (!dvn || seen.has(id)) return dvns;

    seen.add(id);
    dvns.push(dvn);
    return dvns;
  }, []);
}

export function parseUrlConfig(search: string): Partial<UrlConfigState> {
  const params = new URLSearchParams(search);
  const sourceChain = chainById.get(params.get(PARAM_SOURCE) ?? '');
  const destChain = chainById.get(params.get(PARAM_DESTINATION) ?? '');
  const requiredDVNs = uniqueKnownDvns(parseList(params.get(PARAM_REQUIRED)));
  const requiredIds = new Set(requiredDVNs.map((dvn) => dvn.id));
  const optionalDVNs = uniqueKnownDvns(parseList(params.get(PARAM_OPTIONAL))).filter(
    (dvn) => !requiredIds.has(dvn.id)
  );
  const parsedThreshold = Number.parseInt(params.get(PARAM_THRESHOLD) ?? '', 10);
  const optionalThreshold = Number.isFinite(parsedThreshold)
    ? Math.max(0, Math.min(optionalDVNs.length, parsedThreshold))
    : undefined;

  return {
    ...(sourceChain ? { sourceChain } : {}),
    ...(destChain ? { destChain } : {}),
    ...(params.has(PARAM_REQUIRED) ? { requiredDVNs } : {}),
    ...(params.has(PARAM_OPTIONAL) ? { optionalDVNs } : {}),
    ...(optionalThreshold !== undefined ? { optionalThreshold } : {}),
  };
}

export function serializeUrlConfig(config: UrlConfigState): string {
  const params = new URLSearchParams();

  params.set(PARAM_SOURCE, config.sourceChain.id);
  params.set(PARAM_DESTINATION, config.destChain.id);

  if (config.requiredDVNs.length > 0) {
    params.set(PARAM_REQUIRED, config.requiredDVNs.map((dvn) => dvn.id).join(','));
  }

  if (config.optionalDVNs.length > 0) {
    params.set(PARAM_OPTIONAL, config.optionalDVNs.map((dvn) => dvn.id).join(','));
    params.set(PARAM_THRESHOLD, String(Math.min(config.optionalThreshold, config.optionalDVNs.length)));
  }

  return params.toString();
}
