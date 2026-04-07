"use client";

import { useState } from "react";

type Result = { title: string; snippet: string };

const placeholder: Result[] = [
  { title: "React useEffect Deep Dive", snippet: "Cleanup functions are critical to avoid memory leaks..." },
  { title: "Vector Embeddings Explained", snippet: "Semantic search using cosine similarity..." },
  { title: "AI Product Ideas 2025", snippet: "Build personal knowledge graphs using LLMs..." },
];

const RECENT = ["react hooks", "vector embeddings", "AI notes"];

type SearchMode = "keyword" | "semantic";

export default function SearchNotes() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>(placeholder);
  const [searching, setSearching] = useState(false);
  const [mode, setMode] = useState<SearchMode>("keyword");
  const [recentSearches, setRecentSearches] = useState<string[]>(RECENT);
  const [showRecent, setShowRecent] = useState(false);

  const doSearch = async (value: string) => {
    setQuery(value);
    if (!value.trim()) { setResults(placeholder); return; }

    setSearching(true);
    setShowRecent(false);
    try {
      const res = await fetch(`http://localhost:8000/search?query=${encodeURIComponent(value)}`);
      const data = await res.json();
      setResults(
        data.notes?.map((n: { title: string; content: string }) => ({
          title: n.title,
          snippet: n.content.slice(0, 80) + "...",
        })) ?? []
      );
    } catch {
      /* keep current */
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !recentSearches.includes(query.trim())) {
      setRecentSearches((r) => [query.trim(), ...r].slice(0, 5));
    }
    doSearch(query);
  };

  const highlight = (text: string, q: string) => {
    if (!q.trim()) return <>{text}</>;
    const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(re);
    return <>{parts.map((p, i) => re.test(p) ? <mark key={i}>{p}</mark> : <span key={i}>{p}</span>)}</>;
  };

  return (
    <div className="panel" style={{ flex: 1 }}>
      <div className="panel-header">
        <div className="panel-title">
          <span className="panel-dot" style={{ background: "var(--accent)", boxShadow: "0 0 8px var(--accent)" }} />
          Search Notes
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            className={`search-mode-btn${mode === "keyword" ? " active" : ""}`}
            onClick={() => setMode("keyword")}
          >
            Keyword
          </button>
          <button
            className={`search-mode-btn${mode === "semantic" ? " active" : ""}`}
            onClick={() => setMode("semantic")}
          >
            🔥 Semantic
          </button>
        </div>
      </div>

      <div className="search-body">
        {/* Search bar */}
        <form onSubmit={handleSubmit}>
          <div className="search-wrap" style={{ position: "relative" }}>
            <span className="search-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </span>
            <input
              className="search-input"
              type="text"
              placeholder={mode === "semantic" ? "Ask a question to search semantically..." : "Search your knowledge..."}
              value={query}
              onChange={(e) => doSearch(e.target.value)}
              onFocus={() => setShowRecent(true)}
              onBlur={() => setTimeout(() => setShowRecent(false), 150)}
            />
            {query && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => { setQuery(""); setResults(placeholder); }}
              >
                ✕
              </button>
            )}
            {searching && (
              <div className="search-spinner" />
            )}
          </div>
        </form>

        {/* Recent searches */}
        {showRecent && !query && recentSearches.length > 0 && (
          <div className="recent-searches">
            <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "6px" }}>
              Recent
            </div>
            {recentSearches.map((r, i) => (
              <button
                key={i}
                className="recent-search-item"
                onMouseDown={() => doSearch(r)}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.5 }}>
                  <polyline points="12 8 12 12 14 14" /><circle cx="12" cy="12" r="10" />
                </svg>
                {r}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        <div className="search-results">
          {results.length === 0 ? (
            <div className="empty-state" style={{ padding: "24px 0" }}>
              <div className="empty-state-icon">🔍</div>
              <div className="empty-state-title">No results</div>
              <div className="empty-state-sub">Try a different search term</div>
            </div>
          ) : (
            results.map((r, i) => (
              <div key={i} className="search-result-item">
                <div className="search-result-title">{highlight(r.title, query)}</div>
                <div className="search-result-snippet">{r.snippet}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}