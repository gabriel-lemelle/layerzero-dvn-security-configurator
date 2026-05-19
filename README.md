# LayerZero V2 DVN Configuration Simulator

A free, browser-based tool for LayerZero V2 developers to visually compose a Security Stack, simulate cost and latency, and translate failed-transaction errors into actionable fixes — without spending real gas.

**[Live demo →](#)** _(coming soon)_

---

## What it does

- **Security Stack composer** — drag-and-drop DVN selection with verification threshold validation
- **Cost & latency simulation** — estimated fees and confirmation times per chain pair (labeled SIMULATED)
- **Error translator** — paste a failed-tx error string, get a plain-English fix + docs link
- **Shareable URLs** — send your config to a teammate or auditor as a read-only link _(v1)_

## What it does NOT do

- No wallet connection, no signing, no asset custody
- No contract deployment
- No "recommended" Security Stack — surfaces tradeoffs only

## Stack

Next.js 16 · TypeScript · Tailwind CSS · shadcn/ui · dnd-kit · recharts

## Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Contributing

See `tasks.md` for the current sprint. See `AGENTS.md` for AI coding context.

## License

MIT
