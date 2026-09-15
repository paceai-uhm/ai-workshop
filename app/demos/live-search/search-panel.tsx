"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DIETS, FISH, ZONES } from "./fish";
import {
  SORT_OPTIONS,
  applyFilters,
  serializeFilters,
  toggleFacet,
  type Filters,
  type SortKey,
} from "./filters";
import styles from "./search-panel.module.css";

const DEBOUNCE_MS = 300;

export default function SearchPanel({ initial }: { initial: Filters }) {
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>(initial);

  // The list re-filters on every keystroke, but the address bar only catches
  // up once typing pauses. Writing to the URL on every character would mean a
  // router call per keystroke for a result nobody asked to share.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      const query = serializeFilters(filters);
      // replace, not push: typing should not bury the back button in history.
      router.replace(query ? `?${query}` : "/demos/live-search", {
        scroll: false,
      });
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [filters, router]);

  const results = useMemo(() => applyFilters(FISH, filters), [filters]);
  const isFiltered =
    filters.query.trim() !== "" ||
    filters.zones.length > 0 ||
    filters.diets.length > 0;

  return (
    <div className={styles.panel}>
      <div className={styles.controls}>
        <input
          className={styles.search}
          type="search"
          placeholder="Search by name, English or Hawaiian…"
          aria-label="Search fish by name"
          value={filters.query}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, query: event.target.value }))
          }
        />
        <label className={styles.sortLabel}>
          <span>Sort</span>
          <select
            className={styles.select}
            value={filters.sort}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                sort: event.target.value as SortKey,
              }))
            }
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <FacetGroup
        legend="Where it lives"
        options={ZONES}
        selected={filters.zones}
        onToggle={(value) =>
          setFilters((prev) => ({ ...prev, zones: toggleFacet(prev.zones, value) }))
        }
      />
      <FacetGroup
        legend="What it eats"
        options={DIETS}
        selected={filters.diets}
        onToggle={(value) =>
          setFilters((prev) => ({ ...prev, diets: toggleFacet(prev.diets, value) }))
        }
      />

      <div className={styles.countRow}>
        <p className={styles.count} aria-live="polite">
          {results.length} of {FISH.length} fish
        </p>
        {isFiltered ? (
          <button
            type="button"
            className={styles.clear}
            onClick={() =>
              setFilters((prev) => ({ ...prev, query: "", zones: [], diets: [] }))
            }
          >
            Clear filters
          </button>
        ) : null}
      </div>

      {results.length === 0 ? (
        <p className={styles.empty}>
          Nothing matches that. Try clearing a filter.
        </p>
      ) : (
        <ul className={styles.list}>
          {results.map((fish) => (
            <li className={styles.row} key={fish.id}>
              <div className={styles.names}>
                <span className={styles.name}>{fish.name}</span>
                {fish.hawaiian !== "—" ? (
                  <span className={styles.hawaiian}>{fish.hawaiian}</span>
                ) : null}
              </div>
              <div className={styles.meta}>
                <span className={styles.chip}>{fish.zone}</span>
                <span className={styles.chip}>{fish.diet}</span>
                <span className={styles.length}>{fish.lengthCm} cm</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FacetGroup({
  legend,
  options,
  selected,
  onToggle,
}: {
  legend: string;
  options: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <fieldset className={styles.facets}>
      <legend className={styles.legend}>{legend}</legend>
      {options.map((option) => (
        <label className={styles.facet} key={option}>
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => onToggle(option)}
          />
          <span>{option}</span>
        </label>
      ))}
    </fieldset>
  );
}
