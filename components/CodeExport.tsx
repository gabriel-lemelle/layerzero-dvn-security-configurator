'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Highlight, themes } from 'prism-react-renderer';
import { Button } from '@/components/ui/button';

interface CodeExportProps {
  code: string;
}

export function CodeExport({ code }: CodeExportProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-zinc-100">Generated Config</h2>
        <Button
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2 text-emerald-500" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy to clipboard
            </>
          )}
        </Button>
      </div>

      <div className="rounded-lg border border-zinc-800 overflow-hidden">
        <div className="bg-zinc-900/80 px-4 py-2 border-b border-zinc-800">
          <span className="text-xs text-zinc-500 font-mono">layerzero.config.ts</span>
        </div>
        <Highlight theme={themes.nightOwl} code={code} language="typescript">
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={`${className} overflow-x-auto p-4 text-sm leading-relaxed`}
              style={{ ...style, background: '#0a0a0a' }}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  <span className="inline-block w-8 text-zinc-600 select-none text-right mr-4 font-mono text-xs">
                    {i + 1}
                  </span>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>

      <p className="text-xs text-zinc-500">
        This fragment is compatible with <span className="font-mono text-zinc-400">@layerzerolabs/metadata-tools</span>.
        DVN addresses are sorted alphabetically (lowercase) as required by the LayerZero protocol.
      </p>
    </section>
  );
}
