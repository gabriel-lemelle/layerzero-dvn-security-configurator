'use client';

import { useState } from 'react';
import { X, AlertTriangle, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export function KelpDaoBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isDismissed) return null;

  return (
    <>
      <div className="sticky top-0 z-50 bg-amber-500/10 border-b border-amber-500/30 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-amber-200">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <p className="text-sm">
              The KelpDAO exploit (Apr 18, 2026, $292M) was caused by a 1-of-1 DVN configuration.
              This tool helps you avoid that exact failure mode.{' '}
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-amber-100 underline underline-offset-2 hover:text-white transition-colors"
              >
                Learn more →
              </button>
            </p>
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            className="shrink-0 p-1 rounded hover:bg-amber-500/20 transition-colors text-amber-300 hover:text-amber-100"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-xl text-zinc-100">The KelpDAO Exploit: A Cautionary Tale</DialogTitle>
            <DialogDescription className="sr-only">
              Details about the KelpDAO exploit and how to prevent similar attacks
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-zinc-300">
            <p>
              On April 18, 2026, the KelpDAO observation layer was exploited for approximately $292 million
              (116,500 rsETH). The root cause was a 1-of-1 DVN configuration that relied solely on the
              LayerZero Labs DVN. Attackers poisoned the RPC nodes that the DVN read from, tricking the
              bridge into releasing funds against a forged burn transaction.
            </p>
            <p>
              A multi-DVN setup with diverse verification methods — for example, combining a native DVN
              with a ZK light client — would have prevented this attack. Even if one verification method
              is compromised, the other would catch the discrepancy.
            </p>
            <div className="pt-2 border-t border-zinc-800">
              <p className="text-sm font-medium text-zinc-100">
                Minimum recommended configuration for production:
              </p>
              <p className="text-sm text-zinc-400 mt-1">
                2 DVNs with distinct verification categories
              </p>
            </div>
            <a
              href="https://www.chainalysis.com/blog/kelpdao-exploit-2026"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
            >
              Read the full post-mortem
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
