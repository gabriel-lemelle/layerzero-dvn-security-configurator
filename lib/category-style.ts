import type { DVN } from './dvns';

/**
 * Category color tokens. Cool family — deliberately disjoint from the
 * grade severity palette (red / amber / emerald) so the two color systems
 * never cross signals.
 *
 * Use these *only* as a small inline dot (≤ 6px), never as a chip
 * background fill. The grade card matrix is the only place where category
 * + grade colors coexist, and the matrix cells inherit grade severity
 * (background tint + border), while the dot inside the cell label carries
 * the category identity.
 */
export const CATEGORY_COLOR: Record<DVN['category'], string> = {
  native: 'oklch(0.68 0.19 250)', // blue
  'zk-light-client': 'oklch(0.70 0.18 292)', // purple
  attestation: 'oklch(0.76 0.16 185)', // cyan
  'multisig-consortium': 'oklch(0.70 0.21 325)', // magenta
};
