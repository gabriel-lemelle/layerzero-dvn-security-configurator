import type { DVN } from './dvns';

export interface GradeResult {
  grade: 'F' | 'C' | 'A';
  headline: string;
  reason: string;
  kelpDaoWarning?: boolean;
}

export interface GradeConfig {
  requiredDVNs: DVN[];
  optionalDVNs: DVN[];
  optionalThreshold: number;
}

export function grade(config: GradeConfig): GradeResult {
  const effectiveDVNCount = config.requiredDVNs.length + Math.min(config.optionalDVNs.length, config.optionalThreshold);

  // Grade F: single point of failure
  if (effectiveDVNCount <= 1) {
    return {
      grade: 'F',
      headline: 'Single point of failure',
      reason: 'A configuration that resolves to a single effective DVN matches the failure mode described in public KelpDAO post-mortems from April 2026. Attackers poisoned RPC infrastructure feeding the lone DVN and caused the bridge to release funds against a forged cross-chain message. Add at least one additional DVN with a different verification model.',
      kelpDaoWarning: true,
    };
  }

  // Grade C: ≥2 DVNs but homogeneous category
  const allEffective = [...config.requiredDVNs, ...config.optionalDVNs.slice(0, config.optionalThreshold)];
  const distinctCategories = new Set(allEffective.map(d => d.category));
  if (distinctCategories.size === 1) {
    return {
      grade: 'C',
      headline: 'Same verification model across all DVNs',
      reason: `All your selected DVNs share the same verification model (${allEffective[0].category}). A coordinated failure or shared infrastructure compromise within that category — for example, a vulnerability in the underlying ZK circuit, or a phishing of a multisig consortium — could compromise verification for the entire set. Add a DVN with a different category to raise to Grade A.`,
    };
  }

  // Grade A: ≥2 DVNs with distinct categories
  return {
    grade: 'A',
    headline: 'Cross-model diversity',
    reason: `Configuration uses ${effectiveDVNCount} effective DVNs across ${distinctCategories.size} distinct verification models (${[...distinctCategories].join(', ')}). Cross-model diversity is the strongest defense against single-vendor compromise, RPC poisoning, or method-specific cryptographic failures.`,
  };
}
