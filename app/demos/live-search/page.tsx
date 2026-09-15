import type { Metadata } from "next";
import DemoShell from "@/components/demo/DemoShell";
import HowItWorks from "@/components/demo/HowItWorks";
import TryThisPrompt from "@/components/demo/TryThisPrompt";
import { getDemo } from "@/components/demo/demos";
import { parseFilters } from "./filters";
import SearchPanel from "./search-panel";

const demo = getDemo("live-search");

export const metadata: Metadata = { title: `${demo.title} — demo` };

const PROMPT = `Build a page at /demos/live-search that filters and sorts a list, entirely in the browser with no database.

Data: create a versioned seed file in the repo with 40 reef fish. Each one has an id, an English name, a Hawaiian name, a habitat zone (Tide pool, Reef flat, or Deep reef), a diet (Herbivore, Carnivore, or Omnivore), and a typical adult length in cm. Do not fetch this from anywhere; it is seed data committed as code.

The page needs:
- A search box that filters as the visitor types, matching the English or Hawaiian name, case-insensitively.
- A sort control: name A-Z, shortest first, longest first.
- Two multi-select checkbox groups, one for zone and one for diet. Checking nothing in a group means "no restriction on this". Within a group the checked values are OR'd together; the two groups are AND'ed with each other.
- A visible count of how many results are showing out of the total, and a Clear filters button that only appears when something is filtered.
- An empty state when nothing matches.

Two things matter about the state:
1. Every filter lives in the URL query string (q, sort, zone, diet), so the visitor can copy the address, send it to somebody, and they see the same filtered view. Reloading the page keeps the filters.
2. The URL update is debounced by about 300ms and uses replace, not push. The list itself must re-filter instantly on every keystroke -- only the address bar lags. Explain in a comment why: a router call per character is wasted work, and pushing would put one history entry per letter behind the back button.

Read the filters out of the query string on the server and pass them into the client component as its initial state, so the server-rendered HTML already shows the right filtered list and nothing changes on hydration.

Put the filtering and sorting in a separate module as pure functions that take the list and the filters and return a new list. Do not put that logic inside the component -- I want to be able to test it without a browser. Omit default values from the query string so an untouched page has a clean URL.

Use plain CSS Modules matching the rest of the site. Do not add any dependency. It must work at 390px wide.`;

export default async function LiveSearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Reading the filters on the server means a shared link renders already
  // filtered, instead of flashing the full list and then narrowing.
  const initial = parseFilters(await searchParams);

  return (
    <DemoShell
      slug="live-search"
      howItWorks={
        <HowItWorks
          points={[
            <>
              The whole list of 40 fish is already in the page. Nothing is
              fetched when you type, which is why filtering feels instant —
              there is no server to wait for.
            </>,
            <>
              Every filter you set is written into the web address as a{" "}
              <em>query string</em> (the part after the <code>?</code>). Copy
              the address while filtered, send it to someone, and they open
              exactly the view you were looking at.
            </>,
            <>
              The address only updates about a third of a second after you stop
              typing. That pause is called <em>debouncing</em>: without it the
              browser would rewrite the address once per letter, for a result
              you were not ready to share yet.
            </>,
            <>
              The list itself does <strong>not</strong> wait for that pause. It
              re-filters on every keystroke, so the two run at different speeds
              on purpose.
            </>,
            <>
              The server reads the address before sending the page, so a shared
              link arrives already filtered rather than showing all 40 and then
              snapping down to the ones that matched.
            </>,
            <>
              Leaving a checkbox group empty means &ldquo;no restriction&rdquo;,
              not &ldquo;match nothing&rdquo; — a small decision that is easy to
              get backwards and very obvious when it is wrong.
            </>,
          ]}
        />
      }
      tryThis={<TryThisPrompt prompt={PROMPT} />}
    >
      <SearchPanel initial={initial} />
    </DemoShell>
  );
}
