'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Composer } from '@/components/Composer';
import { SecurityGrade } from '@/components/SecurityGrade';
import { CodeExport } from '@/components/CodeExport';
import { ShareLink } from '@/components/ShareLink';
import type { DVN } from '@/lib/dvns';
import { DVNS } from '@/lib/dvns';
import type { Chain } from '@/lib/chains';
import { CHAINS } from '@/lib/chains';
import { grade } from '@/lib/grader';
import { generateConfig } from '@/lib/exporter';
import { parseUrlConfig, serializeUrlConfig } from '@/lib/url-state';
import { cn } from '@/lib/utils';
import {
  hasActiveDvnMetadata,
  isDvnActiveForChainPair,
} from '@/lib/layerzero-metadata';

const DEFAULT_SOURCE_CHAIN =
  CHAINS.find((chain) => chain.id === 'base-sepolia') ?? CHAINS[0];
const DEFAULT_DEST_CHAIN =
  CHAINS.find((chain) => chain.id === 'optimism-sepolia') ?? CHAINS[1];
const KELPDAO_SOURCE_URL =
  'https://www.chainalysis.com/blog/kelpdao-bridge-exploit-april-2026/';

export default function Home() {
  const [mode, setMode] = useState<'wire-ready' | 'explore'>('wire-ready');
  const [sourceChain, setSourceChain] = useState<Chain>(DEFAULT_SOURCE_CHAIN);
  const [destChain, setDestChain] = useState<Chain>(DEFAULT_DEST_CHAIN);
  const [requiredDVNs, setRequiredDVNs] = useState<DVN[]>([]);
  const [optionalDVNs, setOptionalDVNs] = useState<DVN[]>([]);
  const [optionalThreshold, setOptionalThreshold] = useState(0);
  const [urlStateReady, setUrlStateReady] = useState(false);

  useEffect(() => {
    const parsedConfig = parseUrlConfig(window.location.search);

    if (parsedConfig.sourceChain) setSourceChain(parsedConfig.sourceChain);
    if (parsedConfig.destChain) setDestChain(parsedConfig.destChain);
    if (parsedConfig.requiredDVNs) setRequiredDVNs(parsedConfig.requiredDVNs);
    if (parsedConfig.optionalDVNs) setOptionalDVNs(parsedConfig.optionalDVNs);
    if (parsedConfig.optionalThreshold !== undefined) {
      setOptionalThreshold(parsedConfig.optionalThreshold);
    }

    setUrlStateReady(true);
  }, []);

  useEffect(() => {
    if (!urlStateReady) return;
    if (mode === 'explore') return;

    if (!hasActiveDvnMetadata(sourceChain) || !hasActiveDvnMetadata(destChain)) {
      setSourceChain(DEFAULT_SOURCE_CHAIN);
      setDestChain(DEFAULT_DEST_CHAIN);
      return;
    }

    const compatible = (dvn: DVN) =>
      isDvnActiveForChainPair(dvn, sourceChain, destChain);

    setRequiredDVNs((current) => current.filter(compatible));
    setOptionalDVNs((current) => current.filter(compatible));
  }, [destChain, mode, sourceChain, urlStateReady]);

  useEffect(() => {
    if (!urlStateReady) return;
    setOptionalThreshold((currentThreshold) =>
      Math.min(currentThreshold, optionalDVNs.length),
    );
  }, [optionalDVNs.length, urlStateReady]);

  useEffect(() => {
    if (!urlStateReady) return;

    const query = serializeUrlConfig({
      sourceChain,
      destChain,
      requiredDVNs,
      optionalDVNs,
      optionalThreshold,
    });
    const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;

    window.history.replaceState(null, '', nextUrl);
  }, [sourceChain, destChain, requiredDVNs, optionalDVNs, optionalThreshold, urlStateReady]);

  const gradeResult = useMemo(() => {
    return grade({
      requiredDVNs,
      optionalDVNs,
      optionalThreshold,
    });
  }, [requiredDVNs, optionalDVNs, optionalThreshold]);

  const generatedCode = useMemo(() => {
    return generateConfig({
      sourceChain,
      destChain,
      requiredDVNs,
      optionalDVNs,
      optionalThreshold,
      mode,
    });
  }, [sourceChain, destChain, requiredDVNs, optionalDVNs, optionalThreshold, mode]);

  const applyEducationalExample = () => {
    const lzLabsDVN = DVNS.find((dvn) => dvn.id === 'layerzero-labs');
    const horizenDVN = DVNS.find((dvn) => dvn.id === 'horizen-labs');
    const nethermindDVN = DVNS.find((dvn) => dvn.id === 'nethermind');
    
    if (lzLabsDVN && horizenDVN && nethermindDVN) {
      setSourceChain(DEFAULT_SOURCE_CHAIN);
      setDestChain(DEFAULT_DEST_CHAIN);
      setRequiredDVNs([lzLabsDVN, horizenDVN, nethermindDVN]);
      setOptionalDVNs([]);
      setOptionalThreshold(0);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <main className="mx-auto w-screen max-w-7xl space-y-8 overflow-x-hidden px-4 py-8">
        <header className="space-y-3 pb-6 border-b border-zinc-800">
          <div className="flex flex-col gap-1 text-[11px] text-zinc-600 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-2">
            <span>Built by Gabriel Lemelle</span>
            <span className="flex flex-wrap items-center gap-2">
              <Link
                href="/about"
                className="text-zinc-500 underline underline-offset-2 hover:text-zinc-300"
              >
                Case study -&gt;
              </Link>
              <span aria-hidden>·</span>
              <a
                href="https://github.com/gabriel-lemelle/layerzero-dvn-security-configurator"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 underline underline-offset-2 hover:text-zinc-300"
              >
                GitHub -&gt;
              </a>
            </span>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-1.5">
              <div className="font-mono text-[11px] uppercase tracking-wide text-zinc-500">
                LayerZero V2 · Read-only
              </div>
              <h1 className="text-2xl font-semibold text-zinc-100">
                DVN Configurator
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
                A single-verifier LayerZero setup reportedly cost KelpDAO{' '}
                <span className="inline-block whitespace-nowrap">
                  <a
                    href={KELPDAO_SOURCE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-200 underline underline-offset-[3px] hover:text-white"
                  >
                    ~$292M
                  </a>{' '}
                  on Apr 18, 2026.
                </span>{' '}
                This tool makes that failure mode visible before config ships.
              </p>
            </div>
            <ShareLink />
          </div>
        </header>

        <section className="space-y-3">
          <h2 className="text-sm font-medium text-zinc-100">Generation mode</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setMode('wire-ready')}
              className={cn(
                'rounded-md border p-3 text-left transition-colors',
                mode === 'wire-ready'
                  ? 'border-zinc-600 bg-zinc-900 text-zinc-100'
                  : 'border-zinc-800 bg-zinc-950/60 text-zinc-500 hover:border-zinc-700 hover:text-zinc-200',
              )}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium">Wire-ready</span>
                <span className="font-mono text-[9px] uppercase tracking-wide text-zinc-500">
                  Export on
                </span>
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-zinc-500">
                Verified metadata-backed pathways only.
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMode('explore')}
              className={cn(
                'rounded-md border p-3 text-left transition-colors',
                mode === 'explore'
                  ? 'border-zinc-600 bg-zinc-900 text-zinc-100'
                  : 'border-zinc-800 bg-zinc-950/60 text-zinc-500 hover:border-zinc-700 hover:text-zinc-200',
              )}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium">Explore</span>
                <span className="font-mono text-[9px] uppercase tracking-wide text-zinc-500">
                  Export off
                </span>
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-zinc-500">
                Preview unsupported chain pairs for learning.
              </span>
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0 lg:col-start-1">
            <Composer
              mode={mode}
              sourceChain={sourceChain}
              destChain={destChain}
              requiredDVNs={requiredDVNs}
              optionalDVNs={optionalDVNs}
              optionalThreshold={optionalThreshold}
              onSourceChainChange={setSourceChain}
              onDestChainChange={setDestChain}
              onRequiredDVNsChange={setRequiredDVNs}
              onOptionalDVNsChange={setOptionalDVNs}
              onOptionalThresholdChange={setOptionalThreshold}
            />
          </div>

          <aside className="lg:sticky lg:top-6 lg:col-start-2 lg:row-span-2 lg:self-start">
            <SecurityGrade
              result={gradeResult}
              onApplyEducationalExample={applyEducationalExample}
            />
          </aside>

          <div className="min-w-0 lg:col-start-1">
            <CodeExport code={generatedCode} mode={mode} />
          </div>
        </div>

        <footer className="pt-8 border-t border-zinc-800">
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <Link
              href="/about"
              className="text-xs text-zinc-500 underline underline-offset-2 hover:text-zinc-300"
            >
              About this project
            </Link>
            <p className="text-xs text-zinc-600 sm:text-right">
              DVN metadata:{' '}
              <a
                href="https://metadata.layerzero-api.com/v1/metadata"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-zinc-400 underline underline-offset-2"
              >
                LayerZero registry snapshot May 20, 2026
              </a>
              {' '}· EVM testnets only · Read-only tool, no wallet connection or RPC calls.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
