import type { ReactNode } from "react";
import styles from "./demo.module.css";

/**
 * Three to six plain-language bullets. Any jargon gets glossed in the same
 * sentence it appears in — the reader built their first static page last week.
 */
export default function HowItWorks({ points }: { points: ReactNode[] }) {
  return (
    <div className={styles.panel}>
      <ul className={styles.bullets}>
        {points.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </div>
  );
}
