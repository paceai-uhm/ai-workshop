/**
 * The demo registry. The index page and every demo shell read from here, so a
 * demo's title, blurb, tier and capability list are written once.
 */
export type Tier = 1 | 2 | 3;

export type Demo = {
  slug: string;
  title: string;
  /** One sentence, plain language, no jargon. */
  blurb: string;
  tier: Tier;
  /** The capabilities this page introduces, shown on its index card. */
  capabilities: string[];
};

export const TIER_LABELS: Record<Tier, string> = {
  1: "Tier 1 · no database",
  2: "Tier 2 · database",
  3: "Tier 3 · realtime, aggregation, AI",
};

export const DEMOS: Demo[] = [];

export function getDemo(slug: string): Demo {
  const demo = DEMOS.find((d) => d.slug === slug);
  if (!demo) throw new Error(`Unknown demo slug: ${slug}`);
  return demo;
}
