import { APP_TIME_ZONE } from "@/lib/dates";

/**
 * NOAA CO-OPS tide predictions for Honolulu Harbour (station 1612340).
 *
 * Chosen because it needs no API key, no account and no billing setup: the
 * workshop should not stall on credentials to show a server-side fetch.
 */
export const HONOLULU_STATION = "1612340";
const BROKEN_STATION = "0000000"; // Not a real station; NOAA replies with an error.

/** How long a fetched response stays fresh, in seconds. */
export const REVALIDATE_SECONDS = 600;

export type Tide = {
  /** Local time of the extreme, e.g. "2026-09-14 03:12". */
  time: string;
  /** Height in feet above the MLLW datum. */
  feet: number;
  kind: "High" | "Low";
};

export type TideResult = {
  tides: Tide[];
  /** When the data was actually fetched — not when this page rendered. */
  fetchedAt: string | null;
};

export function buildUrl(forceFailure: boolean): string {
  const params = new URLSearchParams({
    date: "today",
    station: forceFailure ? BROKEN_STATION : HONOLULU_STATION,
    product: "predictions",
    datum: "MLLW",
    time_zone: "lst_ldt",
    interval: "hilo",
    units: "english",
    format: "json",
  });
  return `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?${params}`;
}

/**
 * Turn a NOAA payload into tides, or throw with a readable reason.
 *
 * NOAA answers a bad request with HTTP 200 and an `error` object in the body,
 * so checking `response.ok` alone is not enough — a page that only checked the
 * status code would render an empty list and look broken for no stated reason.
 */
export function parseTides(payload: unknown): Tide[] {
  if (typeof payload !== "object" || payload === null) {
    throw new Error("The tide service sent something that was not a response.");
  }
  const body = payload as { error?: { message?: string }; predictions?: unknown };

  if (body.error) {
    throw new Error(body.error.message?.trim() || "The tide service reported an error.");
  }
  if (!Array.isArray(body.predictions)) {
    throw new Error("The tide service response had no predictions in it.");
  }

  const tides = body.predictions.map((entry) => {
    const row = entry as { t?: unknown; v?: unknown; type?: unknown };
    const feet = Number(row.v);
    if (typeof row.t !== "string" || !Number.isFinite(feet)) {
      throw new Error("A tide reading was missing its time or height.");
    }
    return {
      time: row.t,
      feet,
      kind: row.type === "H" ? "High" : "Low",
    } satisfies Tide;
  });

  if (tides.length === 0) {
    throw new Error("The tide service returned no readings for today.");
  }
  return tides;
}

/** "2026-09-14 03:12" -> "3:12 AM". Split by hand so no timezone is applied. */
export function formatTideTime(value: string): string {
  const match = /^\d{4}-\d{2}-\d{2} (\d{2}):(\d{2})$/.exec(value);
  if (!match) return value;
  const hour = Number(match[1]);
  const suffix = hour < 12 ? "AM" : "PM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${match[2]} ${suffix}`;
}

export async function fetchTides(forceFailure: boolean): Promise<TideResult> {
  const response = await fetch(buildUrl(forceFailure), {
    // Stale-while-revalidate: serve the cached copy for ten minutes, then the
    // next request triggers a refresh in the background.
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(
      `The tide service answered ${response.status} ${response.statusText}.`,
    );
  }

  // Read the timestamp off the response, not the clock. When this comes from
  // the cache the header comes with it, so "last updated" stays honest instead
  // of ticking forward on every page load while the data sits still.
  const fetchedAt = response.headers.get("date");

  return { tides: parseTides(await response.json()), fetchedAt };
}

/**
 * Render the fetch timestamp in the station's own timezone.
 *
 * The header arrives as GMT. Shown as-is, a reader in Honolulu sees a time up
 * to ten hours ahead of their own clock — and after 2pm local, tomorrow's
 * date — on a page whose whole subject is Honolulu. Formatting in the app's
 * timezone is the same fix the task list makes for due dates.
 */
export function formatFetchedAt(
  header: string | null,
  timeZone: string = APP_TIME_ZONE,
): string | null {
  if (!header) return null;
  const at = new Date(header);
  if (Number.isNaN(at.getTime())) return null;

  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(at);
}
