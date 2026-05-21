import type { DVN } from './dvns';

export type Grade = 'F' | 'C' | 'A' | 'A+';

export interface NextStep {
  label: string;
}

export interface GradeResult {
  grade: Grade;
  headline: string;
  reason: string;
  effective: number;
  threshold: string;
  categoriesPresent: Set<DVN['category']>;
  dvnsByCategory: Record<DVN['category'], DVN[]>;
  kelpDaoWarning?: boolean;
  nextStep?: NextStep;
}

export interface GradeConfig {
  requiredDVNs: DVN[];
  optionalDVNs: DVN[];
  optionalThreshold: number;
}

const ALL_CATEGORIES: DVN['category'][] = [
  'native',
  'zk-light-client',
  'attestation',
  'multisig-consortium',
];

function categoryCount(dvns: DVN[]): number {
  return new Set(dvns.map((dvn) => dvn.category)).size;
}

// Combinatorial worst-case scoring: enumerates all C(n, k) subsets to find
// the threshold-satisfying selection with the fewest distinct categories.
// Intentional for this bounded v0 testnet DVN set, not arbitrary DVN counts.
function selectWeakestOptionalSubset({
  requiredDVNs,
  optionalDVNs,
  threshold,
}: {
  requiredDVNs: DVN[];
  optionalDVNs: DVN[];
  threshold: number;
}): DVN[] {
  if (threshold <= 0) return [];
  if (threshold >= optionalDVNs.length) return [...optionalDVNs];

  const sortedOptionals = [...optionalDVNs].sort((a, b) => {
    const categoryComparison = a.category.localeCompare(b.category);
    if (categoryComparison !== 0) return categoryComparison;
    return a.id.localeCompare(b.id);
  });

  let weakestSubset: DVN[] = [];
  let weakestCategoryCount = Number.POSITIVE_INFINITY;

  function visit(start: number, subset: DVN[]) {
    if (subset.length === threshold) {
      const candidateCategoryCount = categoryCount([...requiredDVNs, ...subset]);
      if (candidateCategoryCount < weakestCategoryCount) {
        weakestSubset = [...subset];
        weakestCategoryCount = candidateCategoryCount;
      }
      return;
    }

    const remainingSlots = threshold - subset.length;
    for (let index = start; index <= sortedOptionals.length - remainingSlots; index += 1) {
      subset.push(sortedOptionals[index]);
      visit(index + 1, subset);
      subset.pop();
    }
  }

  visit(0, []);
  return weakestSubset;
}

export function grade(config: GradeConfig): GradeResult {
  const boundedOptionalThreshold = Math.max(
    0,
    Math.min(config.optionalDVNs.length, config.optionalThreshold),
  );
  const effectiveOptional = selectWeakestOptionalSubset({
    requiredDVNs: config.requiredDVNs,
    optionalDVNs: config.optionalDVNs,
    threshold: boundedOptionalThreshold,
  });
  const allEffective = [...config.requiredDVNs, ...effectiveOptional];
  const effective = allEffective.length;
  const categoriesPresent = new Set(allEffective.map((d) => d.category));

  const dvnsByCategory = ALL_CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = allEffective.filter((d) => d.category === cat);
      return acc;
    },
    {} as Record<DVN['category'], DVN[]>,
  );

  const totalSelected =
    config.requiredDVNs.length + config.optionalDVNs.length;
  const totalEffective = config.requiredDVNs.length + boundedOptionalThreshold;
  const threshold = `${totalEffective} / ${totalSelected || totalEffective}`;

  const base = { effective, threshold, categoriesPresent, dvnsByCategory };

  if (effective <= 1) {
    return {
      ...base,
      grade: 'F',
      headline: 'Single point of failure',
      reason:
        'A configuration resolving to one or fewer effective DVNs creates a single verifier failure mode. Public KelpDAO post-mortems describe this class of 1-of-1 DVN setup as the high-risk pattern to avoid.',
      kelpDaoWarning: true,
      nextStep: { label: 'Add a 2nd DVN with a different verification model' },
    };
  }

  if (categoriesPresent.size === 1) {
    return {
      ...base,
      grade: 'C',
      headline: 'Same verification model',
      reason:
        'The effective DVNs do not add verification-model diversity. A shared weakness in that category could affect the whole verifier set.',
      nextStep: { label: 'Add a DVN from another category' },
    };
  }

  if (effective >= 3 && categoriesPresent.size >= 3) {
    return {
      ...base,
      grade: 'A+',
      headline: 'Defense in depth',
      reason:
        'The effective DVNs span at least three verification categories. This is a bonus signal for broader verifier diversity, not a deployment recommendation.',
    };
  }

  return {
    ...base,
    grade: 'A',
    headline: 'Cross-model diversity',
    reason:
      'The effective DVNs span at least two verification categories, reducing dependence on a single verifier model.',
    nextStep: { label: 'Add a 3rd category for the A+ diversity bonus' },
  };
}
