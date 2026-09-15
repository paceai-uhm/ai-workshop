import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import DemoShell from "@/components/demo/DemoShell";
import HowItWorks from "@/components/demo/HowItWorks";
import TryThisPrompt from "@/components/demo/TryThisPrompt";
import { getDemo } from "@/components/demo/demos";
import TideBoard, { TideSkeleton } from "./tide-board";
import { REVALIDATE_SECONDS } from "./tides";
import styles from "./tide-board.module.css";

const demo = getDemo("live-data");

export const metadata: Metadata = { title: `${demo.title} — demo` };

const PROMPT = `Build a page at /demos/live-data that shows live data from a public API, fetched on the server.

Use NOAA CO-OPS tide predictions for Honolulu Harbour, station 1612340. Pick it because it needs no API key and no account, so nothing stalls on credentials. Request today's high and low tides (product=predictions, interval=hilo, datum=MLLW, units=english, format=json).

Requirements:
- The fetch happens in an async Server Component, never in the browser. Say in the page why that matters: the browser never talks to NOAA at all, so there is no key to leak and no CORS problem to work around.
- Cache the response with a revalidate window of 600 seconds, so repeat visitors get the cached copy and NOAA gets one request per ten minutes instead of one per visitor.
- Show a real loading state using Suspense with a skeleton, not a spinner that never appears.
- Show a "last updated" line. Read the timestamp off the fetch response's Date header, NOT from new Date() at render time. This matters: the page re-renders per request while the data stays cached, so a render-time clock would tick forward and claim the data is fresher than it is.
- Format that timestamp in the station's own timezone (Pacific/Honolulu), not GMT. The header arrives as GMT, and printing it raw shows a reader in Hawaii a time up to ten hours ahead of their own clock -- after 2pm local, tomorrow's date -- on a page whose entire subject is Honolulu. Take the timezone as a parameter so the fix travels if the station does.
- Make the error state genuinely reachable: add a ?fail=1 switch that points the fetch at an invalid station id so NOAA returns an error. The page must show a visible link to turn the breakage on and off. A fallback you cannot demonstrate is not a fallback.

Handle these failure modes explicitly, and put the parsing in a separate pure function so each can be tested without a network:
- NOAA answers HTTP 200 with an {error: {message}} object in the body. Checking response.ok alone is not enough and would render an empty list that looks broken for no stated reason.
- A non-ok HTTP status.
- A body with no predictions array, or an empty one.
- A reading missing its time or with a height that is not a number.

When the fetch fails, the error UI replaces only the tide panel. The rest of the page keeps working, and the page should say that is deliberate.

Format tide times by splitting the "YYYY-MM-DD HH:MM" string by hand rather than passing it to new Date(). NOAA already returns local Hawaii time; constructing a Date would reinterpret it in the server's timezone and shift every reading.

Use plain CSS Modules matching the rest of the site. Do not add any dependency. It must work at 390px wide, and respect prefers-reduced-motion in the skeleton animation.`;

export default async function LiveDataPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const forceFailure = params.fail === "1";

  return (
    <DemoShell
      slug="live-data"
      howItWorks={
        <HowItWorks
          points={[
            <>
              The tide numbers come from NOAA, the US agency that measures
              them. We picked it because it needs no account and no{" "}
              <em>API key</em> (a password for a service), so there is nothing
              to sign up for.
            </>,
            <>
              The request happens on our <em>server</em> — the computer that
              builds the page — not in your browser. Your browser never talks
              to NOAA at all. That is how a key stays secret on pages that do
              need one.
            </>,
            <>
              The answer is kept for {REVALIDATE_SECONDS / 60} minutes. Everyone
              who visits in that window gets the stored copy, so NOAA gets one
              request every {REVALIDATE_SECONDS / 60} minutes instead of one per
              visitor. Tides do not move fast enough to need more.
            </>,
            <>
              &ldquo;Last updated&rdquo; is read from the response itself, not
              from the clock when the page was drawn, and it is shown in
              Honolulu time. Read straight from the header it would say
              &ldquo;GMT&rdquo; and, for most of the afternoon here, tomorrow&rsquo;s
              date — on a page about Honolulu.
            </>,
            <>
              Use the switch above to break the request on purpose. A fallback
              you have never seen is a guess — this one you can look at.
            </>,
            <>
              When it breaks, only this panel changes. The rest of the page
              carries on, because one service being down should not take
              everything with it.
            </>,
          ]}
        />
      }
      tryThis={<TryThisPrompt prompt={PROMPT} />}
    >
      <div className={styles.toggleRow}>
        <span className={styles.toggleLabel}>
          {forceFailure
            ? "The request is being broken on purpose."
            : "Fetching real tide data."}
        </span>
        <Link
          className={styles.toggleLink}
          href={forceFailure ? "/demos/live-data" : "/demos/live-data?fail=1"}
        >
          {forceFailure ? "Use the real station" : "Break it on purpose"}
        </Link>
      </div>

      {/* key: remount on toggle so the skeleton shows again instead of the
          previous panel lingering while the new fetch runs. */}
      <Suspense key={String(forceFailure)} fallback={<TideSkeleton />}>
        <TideBoard forceFailure={forceFailure} />
      </Suspense>
    </DemoShell>
  );
}
