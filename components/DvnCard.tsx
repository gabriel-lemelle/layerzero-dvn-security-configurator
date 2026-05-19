'use client';

import { X } from 'lucide-react';
import type { DVN } from '@/lib/dvns';
import { DVN_CATEGORY_LABELS } from '@/lib/dvns';
import { cn } from '@/lib/utils';

interface DvnCardProps {
  dvn: DVN;
  onRemove?: () => void;
  onClick?: () => void;
  selected?: boolean;
  compact?: boolean;
}

const categoryColors: Record<DVN['category'], string> = {
  'native': 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  'zk-light-client': 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  'attestation': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'multisig-consortium': 'bg-teal-500/20 text-teal-300 border-teal-500/30',
};

export function DvnCard({ dvn, onRemove, onClick, selected, compact }: DvnCardProps) {
  const isClickable = !!onClick;
  const Wrapper = isClickable ? 'button' : 'div';

  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        'w-full text-left rounded-lg border transition-all',
        isClickable && 'hover:border-emerald-500/50 hover:bg-emerald-500/5 cursor-pointer',
        selected ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-800 bg-zinc-900/50',
        compact ? 'px-3 py-2' : 'p-3'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className={cn('font-medium text-zinc-100', compact ? 'text-sm' : 'text-base')}>
              {dvn.name}
            </h4>
            <span
              className={cn(
                'inline-flex px-2 py-0.5 rounded text-xs font-medium border',
                categoryColors[dvn.category]
              )}
            >
              {DVN_CATEGORY_LABELS[dvn.category]}
            </span>
          </div>
          {!compact && (
            <p className="text-sm text-zinc-400 leading-relaxed">{dvn.trustModel}</p>
          )}
          {dvn.note && (
            <p className="text-xs text-amber-400">{dvn.note}</p>
          )}
        </div>
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="shrink-0 p-1 rounded hover:bg-zinc-800 transition-colors text-zinc-500 hover:text-zinc-300"
            aria-label={`Remove ${dvn.name}`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </Wrapper>
  );
}
