import { useState } from "react";
import { ChevronDown, Search, Sparkles, SlidersHorizontal, X } from "lucide-react";
import { useSearch } from "@popup/hooks/useSearch";
import { BrandHeader } from "./BrandHeader";
import { PageHeader } from "./PageHeader";
import { FileRow } from "./FileRow";

const CHIP_LABELS = {
  kind: (v) => `Type: ${v === "file" ? "Files" : "Folders"}`,
  parentPath: (v) => `Located in: ${v}`,
};

export function SearchView() {
  const [term, setTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const { results, search, searching, hasSearched } = useSearch();

  const runSearch = (nextTerm, nextFilters) => {
    if (nextTerm.trim()) search(nextTerm, nextFilters);
  };

  const removeFilter = (key) => {
    const next = { ...filters };
    delete next[key];
    setFilters(next);
    runSearch(term, next);
  };

  const activeChips = Object.entries(filters).filter(([, v]) => v);

  return (
    <div className="flex flex-col">
      <BrandHeader />
      <PageHeader title="Search" />
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-pill px-4 py-2.5">
            <Search size={16} className="text-ink-soft shrink-0" />
            <input
              value={term}
              onChange={(e) => {
                setTerm(e.target.value);
                runSearch(e.target.value, filters);
              }}
              placeholder="Search files and folders…"
              className="flex-1 outline-none text-sm min-w-0"
            />
            {term && (
              <button onClick={() => setTerm("")} className="text-ink-soft shrink-0" aria-label="Clear">
                <X size={15} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="relative flex items-center gap-1.5 bg-brand-light text-ink text-sm font-medium rounded-pill px-3.5 py-2.5 shrink-0"
          >
            <SlidersHorizontal size={15} />
            Filters
            {activeChips.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-brand text-white text-[10px] w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full grid place-items-center">
                {activeChips.length}
              </span>
            )}
          </button>
        </div>

        {activeChips.length > 0 && (
          <div className="flex items-center gap-2 bg-brand-light/60 rounded-card px-3 py-2 flex-wrap">
            {activeChips.map(([key, value]) => (
              <span key={key} className="flex items-center gap-1 bg-white text-xs rounded-full px-2.5 py-1 border border-gray-200">
                {CHIP_LABELS[key]?.(value) ?? `${key}: ${value}`}
                <button onClick={() => removeFilter(key)}>
                  <X size={12} />
                </button>
              </span>
            ))}
            <button
              onClick={() => {
                setFilters({});
                runSearch(term, {});
              }}
              className="text-brand text-xs font-medium ml-auto"
            >
              Clear all
            </button>
          </div>
        )}

        {showFilters && (
          <div className="flex gap-2 flex-wrap">
            <select
              value={filters.kind ?? ""}
              onChange={(e) => {
                const next = { ...filters, kind: e.target.value || undefined };
                setFilters(next);
                runSearch(term, next);
              }}
              className="text-xs bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5"
            >
              <option value="">All types</option>
              <option value="file">Files</option>
              <option value="folder">Folders</option>
            </select>
            <input
              placeholder="Located in path…"
              value={filters.parentPath ?? ""}
              onChange={(e) => {
                const next = { ...filters, parentPath: e.target.value || undefined };
                setFilters(next);
                runSearch(term, next);
              }}
              className="text-xs bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 flex-1 min-w-[8rem]"
            />
          </div>
        )}

        {hasSearched && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-light grid place-items-center shrink-0">
                <Search size={15} className="text-brand" />
              </div>
              <div>
                <p className="font-bold text-[15px] leading-tight">
                  {searching ? "Searching…" : `${results.length} results found`}
                </p>
                <p className="text-xs text-ink-muted leading-tight">
                  Across {new Set(results.map((r) => r.parentId)).size} folders
                </p>
              </div>
            </div>
            <button className="flex items-center gap-1 text-xs border border-gray-200 rounded-full px-3 py-1.5">
              Sort by: Relevance
              <ChevronDown size={13} />
            </button>
          </div>
        )}

        <div>
          {results.map((node) => (
            <FileRow key={node.id} node={node} />
          ))}
          {hasSearched && !searching && results.length === 0 && (
            <p className="text-sm text-ink-muted py-6 text-center">No matches. Try a different term.</p>
          )}
        </div>

        {hasSearched && results.length > 0 && (
          <div className="flex items-center gap-3 bg-brand-light rounded-card p-3">
            <div className="w-8 h-8 rounded-full bg-white grid place-items-center shrink-0">
              <Sparkles size={15} className="text-brand" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[13px]">Tip: Use filters to narrow down results</p>
              <p className="text-xs text-ink-muted">Filter by file type, date modified, folder and more.</p>
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className="text-brand text-xs font-semibold shrink-0 bg-white rounded-full px-3 py-1.5 border border-brand/30"
            >
              Show Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
