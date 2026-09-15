import Link from "next/link";
import type { Metadata } from "next";
import { DEMOS, TIER_LABELS, type Tier } from "@/components/demo/demos";
import styles from "@/components/demo/demo.module.css";

export const metadata: Metadata = {
  title: "Demos — what a website can do",
};

const TIERS: Tier[] = [1, 2, 3];

export default function DemosIndexPage() {
  return (
    <div className={styles.page}>
      <header className={styles.indexHeader}>
        <h1 className={styles.title}>What a website can do</h1>
        <p className={styles.blurb}>
          Each page below is a working example of one capability, plus an
          explanation of how it was built and the exact prompt that would build
          it again. They get harder as you go down.
        </p>
      </header>

      {TIERS.map((tier) => {
        const demos = DEMOS.filter((demo) => demo.tier === tier);
        if (demos.length === 0) return null;

        return (
          <section key={tier}>
            <h2 className={styles.tierHeading}>{TIER_LABELS[tier]}</h2>
            <div className={styles.grid}>
              {demos.map((demo) => (
                <Link
                  className={styles.card}
                  href={`/demos/${demo.slug}`}
                  key={demo.slug}
                >
                  <h3 className={styles.cardTitle}>{demo.title}</h3>
                  <p className={styles.cardBlurb}>{demo.blurb}</p>
                  <div className={styles.tags}>
                    {demo.capabilities.map((capability) => (
                      <span className={styles.capTag} key={capability}>
                        {capability}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
