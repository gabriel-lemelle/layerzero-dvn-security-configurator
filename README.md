# LayerZero V2 DVN Security Configurator

A browser-based configurator for composing LayerZero V2 DVN security stacks, understanding verifier diversity, and exporting a `layerzero.config.ts` fragment for review.

The project is intentionally read-only: no wallet connection, no signing, no contract deployment, no backend, and no runtime RPC calls.

## Why This Exists

LayerZero V2 gives OApp teams flexibility in how they configure Decentralized Verifier Networks. That flexibility is powerful, but it also makes weak verifier configurations easy to miss during setup and review.

This tool focuses on one narrow workflow: make the DVN stack visible, explain the security tradeoffs, and produce a configuration snippet that can be reviewed before deployment.

## Current Features

- **DVN stack composer** — assign DVNs to required or optional verifier sets.
- **Threshold modeling** — adjust optional DVN threshold and see the effective verifier count.
- **Security grade** — deterministic F / C / A signal based on verifier count and verification-model diversity.
- **Config export** — generate a `layerzero.config.ts` fragment with lowercase DVN addresses sorted alphabetically.
- **Safety constraints** — runs entirely in the browser without wallet, RPC, signing, custody, or deployment behavior.

## Security Model

The grade is deliberately simple and explainable:

- **F** — one or fewer effective DVNs, creating a single verifier failure mode.
- **C** — two or more effective DVNs, but all use the same verification category.
- **A** — two or more effective DVNs across at least two verification categories.

This is not a formal audit, recommendation engine, or production guarantee. It is a review aid for understanding DVN configuration risk.

## Data Status

DVN metadata and addresses must be verified against official LayerZero metadata before production use. Until that verification is complete, treat exported configs as examples for review, not deployment-ready output.

## Scope

v0 focuses on EVM testnets only:

- Ethereum Sepolia
- Arbitrum Sepolia
- Optimism Sepolia
- Base Sepolia

Mainnet coverage, non-EVM chains, gas modeling, latency modeling, and live deployment validation are intentionally out of scope for v0.

## Tech Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- dnd-kit

## Run Locally

```bash
pnpm install
pnpm dev
```

## Build Checks

```bash
pnpm lint
pnpm build
```

## License

MIT
