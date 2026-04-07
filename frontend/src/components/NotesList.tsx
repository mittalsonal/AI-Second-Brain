"use client";

import { useEffect, useState } from "react";

type Note = { _id?: string; title: string; content: string };

type ViewMode = "grid" | "list";

const NOTE_COLORS = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444", "#EC4899"];

export default function NotesList({
  refresh,
  onAddNote,
}: {
  refresh: boolean;
  onAddNote?: () => void;
}) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [view, setView] = useState<ViewMode>("list");
  const [selected, setSelected] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [summarizing, setSummarizing] = useState(false);
  const [summary, setSummary] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/all-notes");
        const data = await res.json();
        setNotes(data);
      } catch {
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [refresh]);

  // ✅ UPDATED SUMMARIZE FUNCTION
  const handleSummarize = async (note: Note) => {
    setSummarizing(true);
    setSummary("Generating summary...");

    try {
      const res = await fetch("http://localhost:8000/summarize-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: note.title,
          content: note.content,
        }),
      });

      const data = await res.json();
      setSummary(data.summary || "Could not summarize.");
    } catch {
      setSummary("⚠️ Could not reach AI.");
    } finally {
      setSummarizing(false);
    }
  };

  const getColor = (i: number) => NOTE_COLORS[i % NOTE_COLORS.length];

  return (
    <div className="panel" style={{ flex: 1 }}>
      {/* Header */}
      <div className="panel-header">
        <div className="panel-title">
          <span
            className="panel-dot"
            style={{ background: "var(--primary)", boxShadow: "0 0 8px var(--primary)" }}
          />
          Recent Notes
          <span
            style={{
              fontSize: "11px",
              fontWeight: 500,
              color: "var(--muted)",
              marginLeft: "4px",
            }}
          >
            ({notes.length})
          </span>
        </div>

        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {/* View Toggle */}
          <div className="view-toggle">
            <button
              className={`view-toggle-btn${view === "list" ? " active" : ""}`}
              onClick={() => setView("list")}
              title="List view"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>

            <button
              className={`view-toggle-btn${view === "grid" ? " active" : ""}`}
              onClick={() => setView("grid")}
              title="Grid view"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>
          </div>

          {onAddNote && (
            <button className="btn-xs-primary" onClick={onAddNote}>
              + Add
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className={view === "grid" ? "notes-grid-body" : "notes-body"}>
        {loading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-note" />
            ))}
          </>
        ) : notes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <div className="empty-state-title">No notes yet</div>
            <div className="empty-state-sub">Start writing your first note!</div>
          </div>
        ) : (
          notes.map((note, i) => (
            <div
              key={i}
              className={view === "grid" ? "note-card-grid" : "note-item"}
              onClick={() => {
                setSelected(note);
                setSummary("");
              }}
            >
              {view === "list" && (
                <div className="note-color-bar" style={{ background: getColor(i) }} />
              )}

              {view === "grid" && (
                <div className="note-card-top-bar" style={{ background: getColor(i) }} />
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="note-title">{note.title}</div>
                <div className="note-preview">{note.content}</div>

                {view === "grid" && (
                  <div style={{ display: "flex", gap: "6px", marginTop: "10px", flexWrap: "wrap" }}>
                    <span className="note-chip">Note</span>
                  </div>
                )}
              </div>

              {view === "list" && (
                <button
                  className="note-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(note);
                    setSummary("");
                    handleSummarize(note);
                  }}
                  title="AI Summarize"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="modal-overlay"
          onClick={() => {
            setSelected(null);
            setSummary("");
          }}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ fontSize: "17px", fontWeight: 700, color: "var(--text)" }}>
                {selected.title}
              </div>
              <button
                className="modal-close"
                onClick={() => {
                  setSelected(null);
                  setSummary("");
                }}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text)",
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                }}
              >
                {selected.content}
              </p>

              {(summary || summarizing) && (
                <div className="modal-summary">
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "var(--primary)",
                      marginBottom: "6px",
                      textTransform: "uppercase",
                      letterSpacing: "0.8px",
                    }}
                  >
                    ✨ AI Summary
                  </div>

                  {summarizing ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--muted)" }}>
                      <span className="spinner" />
                      Generating summary...
                    </div>
                  ) : (
                    <p style={{ fontSize: "13px", color: "var(--text)", lineHeight: 1.6 }}>
                      {summary}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn-ghost"
                onClick={() => {
                  setSelected(null);
                  setSummary("");
                }}
              >
                Close
              </button>

              <button
                className="btn-modal-summarize"
                onClick={() => handleSummarize(selected)}
                disabled={summarizing}
              >
                {summarizing ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span className="spinner" /> Summarizing...
                  </span>
                ) : (
                  "✨ AI Summary"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}