import Link from "next/link";
import type { ReactNode } from "react";
import { TIER_LABELS, getDemo } from "./demos";
import styles from "./demo.module.css";

/**
 * Every demo page is the same three parts in the same order: the working
 * thing, how it works, and the prompt that would build it. The shell owns
 * that order so no page can quietly invent its own.
 */
export default function DemoShell({
  slug,
  children,
  howItWorks,
  tryThis,
}: {
  slug: string;
  /** Part 1: the real, working feature. */
  children: ReactNode;
  /** Part 2: a <HowItWorks /> panel. */
  howItWorks: ReactNode;
  /** Part 3: a <TryThisPrompt /> block. */
  tryThis: ReactNode;
}) {
  const demo = getDemo(slug);

  return (
    <div className={styles.page}>
      <Link className={styles.backLink} href="/demos">
        ← All demos
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>{demo.title}</h1>
        <p className={styles.blurb}>{demo.blurb}</p>
        <div className={styles.tags}>
          <span className={styles.tierTag}>{TIER_LABELS[demo.tier]}</span>
          {demo.capabilities.map((capability) => (
            <span className={styles.capTag} key={capability}>
              {capability}
            </span>
          ))}
        </div>
      </header>

      <section className={styles.part}>
        <p className={styles.partLabel}>The working thing</p>
        {children}
      </section>

      <section className={styles.part}>
        <p className={styles.partLabel}>How this works</p>
        {howItWorks}
      </section>

      <section className={styles.part}>
        <p className={styles.partLabel}>Build it yourself</p>
        {tryThis}
      </section>
    </div>
  );
}
