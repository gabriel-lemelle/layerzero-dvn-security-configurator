'use client';

import { useEffect, useMemo, useState } from 'react';
import { KelpDaoBanner } from '@/components/KelpDaoBanner';
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

export default function Home() {
  const [sourceChain, setSourceChain] = useState<Chain>(CHAINS[0]);
  const [destChain, setDestChain] = useState<Chain>(CHAINS[1]);
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
    setOptionalThreshold((currentThreshold) => Math.min(currentThreshold, optionalDVNs.length));
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
    });
  }, [sourceChain, destChain, requiredDVNs, optionalDVNs, optionalThreshold]);

  const applyGradeAConfig = () => {
    const lzLabsDVN = DVNS.find((dvn) => dvn.id === 'layerzero-labs');
    const polyhedraDVN = DVNS.find((dvn) => dvn.id === 'polyhedra-zkbridge');
    
    if (lzLabsDVN && polyhedraDVN) {
      setRequiredDVNs([lzLabsDVN, polyhedraDVN]);
      setOptionalDVNs([]);
      setOptionalThreshold(0);
    }
  };

  return (
    <div className="min-h-screen">
      <KelpDaoBanner />
      
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <header className="space-y-4 pb-6 border-b border-zinc-800">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-zinc-100">
                LayerZero DVN Security Configurator
              </h1>
              <p className="text-zinc-400 max-w-2xl">
                Compose and review a Decentralized Verifier Network configuration for your LayerZero V2 OApp.
                This tool is read-only and runs entirely in your browser — no wallet connection, no RPC calls.
              </p>
            </div>
            <ShareLink />
          </div>
        </header>

        <Composer
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

        <SecurityGrade
          result={gradeResult}
          onApplyGradeAConfig={applyGradeAConfig}
        />

        <CodeExport code={generatedCode} />

        <footer className="pt-8 border-t border-zinc-800">
          <p className="text-xs text-zinc-600 text-center">
            This tool generates configuration fragments only. Always verify DVN addresses against{' '}
            <a
              href="https://metadata.layerzero-api.com/v1/metadata/dvns"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-400 underline underline-offset-2"
            >
              official LayerZero metadata
            </a>{' '}
            before mainnet deployment.
          </p>
        </footer>
      </main>
    </div>
  );
}
