# Tasks — LayerZero DVN Config Simulator

_Update this file as tasks are completed or new ones are added._

---

## Current sprint — v0 internal demo

### In progress
- [ ] Review and clean up v0.app scaffold (rename project, wire up layout)

### To do

**Core UI**
- [ ] Landing page with 3 preset Security Stack configs (first integration / production DeFi / cost-sensitive)
- [ ] DVN selector panel — drag-and-drop from registry of 8 hardcoded DVNs
- [ ] Verification threshold input (number, must be ≤ required DVN count — validate this)
- [ ] Executor display (hardcoded default executor in v0)
- [ ] Chain pair selector (locked to ETH mainnet → Arbitrum One in v0)

**Simulation panel**
- [ ] Cost estimate display — static table, labeled "SIMULATED — as of [date]" on every figure
- [ ] Latency estimate display — static table, same disclaimer
- [ ] SDK config snippet output — copyable code block showing the resulting `SetConfigParam` call

**Error translator**
- [ ] Text input: paste error string or tx hash
- [ ] Map 15 common V2 errors to plain-English diagnoses (see error list below)
- [ ] Link each error to the relevant docs.layerzero.network page

**Polish**
- [ ] "SIMULATED" badge on all data figures — must be visible, no exceptions
- [ ] Disclaimer footer: tool never signs, never holds keys, never deploys
- [ ] Responsive layout (desktop-first, usable on tablet)

### Done
- [x] v0.app scaffold — Next.js 16 + shadcn/ui + dnd-kit + recharts

---

## V0 error library (15 errors to implement)

| Error string | Plain-English diagnosis |
|---|---|
| `LZ_ULN_AtLeastOneDVN` | No DVNs selected. Add at least one required DVN. |
| `LZ_ULN_Verifying` | Message is waiting for DVN verification. Check that all required DVNs are active on this chain pair. |
| `UnusedValueWithoutDrop` | Sui/Move only — you passed extra value to `_lzReceive` that wasn't consumed. Remove the unused value parameter. |
| `LZ_ULN_InvalidWorker` | The executor address is invalid or not registered on this chain. Use the default LayerZero executor. |
| `LZ_InvalidNonce` | Message delivered out of order. Check if a prior message is stuck. |
| `LZ_PayloadHashNotFound` | Payload hash mismatch — the message payload doesn't match what was committed. Resend with correct payload. |
| `LZ_ULN_InsufficientFees` | Not enough native gas sent with the message. Increase `msg.value` to cover DVN + executor fees. |
| `LZ_ULN_ThresholdNotMet` | Verification threshold unreachable — threshold set higher than number of required DVNs. Lower threshold or add more DVNs. |
| `LZ_NotTrustedRemote` | Destination OApp doesn't trust the source — `setPeer()` not called on destination. |
| `LZ_MessageLib_InvalidPath` | Source and destination chain IDs don't match the registered path. Verify endpoint IDs. |
| `ExecutionFailed` | Executor ran `_lzReceive` but it reverted. Check destination contract logic. |
| `LZ_Executor_InvalidExpiry` | Executor's delivery window expired. Message needs to be re-sent or retried. |
| `LZ_ULN_DVNNotRegistered` | A selected DVN is not registered on this chain. Remove it from your Security Stack for this chain pair. |
| `LZ_SendLib_InvalidGasLimit` | Gas limit too low for destination execution. Increase `_options` gas limit. |
| `LZ_ULN_InvalidPacketHeader` | Malformed packet header — likely a mismatch in message library versions between source and destination. |

---

## Backlog — v1 (6 weeks)

- [ ] LayerZero Scan API integration — replace static data with live cost/latency
- [ ] Full DVN registry (30+ DVNs, auto-synced from on-chain)
- [ ] Top 10 chain pairs + 2 cross-VM (EVM → Sui, EVM → Solana)
- [ ] Error library expanded to 50+ patterns
- [ ] Shareable config URLs (`/config?...`)
- [ ] Plausible analytics

## Backlog — v2 (6 months)

- [ ] Optional sign-in for saved configs
- [ ] Comparative mode: two Security Stacks side-by-side
- [ ] Threat-model presets (Censorship-resistant / Speed-optimized / Cost-optimized)
- [ ] `npx layerzero-debug config` CLI that mirrors the web UI
- [ ] Public OApp config explorer: paste any deployed OApp address → see its Security Stack
