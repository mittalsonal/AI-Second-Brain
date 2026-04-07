"use client";

import { useEffect, useState } from "react";

const suggestions = [
  { icon: "🔁", text: "Revise your React hooks notes", tag: "Study" },
  { icon: "📝", text: "Summarize your AI research notes", tag: "Review" },
  { icon: "💡", text: "Connect: Vector Embeddings + AI Chat notes", tag: "Insight" },
  { icon: "⚡", text: "Practice MongoDB aggregation pipelines", tag: "Practice" },
];

const topics = [
  { label: "React", count: 8, color: "#3B82F6" },
  { label: "AI / ML", count: 6, color: "#8B5CF6" },
  { label: "MongoDB", count: 4, color: "#10B981" },
  { label: "Algorithms", count: 3, color: "#F59E0B" },
  { label: "System Design", count: 2, color: "#EF4444" },
];

const maxCount = Math.max(...topics.map((t) => t.count));

// Fake weekly activity
const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const activity = [3, 5, 2, 7, 4, 1, 3];
const maxAct = Math.max(...activity);

export default function Insights() {
  const [totalNotes, setTotalNotes] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8000/stats")
      .then((r) => r.json())
      .then((d) => setTotalNotes(d.total_notes ?? 0))
      .catch(() => {});
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Smart Suggestions */}
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <span className="panel-dot" style={{ background: "#F59E0B", boxShadow: "0 0 8px #F59E0B" }} />
            💡 Smart Suggestions
          </div>
        </div>
        <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {suggestions.map((s, i) => (
            <div key={i} className="suggestion-item">
              <span style={{ fontSize: "18px" }}>{s.icon}</span>
              <span style={{ flex: 1, fontSize: "13px", color: "var(--text)" }}>{s.text}</span>
              <span className="suggestion-tag">{s.tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Graph */}
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <span className="panel-dot" style={{ background: "#3B82F6", boxShadow: "0 0 8px #3B82F6" }} />
            📈 Weekly Activity
          </div>
          <span style={{ fontSize: "11px", color: "var(--muted)" }}>{totalNotes} total notes</span>
        </div>
        <div style={{ padding: "16px 18px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "80px" }}>
            {activity.map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", height: "100%" }}>
                <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
                  <div
                    className="activity-bar"
                    style={{
                      width: "100%",
                      height: `${(v / maxAct) * 100}%`,
                      background: `linear-gradient(180deg, #3B82F6, #60A5FA)`,
                      borderRadius: "4px 4px 0 0",
                      minHeight: "4px",
                    }}
                    title={`${v} notes`}
                  />
                </div>
                <span style={{ fontSize: "10px", color: "var(--muted)", fontWeight: 600 }}>{week[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Topics */}
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <span className="panel-dot" style={{ background: "#8B5CF6", boxShadow: "0 0 8px #8B5CF6" }} />
            🏷️ Top Topics
          </div>
        </div>
        <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {topics.map((t, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text)" }}>{t.label}</span>
                <span style={{ fontSize: "11px", color: "var(--muted)", fontWeight: 600 }}>{t.count} notes</span>
              </div>
              <div style={{ height: "5px", background: "var(--border)", borderRadius: "5px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${(t.count / maxCount) * 100}%`,
                    background: t.color,
                    borderRadius: "5px",
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}