import { DIETS, ZONES, type Fish } from "./fish";

export type SortKey = "name" | "shortest" | "longest";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "name", label: "Name (A–Z)" },
  { value: "shortest", label: "Shortest first" },
  { value: "longest", label: "Longest first" },
];

export type Filters = {
  query: string;
  sort: SortKey;
  zones: string[];
  diets: string[];
};

export const EMPTY_FILTERS: Filters = {
  query: "",
  sort: "name",
  zones: [],
  diets: [],
};

const isSortKey = (value: string): value is SortKey =>
  SORT_OPTIONS.some((option) => option.value === value);

/** Read filters out of a URL query string, ignoring anything unrecognised. */
export function parseFilters(
  params: Record<string, string | string[] | undefined>,
): Filters {
  const one = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : (value ?? "");
  };
  const many = (key: string, allowed: readonly string[]) =>
    one(key)
      .split(",")
      .map((entry) => entry.trim())
      .filter((entry) => allowed.includes(entry));

  const sort = one("sort");

  return {
    query: one("q"),
    sort: isSortKey(sort) ? sort : "name",
    zones: many("zone", ZONES),
    diets: many("diet", DIETS),
  };
}

/**
 * Turn filters back into a query string. Defaults are omitted so an untouched
 * page keeps a clean URL rather than carrying `?q=&sort=name`.
 */
export function serializeFilters(filters: Filters): string {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set("q", filters.query.trim());
  if (filters.sort !== "name") params.set("sort", filters.sort);
  if (filters.zones.length) params.set("zone", filters.zones.join(","));
  if (filters.diets.length) params.set("diet", filters.diets.join(","));
  return params.toString();
}

/** Filter then sort. Pure, so it can be tested without a browser. */
export function applyFilters(fish: Fish[], filters: Filters): Fish[] {
  const needle = filters.query.trim().toLowerCase();

  const matched = fish.filter((item) => {
    if (needle && !`${item.name} ${item.hawaiian}`.toLowerCase().includes(needle)) {
      return false;
    }
    // An empty facet means "no restriction", not "match nothing".
    if (filters.zones.length && !filters.zones.includes(item.zone)) return false;
    if (filters.diets.length && !filters.diets.includes(item.diet)) return false;
    return true;
  });

  const sorted = [...matched];
  if (filters.sort === "shortest") {
    sorted.sort((a, b) => a.lengthCm - b.lengthCm || a.name.localeCompare(b.name));
  } else if (filters.sort === "longest") {
    sorted.sort((a, b) => b.lengthCm - a.lengthCm || a.name.localeCompare(b.name));
  } else {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
  return sorted;
}

/** Add or remove one value from a facet list. */
export function toggleFacet(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((entry) => entry !== value)
    : [...values, value];
}
