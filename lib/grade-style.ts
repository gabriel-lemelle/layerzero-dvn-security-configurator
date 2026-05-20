import type { Grade } from './grader';

export const GRADE_ACCENT: Record<
  Grade,
  { text: string; border: string; tint: string }
> = {
  F: {
    text: 'text-red-400',
    border: 'border-red-500/40',
    tint: 'bg-zinc-900/40',
  },
  C: {
    text: 'text-amber-400',
    border: 'border-amber-500/40',
    tint: 'bg-amber-500/[0.04]',
  },
  A: {
    text: 'text-emerald-400',
    border: 'border-emerald-500/40',
    tint: 'bg-emerald-500/[0.04]',
  },
  'A+': {
    text: 'text-emerald-300',
    border: 'border-emerald-400/50',
    tint: 'bg-emerald-500/[0.06]',
  },
};

export const GRADE_HEADLINE: Record<Grade, string> = {
  F: 'Single point of failure',
  C: 'Same verification model',
  A: 'Cross-model diversity',
  'A+': 'Defense in depth',
};
