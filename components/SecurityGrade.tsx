'use client';

import { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import type { GradeResult } from '@/lib/grader';
import { GRADE_ACCENT } from '@/lib/grade-style';
import { CATEGORY_COLOR } from '@/lib/category-style';
import type { DVN } from '@/lib/dvns';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { GradeChip } from './GradeChip';

interface Props {
  result: GradeResult;
  onApplyEducationalExample: () => void;
}

const CATEGORY_SHORT: Record<DVN['category'], string> = {
  native: 'NATIVE',
  'zk-light-client': 'ZK',
  attestation: 'ATTEST',
  'multisig-consortium': 'MULTISIG',
};
const KELPDAO_SOURCE_URL =
  'https://www.chainalysis.com/blog/kelpdao-bridge-exploit-april-2026/';

export function SecurityGrade({ result, onApplyEducationalExample }: Props) {
  const [open, setOpen] = useState(false);
  const accent = GRADE_ACCENT[result.grade];
  const showCta = result.grade === 'F' || result.grade === 'C';

  return (
    <section
      id="security-grade"
      aria-live="polite"
      className="scroll-mt-20 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4"
    >
      <div className="flex items-start gap-3">
        <GradeChip grade={result.grade} />
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-zinc-100">{result.headline}</h3>
          <p className="max-w-3xl text-xs leading-relaxed text-zinc-400">
            {result.reason}
          </p>
        </div>
      </div>

      <div className="mt-3 flex gap-6 border-t border-zinc-800 pt-3 font-mono text-xs">
        <Metric label="EFFECTIVE" value={result.effective} />
        <Metric
          label="CATEGORIES"
          value={`${result.categoriesPresent.size} / 4`}
          accent={accent.text}
        />
        <Metric label="THRESHOLD" value={result.threshold} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-1.5 xl:grid-cols-4">
        {(Object.keys(CATEGORY_SHORT) as DVN['category'][]).map((catId) => {
          const dvns = result.dvnsByCategory[catId] ?? [];
          const filled = dvns.length > 0;

          return (
            <div
              key={catId}
              aria-label={`${CATEGORY_SHORT[catId]}: ${
                filled
                  ? `${dvns.length} DVNs — ${dvns.map((d) => d.name).join(', ')}`
                  : 'none'
              }`}
              className={cn(
                'flex min-h-[70px] flex-col gap-1 rounded-md px-2.5 py-2',
                filled
                  ? cn('border', accent.border, accent.tint)
                  : 'border border-dashed border-zinc-800',
              )}
            >
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wide',
                  filled ? accent.text : 'text-zinc-600',
                )}
              >
                <span
                  aria-hidden
                  className={cn('h-1.5 w-1.5 rounded-full', !filled && 'opacity-40')}
                  style={{ background: CATEGORY_COLOR[catId] }}
                />
                {CATEGORY_SHORT[catId]}
              </span>
              <span
                className={cn(
                  'mt-0.5 font-mono text-xl font-medium leading-none',
                  filled ? 'text-zinc-100' : 'text-zinc-700',
                )}
              >
                {filled ? dvns.length : '—'}
              </span>
              <span
                className={cn(
                  'mt-auto text-[10px] leading-tight',
                  filled ? 'text-zinc-400' : 'text-zinc-700',
                )}
              >
                {filled ? dvns.map((d) => d.name).join(', ') : 'none'}
              </span>
            </div>
          );
        })}
      </div>

      {result.nextStep && (
        <div className="mt-3 flex flex-wrap items-center gap-2.5 border-t border-zinc-800 pt-3">
          <span
            className={cn(
              'font-mono text-[10px] tracking-wide whitespace-nowrap',
              accent.text,
            )}
          >
            NEXT →
          </span>
          <span className="text-xs text-zinc-300">{result.nextStep.label}</span>
          {showCta && (
            <Button
              onClick={onApplyEducationalExample}
              variant="outline"
              size="sm"
              className="ml-auto h-7 border-zinc-800 bg-transparent text-xs text-zinc-200 hover:bg-zinc-900 hover:text-zinc-100"
            >
              <Sparkles className="mr-1.5 h-3 w-3" />
              Try a diverse example
            </Button>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-zinc-500 transition-colors hover:text-zinc-300"
      >
        <ChevronDown
          className={cn('h-3 w-3 transition-transform', open ? '' : '-rotate-90')}
        />
        Why this matters — KelpDAO context
      </button>
      {open && (
        <div
          className={cn(
            'mt-2 border-l-2 pl-3 text-[11px] leading-relaxed text-zinc-400',
            accent.border,
          )}
        >
          KelpDAO{' '}
          <a
            href={KELPDAO_SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-100 underline underline-offset-[3px] hover:text-white"
          >
            lost approximately $292M on April 18, 2026
          </a>{' '}
          while using a 1-of-1 DVN setup. Public post-mortems describe an
          RPC-poisoning attack against the lone verifier. The matrix above
          renders the structural defense: diversity across verification
          categories.
        </div>
      )}
    </section>
  );
}

function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9px] uppercase tracking-wide text-zinc-600">
        {label}
      </span>
      <span
        className={cn('text-[13px] font-medium', accent ?? 'text-zinc-100')}
      >
        {value}
      </span>
    </div>
  );
}
