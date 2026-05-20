'use client';

import type { Grade, GradeResult } from '@/lib/grader';
import { GRADE_ACCENT } from '@/lib/grade-style';
import { cn } from '@/lib/utils';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

export function GradeChip({
  grade,
  className,
}: {
  grade: Grade;
  className?: string;
}) {
  const accent = GRADE_ACCENT[grade];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5',
        'font-mono text-xs whitespace-nowrap',
        accent.text,
        accent.border,
        className,
      )}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_6px_currentColor]"
      />
      GRADE {grade}
    </span>
  );
}

/**
 * GradeChipHover: chip + popover preview. Glance reading from the chip,
 * preview reading on hover/focus, full reading by following the anchor
 * down to the SecurityGrade card.
 */
export function GradeChipHover({ result }: { result: GradeResult }) {
  const accent = GRADE_ACCENT[result.grade];

  return (
    <HoverCard openDelay={120} closeDelay={80}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          aria-label={`Security grade ${result.grade}: ${result.headline}`}
          className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/40"
        >
          <GradeChip grade={result.grade} />
        </button>
      </HoverCardTrigger>
      <HoverCardContent
        side="bottom"
        align="start"
        className="w-80 border-zinc-800 bg-zinc-950/95 p-3 text-zinc-100 backdrop-blur"
      >
        <div className="flex items-center gap-2">
          <GradeChip grade={result.grade} />
          <span className="text-sm font-medium">{result.headline}</span>
        </div>

        <div className="mt-2.5 flex gap-5 border-t border-zinc-800 pt-2.5 font-mono">
          <Stat label="Effective" value={result.effective} />
          <Stat
            label="Categories"
            value={`${result.categoriesPresent.size} / 4`}
            accent={accent.text}
          />
          <Stat label="Threshold" value={result.threshold} />
        </div>

        {result.nextStep && (
          <div className="mt-2.5 flex items-start gap-2 border-t border-zinc-800 pt-2.5">
            <span
              className={cn(
                'font-mono text-[10px] tracking-wide whitespace-nowrap',
                accent.text,
              )}
            >
              NEXT -&gt;
            </span>
            <span className="text-[11px] text-zinc-300">
              {result.nextStep.label}
            </span>
          </div>
        )}

        <a
          href="#security-grade"
          className="mt-2.5 inline-block text-[11px] text-zinc-500 underline underline-offset-[3px] hover:text-zinc-300"
        >
          Open full grade
        </a>
      </HoverCardContent>
    </HoverCard>
  );
}

function Stat({
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
      <span className={cn('text-xs font-medium', accent ?? 'text-zinc-100')}>
        {value}
      </span>
    </div>
  );
}
