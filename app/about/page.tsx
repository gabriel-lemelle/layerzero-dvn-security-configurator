import Link from 'next/link';
import type { Metadata } from 'next';
import { GradeChip } from '@/components/GradeChip';

export const metadata: Metadata = {
  title: 'About · LayerZero DVN Security Configurator',
  description:
    'A short case study on turning LayerZero DVN config into something developers can review before they paste it.',
};

const DECISIONS: Array<[string, string, string]> = [
  ['D1', 'Stop leading with the incident', 'The KelpDAO story matters, but a warning banner made the whole tool feel like an alarm.'],
  ['D2', 'Grade structure, not intent', 'Effective DVNs and category diversity are inspectable. Operator quality is not scored in v0.'],
  ['D3', 'Block unsafe exports', 'If official metadata cannot prove the pathway, the app refuses to emit pasteable config.'],
  ['D4', 'Keep the grade next to the picker', 'The risk readout belongs beside the stack while the developer is still changing it.'],
  ['D5', 'Use color as data', 'Severity gets red/amber/emerald. DVN category gets a six-pixel dot. Everything else stays quiet.'],
];

const STACK = ['Next 16', 'React 19', 'Tailwind v4', 'Radix', 'shadcn', 'dnd-kit', 'node:test'];

const VARIANTS: Array<{
  tag: string;
  name: string;
  signature: 'meter' | 'list' | 'matrix' | 'matrix-plus';
  shipped?: boolean;
}> = [
  { tag: 'V1', name: 'Strength meter', signature: 'meter' },
  { tag: 'V2', name: 'Checklist', signature: 'list' },
  { tag: 'V3', name: 'Diversity matrix', signature: 'matrix' },
  { tag: 'V3+', name: 'Refined matrix', signature: 'matrix-plus', shipped: true },
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-7 pt-12 pb-16 text-zinc-300">
      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">
        Case study
      </div>
      <h1 className="mt-3 text-[34px] font-semibold leading-[1.1] -tracking-[0.01em] text-zinc-100">
        Designing
        <br />
        structural security
      </h1>
      <div className="mt-5 flex flex-wrap gap-2">
        <GradeChip grade="F" />
        <GradeChip grade="C" />
        <GradeChip grade="A" />
        <GradeChip grade="A+" />
      </div>
      <p className="mt-5 max-w-[520px] text-sm leading-relaxed text-zinc-400">
        LayerZero config starts as TypeScript. The risky part is not the syntax;
        it is whether the verifier set has a single failure mode hiding in plain
        sight.
      </p>

      <div className="mt-12 border-y border-zinc-800 py-6">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-[56px] font-medium leading-[0.9] -tracking-[0.02em] text-zinc-100 tabular-nums">
            $292M
          </span>
          <span className="text-xs leading-tight text-zinc-500">
            KelpDAO loss
            <br />
            Apr 18, 2026
          </span>
        </div>
        <p className="mt-3 max-w-[480px] text-[13px] leading-relaxed text-zinc-400">
          Public post-mortems describe a 1-of-1 DVN setup where RPC poisoning
          fed the lone verifier a forged message. The lesson is structural:
          count the verifiers, then check whether they fail in different ways.
        </p>
      </div>

      <Section label="Exploration · 4 variants">
        <div className="grid grid-cols-2 gap-2.5">
          {VARIANTS.map((variant) => (
            <div
              key={variant.tag}
              className={`relative rounded-lg p-3 ${
                variant.shipped
                  ? 'border border-emerald-500/40 bg-emerald-500/[0.05]'
                  : 'border border-zinc-800 bg-transparent'
              }`}
            >
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[10px] text-zinc-500">
                  {variant.tag}
                </span>
                <span className="text-[13px] font-medium text-zinc-100">
                  {variant.name}
                </span>
              </div>
              <div className="mt-2.5 flex h-8 items-center">
                <VariantSignature kind={variant.signature} />
              </div>
              {variant.shipped && (
                <span className="absolute right-2.5 top-2.5 font-mono text-[9px] tracking-wider text-emerald-400">
                  SHIPPED
                </span>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section label="Decisions · 5">
        <div className="overflow-hidden rounded-lg border border-zinc-800">
          <table className="w-full font-mono text-[11px]">
            <thead>
              <tr className="bg-zinc-900/50 text-zinc-500">
                <th className="px-3 py-2 text-left font-normal uppercase tracking-wider">#</th>
                <th className="px-3 py-2 text-left font-normal uppercase tracking-wider">Decision</th>
                <th className="px-3 py-2 text-left font-normal uppercase tracking-wider">Rationale</th>
              </tr>
            </thead>
            <tbody>
              {DECISIONS.map(([id, decision, rationale], index) => (
                <tr
                  key={id}
                  className={index < DECISIONS.length - 1 ? 'border-b border-zinc-800/60' : ''}
                >
                  <td className="px-3 py-2.5 align-top text-zinc-500">{id}</td>
                  <td className="px-3 py-2.5 align-top text-zinc-100">{decision}</td>
                  <td className="px-3 py-2.5 align-top text-zinc-400">{rationale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section label="Stack">
        <div className="flex flex-wrap gap-2">
          {STACK.map((item) => (
            <span
              key={item}
              className="rounded border border-zinc-800 px-2 py-1 font-mono text-[11px] text-zinc-400"
            >
              {item}
            </span>
          ))}
        </div>
      </Section>

      <div className="mt-14">
        <Link
          href="/"
          className="text-sm text-zinc-400 underline underline-offset-[5px] hover:text-zinc-100"
        >
          ← Back to the configurator
        </Link>
      </div>
    </main>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <div className="mb-3.5 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </div>
      {children}
    </section>
  );
}

/**
 * Tiny abstract signature for each variant card. Pure CSS — keeps the page
 * lightweight and avoids embedding screenshots.
 */
function VariantSignature({
  kind,
}: {
  kind: 'meter' | 'list' | 'matrix' | 'matrix-plus';
}) {
  if (kind === 'meter') {
    return (
      <div className="flex gap-[3px]">
        {[0, 1, 2, 3].map((index) => (
          <span
            key={index}
            className={`h-1 w-[22px] rounded-sm ${
              index < 3 ? 'bg-emerald-400/80' : 'bg-zinc-800'
            }`}
          />
        ))}
      </div>
    );
  }

  if (kind === 'list') {
    return (
      <div className="flex flex-col gap-[3px]">
        <span className="h-1 w-[88px] rounded-sm bg-zinc-700" />
        <span className="h-1 w-[60px] rounded-sm bg-zinc-700" />
      </div>
    );
  }

  if (kind === 'matrix') {
    return (
      <div className="flex gap-[3px]">
        {[true, true, false, true].map((on, index) => (
          <span
            key={index}
            className={`h-4 w-4 rounded-[3px] ${
              on ? 'bg-emerald-500/25' : 'border border-dashed border-zinc-800'
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-[3px]">
      {[true, true, true, false].map((on, index) => (
        <span
          key={index}
          className={`h-4 w-4 rounded-[3px] ${
            on
              ? 'border border-emerald-500/40 bg-emerald-500/15'
              : 'border border-dashed border-zinc-800'
          }`}
        />
      ))}
    </div>
  );
}
