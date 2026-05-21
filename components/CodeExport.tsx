'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Highlight, themes } from 'prism-react-renderer';
import { Button } from '@/components/ui/button';

interface CodeExportProps {
  code: string;
  mode: 'wire-ready' | 'explore';
}

export function CodeExport({ code, mode }: CodeExportProps) {
  const [copied, setCopied] = useState(false);
  const isWireReady = mode === 'wire-ready' && !code.startsWith('// Cannot generate');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      return;
    }
  };

  return (
    <section className="min-w-0 max-w-full space-y-4 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-zinc-100">
            {isWireReady ? 'Wire-ready Config' : 'Export Unavailable'}
          </h2>
          <p className="text-xs text-zinc-500">
            {isWireReady
              ? 'Generated with official LayerZero metadata provider names.'
              : mode === 'explore'
                ? 'Explore mode explains stack structure without emitting copy-paste config.'
                : 'This pathway needs metadata-backed DVNs before export.'}
          </p>
        </div>
        <Button
          onClick={handleCopy}
          disabled={!isWireReady}
          variant="outline"
          size="sm"
          className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2 text-zinc-300" />
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

      <div className="max-w-full overflow-hidden rounded-lg border border-zinc-800">
        <div className="bg-zinc-900/80 px-4 py-2 border-b border-zinc-800">
          <span className="text-xs text-zinc-500 font-mono">layerzero.config.ts</span>
        </div>
        <Highlight theme={themes.nightOwl} code={code} language="typescript">
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={`${className} max-w-full overflow-x-auto p-4 text-sm leading-relaxed`}
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
        Wire-ready output uses the official <span className="font-mono text-zinc-400">generateConnectionsConfig</span> shape.
        Replace <span className="font-mono text-zinc-400">contractName: 'MyOApp'</span> and inspect enforced options before wiring.
      </p>
    </section>
  );
}
