# LayerZero V2 DVN Configuration Simulator

**What this is:** A free, browser-based, read-only tool that lets developers visually compose a LayerZero V2 Security Stack, simulate latency and cost, and translate failed-transaction error codes into actionable fixes — without spending real gas.

**What this is NOT:**
- Not a deploy tool. No contract deployment from the UI.
- Not a wallet. No signing, no asset custody, no connect-wallet.
- Not opinionated. We never recommend a "best" Security Stack.
- Not a docs replacement. We link to docs.layerzero.network.

---

## Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **Drag & drop:** @dnd-kit/core + @dnd-kit/sortable
- **Charts:** recharts
- **Forms:** react-hook-form + zod
- **Package manager:** pnpm
- **Deployment target:** Vercel (free tier)

---

## Current Phase — v0 (internal demo sprint)

v0 is intentionally minimal. Static data only. Single chain pair (Ethereum → Arbitrum One).

**What is hardcoded in v0:**
- 8 DVNs: LZ Labs, Polyhedra, Stargate, Animoca, Nethermind, Google Cloud, BWare, Horizen
- Cost/latency tables: static, labeled "SIMULATED" on every figure
- Error library: 15 most common V2 errors from Discord
- Chain pair: Ethereum mainnet → Arbitrum One only

**What is deferred to v1:**
- LayerZero Scan API integration (live data)
- Full DVN registry (30+ DVNs)
- More chain pairs including cross-VM (EVM → Sui, EVM → Solana)
- Shareable config URLs
- Analytics (Plausible)

---

## Coding conventions

- All components in `/components`, page-level logic in `/app`
- Use shadcn/ui primitives — do not reinvent buttons, dialogs, or inputs
- TypeScript strict mode — no `any` types
- Every simulated data point must carry a visible "SIMULATED" label in the UI
- The tool never signs, never holds keys, never calls a wallet — enforce this hard
- Mobile-responsive but desktop-first (target: developer on a laptop)

---

## Key user flows (build these in order)

**Flow A — Security Stack composer**
Maya lands, sees 3 preset configs (first integration / production DeFi / cost-sensitive), picks one, sees cost + latency estimate for ETH → Arbitrum, copies the SDK config snippet.

**Flow B — Error translator**
Daniel pastes a failed-tx hash or error string, gets plain-English diagnosis and the SDK/CLI fix.

**Flow C — Audit export**
Priya opens a shared URL, sees the full Security Stack as a single artifact, exports as PDF.

---

## Tasks

See `tasks.md` for the current sprint task list.

## PRD

Full PRD is in GDrive: `02 - Work, Study/Veille Emploi/Claude Code/Global Context/Companies/LayerZero/DVN Config Simulator/PRD LayerZero V2 DVN Configuration Simulator.md`
