'use client';

import { useState } from 'react';
import { Check, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ShareLink() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      return;
    }
  };

  return (
    <Button
      onClick={handleCopy}
      variant="outline"
      size="sm"
      className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-2 text-zinc-300" />
          Link copied
        </>
      ) : (
        <>
          <LinkIcon className="h-4 w-4 mr-2" />
          Copy share link
        </>
      )}
    </Button>
  );
}
