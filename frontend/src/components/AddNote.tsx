"use client";

import { useState, useRef } from "react";

export default function AddNote({ refreshNotes }: { refreshNotes: () => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const MAX_CHARS = 2000;

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    try {
      await fetch("http://localhost:8000/add-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, tags }),
      });
      refreshNotes();
      setTitle("");
      setContent("");
      setTags([]);
      setTagInput("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch {
      setTitle("");
      setContent("");
    } finally {
      setSaving(false);
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const tag = tagInput.trim().replace(/^#/, "");
      if (tag && !tags.includes(tag)) setTags([...tags, tag]);
      setTagInput("");
    }
    if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (t: string) => setTags(tags.filter((x) => x !== t));

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_CHARS) {
      setContent(e.target.value);
      e.target.style.height = "auto";
      e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
    }
  };

  const insertFormat = (format: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = content.slice(start, end);
    let insert = "";
    if (format === "bold") insert = `**${selected || "bold text"}**`;
    else if (format === "italic") insert = `_${selected || "italic text"}_`;
    else if (format === "code") insert = `\`${selected || "code"}\``;
    else if (format === "list") insert = `\n- ${selected || "item"}`;
    const newVal = content.slice(0, start) + insert + content.slice(end);
    if (newVal.length <= MAX_CHARS) {
      setContent(newVal);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start + insert.length, start + insert.length);
      }, 0);
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
          <span style={{ fontSize: "11px", color: "var(--accent)", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
            ✓ Saved!
          </span>
        )}
      </div>

      <div className="form-body">
        {/* Title */}
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

        {/* Toolbar */}
        <div className="editor-toolbar">
          <button className="toolbar-btn" onClick={() => insertFormat("bold")} title="Bold"><b>B</b></button>
          <button className="toolbar-btn" onClick={() => insertFormat("italic")} title="Italic"><i>I</i></button>
          <button className="toolbar-btn" onClick={() => insertFormat("code")} title="Code">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
            </svg>
          </button>
          <button className="toolbar-btn" onClick={() => insertFormat("list")} title="List">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" />
              <circle cx="4" cy="6" r="1.5" fill="currentColor" /><circle cx="4" cy="12" r="1.5" fill="currentColor" /><circle cx="4" cy="18" r="1.5" fill="currentColor" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Content</label>
            <span style={{ fontSize: "10px", color: content.length > MAX_CHARS * 0.9 ? "#EF4444" : "var(--muted)" }}>
              {content.length}/{MAX_CHARS}
            </span>
          </div>
          <textarea
            ref={textareaRef}
            className="form-input"
            placeholder="Start writing your note..."
            rows={4}
            value={content}
            onChange={handleContentChange}
            style={{ resize: "none", minHeight: "96px" }}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="form-label">Tags</label>
          <div className="tags-input-wrap">
            {tags.map((t) => (
              <span key={t} className="tag-pill">
                #{t}
                <button onClick={() => removeTag(t)} className="tag-remove">✕</button>
              </span>
            ))}
            <input
              className="tags-input"
              placeholder={tags.length === 0 ? "#react #ai #notes" : "Add tag..."}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button
            className="btn-ghost"
            onClick={() => { setTitle(""); setContent(""); setTags([]); setTagInput(""); }}
          >
            Clear
          </button>
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={saving || !title.trim() || !content.trim()}
          >
            {saving ? "Saving..." : "Save Note →"}
          </button>
        </div>
      </div>
    </div>
  );
}