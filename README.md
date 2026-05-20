# LayerZero V2 DVN Security Configurator

A browser-based configurator for one specific moment in a LayerZero OApp workflow: before a DVN stack gets pasted into config.

It lets developers compose required and optional DVNs, see the structural risk of the stack, and export a full `layerzero.config.ts` only when the selected pathway is present in official LayerZero metadata.

The project is intentionally read-only: no wallet connection, no signing, no contract deployment, no backend, and no runtime RPC calls.

## Why This Exists

LayerZero V2 gives OApp teams real flexibility in how they configure Decentralized Verifier Networks. That flexibility is useful, but it also means a weak verifier set can look like ordinary TypeScript during review.

The KelpDAO incident made the failure mode concrete: a 1-of-1 DVN setup left one verifier as the critical dependency. This tool does not claim to prevent every bridge failure. It does one narrower thing: make verifier count and verifier-category diversity visible before config is wired.

The design notes behind the current UI are captured in `/about`.

## Current Features

- **DVN stack composer** - assign DVNs to required or optional verifier sets.
- **Threshold modeling** - adjust optional DVN threshold and see the effective verifier count.
- **Security grade** - deterministic F / C / A / A+ signal based on verifier count and verification-model diversity.
- **Educational example** - prefill a diverse testnet stack for learning and review, not as deployment advice.
- **Wire-ready / Explore modes** - separate copy-paste config generation from educational inspection of unsupported metadata gaps.
- **Config export** - generate a full `layerzero.config.ts` using LayerZero's official `generateConnectionsConfig(...)` shape when metadata support is verified.
- **Shareable links** - encode the composer state in the URL for teammate or auditor review.
- **Safety constraints** - runs entirely in the browser without wallet, RPC, signing, custody, or deployment behavior.

## Security Model

The grade is deliberately simple and explainable:

- **F** - one or fewer effective DVNs, creating a single verifier failure mode.
- **C** - two or more effective DVNs, but all use the same verification category.
- **A** - two or more effective DVNs across at least two verification categories.
- **A+** - diversity bonus for three or more effective DVNs across at least three verification categories.

This is not a formal audit, recommendation engine, or production guarantee. The A+ tier is a diversity bonus, not a deployment recommendation or claim that a stack is production-safe.

For optional DVNs, grading is conservative: an X-of-Y optional set is scored against the weakest threshold-satisfying subset so drag order cannot improve the grade.

## Product Decisions

- **Stop leading with the incident** - KelpDAO context is available, but the main surface is the stack and grade. The tool should not feel like an alarm page.
- **Grade structure, not intent** - the model scores effective DVN count and verification-category diversity. It does not score operator quality, latency, cost, or production readiness.
- **Block unsafe exports** - copy-paste output is disabled unless every selected DVN is mapped to an active official provider on both selected chains.
- **Keep the grade beside the picker** - the grade is feedback for the stack while the developer is still changing it, so it lives in the sticky side rail.
- **Use color as data** - red / amber / emerald are reserved for grade severity. DVN categories use only small blue / purple / cyan / magenta dots.

## Data Status

Wire-ready export is gated by a local snapshot of official LayerZero metadata checked on May 20, 2026. At the time of verification, Arbitrum Sepolia, Optimism Sepolia, and Base Sepolia had active DVN metadata; Ethereum Sepolia did not list active DVNs in the metadata endpoint, so it is excluded from the default composer choices and blocked if loaded from an older shared URL.

Always inspect the resolved config before wiring and rerun LayerZero's config checks after deployment.

## Scope

v0 focuses on EVM testnets with active LayerZero DVN metadata:

- Arbitrum Sepolia
- Optimism Sepolia
- Base Sepolia

Mainnet coverage, non-EVM chains, gas modeling, latency modeling, and live deployment validation are intentionally out of scope for v0.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Radix
- shadcn/ui
- dnd-kit
- node:test

## Run Locally

```bash
pnpm install
pnpm dev
```

## Build Checks

```bash
pnpm test
pnpm run typecheck
pnpm build
```

## License

MIT
