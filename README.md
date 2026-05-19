# LayerZero V2 DVN Security Configurator

Compose a LayerZero V2 DVN Security Stack, get an instant security grade (F / C / A), and export a valid `layerzero.config.ts` — no wallet, no gas, no RPC calls.

**Anchored on the KelpDAO exploit (April 18, 2026 · ~$292M)** — caused by a 1-of-1 DVN configuration. This tool exists to prevent the next one.

**[Live →](#)** _(coming soon)_

---

## What it does

- **Security Stack Composer** — click or drag DVNs into required / optional slots with threshold control
- **Deterministic Security Grade** — F (single point of failure, KelpDAO pattern) / C (homogeneous model) / A (cross-model diversity)
- **Code Exporter** — one-click `layerzero.config.ts` fragment with DVN addresses sorted alphabetically (protocol requirement)
- **Shareable URLs** — share a config with a teammate or auditor as a read-only link

## What it does NOT do

- No wallet, no signing, no asset custody
- No contract deployment
- No gas / latency simulation (v2 scope)
- No recommended "best" config — surfaces tradeoffs only

## Stack

Next.js 16 · TypeScript · Tailwind CSS · shadcn/ui · dnd-kit

## Run locally

```bash
pnpm install
pnpm dev
```

## Contributing

See `AGENTS.md` for AI agent context. See `tasks.md` for current sprint.

## License

MIT
