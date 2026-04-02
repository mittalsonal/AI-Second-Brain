"use client";

import { useState } from "react";

type Result = { title: string; snippet: string };

const placeholder: Result[] = [
  { title: "React useEffect Deep Dive",   snippet: "Cleanup functions are critical to avoid memory leaks..." },
  { title: "Vector Embeddings Explained", snippet: "Semantic search using cosine similarity..."             },
  { title: "AI Product Ideas 2025",       snippet: "Build personal knowledge graphs using LLMs..."          },
];

export default function SearchNotes() {
  const [query, setQuery]       = useState("");
  const [results, setResults]   = useState<Result[]>(placeholder);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (!value.trim()) { setResults(placeholder); return; }

    setSearching(true);
    try {
      const res  = await fetch(`http://localhost:8000/search?query=${encodeURIComponent(value)}`);
      const data = await res.json();
      setResults(
        data.notes?.map((n: { title: string; content: string }) => ({
          title:   n.title,
          snippet: n.content.slice(0, 65) + "...",
        })) ?? []
      );
    } catch {
      /* keep placeholder */
    } finally {
      setSearching(false);
    }
  };

  const highlight = (text: string, q: string) => {
    if (!q.trim()) return <>{text}</>;
    const re    = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(re);
    return <>{parts.map((p, i) => re.test(p) ? <mark key={i}>{p}</mark> : <span key={i}>{p}</span>)}</>;
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <span className="panel-dot" style={{ background: "var(--accent)", boxShadow: "0 0 8px var(--accent)" }} />
          Search Notes
        </div>
        {searching && (
          <span style={{ fontSize: "11px", color: "var(--muted)" }}>Searching...</span>
        )}
      </div>

      <div className="search-body">
        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input
            className="search-input"
            type="text"
            placeholder="Search your knowledge..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="search-results">
          {results.length === 0 ? (
            <div style={{ fontSize: "11px", color: "var(--muted)", textAlign: "center", padding: "12px 0" }}>
              No results for &ldquo;{query}&rdquo;
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