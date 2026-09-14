import Link from "next/link";
import {
  REVALIDATE_SECONDS,
  fetchTides,
  formatTideTime,
} from "./tides";
import styles from "./tide-board.module.css";

export function TideSkeleton() {
  return (
    <div className={styles.board} aria-busy="true">
      <p className={styles.status}>Checking the tide service…</p>
      <ul className={styles.list}>
        {[0, 1, 2, 3].map((i) => (
          <li className={styles.skeletonRow} key={i} />
        ))}
      </ul>
    </div>
  );
}

/** Async Server Component: the fetch happens here, on the server, never in the browser. */
export default async function TideBoard({ forceFailure }: { forceFailure: boolean }) {
  let result;
  try {
    result = await fetchTides(forceFailure);
  } catch (error) {
    const reason =
      error instanceof Error ? error.message : "Something went wrong.";
    return (
      <div className={`${styles.board} ${styles.errorBoard}`} role="alert">
        <p className={styles.errorTitle}>Could not load today&rsquo;s tides</p>
        <p className={styles.errorReason}>{reason}</p>
        <p className={styles.errorHelp}>
          The rest of the page still works. That is the point of handling this:
          one service being down should not take the whole page with it.
        </p>
        <Link
          className={styles.retry}
          href={forceFailure ? "/demos/live-data" : "/demos/live-data?fail=1"}
        >
          {forceFailure ? "Turn the breakage off" : "Try again"}
        </Link>
      </div>
    );
  }

  const { tides, fetchedAt } = result;

  return (
    <div className={styles.board}>
      <ul className={styles.list}>
        {tides.map((tide) => (
          <li className={styles.row} key={`${tide.time}-${tide.kind}`}>
            <span
              className={tide.kind === "High" ? styles.high : styles.low}
            >
              {tide.kind}
            </span>
            <span className={styles.time}>{formatTideTime(tide.time)}</span>
            <span className={styles.feet}>{tide.feet.toFixed(2)} ft</span>
          </li>
        ))}
      </ul>
      <p className={styles.status}>
        Honolulu Harbour · last updated{" "}
        {fetchedAt ? new Date(fetchedAt).toUTCString() : "just now"} · refreshes
        at most every {REVALIDATE_SECONDS / 60} minutes
      </p>
    </div>
  );
}
