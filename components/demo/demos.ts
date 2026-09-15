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

export const DEMOS: Demo[] = [
  {
    slug: "live-search",
    title: "Instant filter & sort",
    blurb:
      "Type to narrow a list of 40 reef fish, sort it, and filter by habitat — the web address updates so you can share exactly what you are looking at.",
    tier: 1,
    capabilities: ["client state", "URL as state", "debouncing"],
  },
  {
    slug: "live-data",
    title: "Live data with caching",
    blurb:
      "Today's high and low tides for Honolulu Harbour, fetched from NOAA on the server, cached for ten minutes, with a switch that breaks the request on purpose.",
    tier: 1,
    capabilities: ["server components", "fetch caching", "failure handling"],
  },
];

export function getDemo(slug: string): Demo {
  const demo = DEMOS.find((d) => d.slug === slug);
  if (!demo) throw new Error(`Unknown demo slug: ${slug}`);
  return demo;
}
