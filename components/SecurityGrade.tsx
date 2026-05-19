'use client';

import { AlertTriangle, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import type { GradeResult } from '@/lib/grader';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SecurityGradeProps {
  result: GradeResult;
  onApplyGradeAConfig: () => void;
}

const gradeConfig = {
  F: {
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    ringColor: 'ring-red-500/30',
    Icon: AlertTriangle,
  },
  C: {
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    ringColor: 'ring-amber-500/30',
    Icon: AlertCircle,
  },
  A: {
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    ringColor: 'ring-emerald-500/30',
    Icon: CheckCircle,
  },
};

export function SecurityGrade({ result, onApplyGradeAConfig }: SecurityGradeProps) {
  const config = gradeConfig[result.grade];
  const GradeIcon = config.Icon;

  return (
    <section className="py-6">
      <div
        className={cn(
          'rounded-xl border p-6',
          config.bgColor,
          config.borderColor
        )}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Grade Circle */}
          <div
            className={cn(
              'shrink-0 w-24 h-24 rounded-full flex items-center justify-center ring-4',
              config.bgColor,
              config.ringColor
            )}
          >
            <span className={cn('text-5xl font-bold', config.color)}>
              {result.grade}
            </span>
          </div>

          {/* Grade Details */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <GradeIcon className={cn('h-5 w-5', config.color)} />
              <h3 className={cn('text-lg font-semibold', config.color)}>
                {result.headline}
              </h3>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {result.reason}
            </p>
          </div>
        </div>

        {/* KelpDAO Warning Panel */}
        {result.kelpDaoWarning && (
          <div className="mt-6 pt-6 border-t border-red-500/20">
            <div className="bg-red-950/50 border border-red-500/40 rounded-lg p-4 space-y-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-semibold text-red-300">
                    Single point of failure detected — this matches the KelpDAO exploit pattern
                  </h4>
                  <p className="text-sm text-red-200/80">
                    On April 18, 2026, KelpDAO lost approximately $292M while using a 1-of-1 DVN
                    setup. Public post-mortems describe an RPC-poisoning attack that caused the lone
                    verifier to accept a forged cross-chain message. Your current configuration has the
                    same single-verifier failure mode.
                  </p>
                </div>
              </div>
              <Button
                onClick={onApplyGradeAConfig}
                variant="outline"
                className="w-full md:w-auto border-red-500/50 text-red-300 hover:bg-red-500/10 hover:text-red-200 hover:border-red-500"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Show an educational Grade A example
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
