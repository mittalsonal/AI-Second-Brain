"use client";

import { useState } from "react";

export default function AddNote({ refreshNotes }: any) {
  const [title, setTitle]     = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    try {
      await fetch("http://localhost:8000/add-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      refreshNotes();
      setTitle(""); setContent("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch {
      setTitle(""); setContent("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <span className="panel-dot" style={{ background: "var(--primary)", boxShadow: "0 0 8px var(--primary)" }} />
          Add New Note
        </div>
        {success && (
          <span style={{ fontSize: "11px", color: "var(--accent)", fontWeight: 600 }}>✓ Saved!</span>
        )}
      </div>

      <div className="form-body">
        <div>
          <label className="form-label">Title</label>
          <input
            className="form-input"
            type="text"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="form-label">Content</label>
          <textarea
            className="form-input"
            placeholder="Start writing your note..."
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button className="btn-ghost" onClick={() => { setTitle(""); setContent(""); }}>
            Clear
          </button>
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={saving || !title.trim() || !content.trim()}
          >
            {saving ? "Saving..." : "Save Note"}
          </button>
        </div>
      </div>
    </div>
  );
}