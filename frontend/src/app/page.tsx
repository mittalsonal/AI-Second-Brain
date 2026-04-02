"use client";

import AddNote from "@/components/AddNote";
import NotesList from "@/components/NotesList";
import AskAI from "@/components/AskAI";
import SearchNotes from "@/components/SearchNotes";
import Sidebar from "@/components/Sidebar";

const stats = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    num: "24",
    label: "Total Notes",
    change: "+3 this week",
    color: "#3B82F6",
    colorBg: "rgba(59,130,246,0.08)",
    breakdown: [
      { label: "Tech", val: 9, color: "#3B82F6" },
      { label: "Research", val: 7, color: "#818CF8" },
      { label: "Other", val: 8, color: "#334155" },
    ],
    sparkData: [8, 12, 9, 15, 11, 18, 14, 20, 16, 24],
    goal: 75,
    goalLabel: "Weekly goal",
    footer: "updated 2m ago",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4l3 3"/>
      </svg>
    ),
    num: "47",
    label: "AI Queries",
    change: "+12 today",
    color: "#22C55E",
    colorBg: "rgba(34,197,94,0.08)",
    breakdown: [
      { label: "Summarise", val: 18, color: "#22C55E" },
      { label: "Ask & search", val: 21, color: "#34D399" },
      { label: "Generate", val: 8, color: "#334155" },
    ],
    sparkData: [12, 19, 14, 28, 22, 35, 19, 41, 30, 47],
    goal: 47,
    goalLabel: "Daily limit",
    footer: "last query 5m ago",
  },
];

export default function Home() {
  return (
    <>
      <div className="scanline" />
      <div className="grid-bg" />

      <div className="app-shell">
        <Sidebar />

        <div className="main-area">
          {/* ── Topbar ── */}
          <div className="topbar">
            <div>
              <div style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.4px", color: "var(--text)" }}>
                Dashboard
              </div>
              <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>
                Your knowledge, supercharged by AI
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div className="topbar-status">
                <span
                  className="pulse-dot"
                  style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", display: "inline-block" }}
                />
                LLaMA 3 Online
              </div>
              <button className="btn-new-note">+ New Note</button>
            </div>
          </div>

          {/* ── Scrollable content ── */}
          <div className="content-scroll">

            {/* Stats */}
            <div className="stats-row">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="stat-card"
                  style={{ "--card-color": s.color } as React.CSSProperties}
                >
                  {/* Top row */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "18px" }}>
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "11px",
                      background: s.colorBg, border: `1px solid ${s.color}22`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: s.color,
                    }}>
                      {s.icon}
                    </div>
                    <span style={{
                      fontSize: "11px", fontWeight: 600, padding: "3px 10px",
                      borderRadius: "20px", background: s.colorBg,
                      color: s.color, border: `1px solid ${s.color}33`,
                    }}>
                      ↑ {s.change}
                    </span>
                  </div>

                  {/* Number + label */}
                  <div style={{ fontSize: "36px", fontWeight: 700, letterSpacing: "-2px", lineHeight: 1, color: "var(--text)" }}>
                    {s.num}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "5px", marginBottom: "18px", fontWeight: 500 }}>
                    {s.label}
                  </div>

                  {/* Sparkline */}
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "36px", marginBottom: "16px" }}>
                    {s.sparkData.map((v, i) => {
                      const max = Math.max(...s.sparkData);
                      const pct = Math.round((v / max) * 100);
                      const isLast = i === s.sparkData.length - 1;
                      return (
                        <div key={i} style={{
                          flex: 1, borderRadius: "2px 2px 0 0",
                          height: `${pct}%`, minHeight: "3px",
                          background: isLast ? s.color : `${s.color}28`,
                          transition: "height 0.3s ease",
                        }} />
                      );
                    })}
                  </div>

                  {/* Divider */}
                  <div style={{ borderTop: "1px solid var(--border)", marginBottom: "14px" }} />

                  {/* Breakdown */}
                  {s.breakdown.map((b) => (
                    <div key={b.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "7px" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "var(--muted)" }}>
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: b.color, display: "inline-block" }} />
                        {b.label}
                      </span>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#CBD5E1" }}>{b.val}</span>
                    </div>
                  ))}

                  {/* Progress */}
                  <div style={{ marginTop: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                      <span style={{ fontSize: "11px", color: "var(--muted)" }}>{s.goalLabel}</span>
                      <span style={{ fontSize: "11px", fontWeight: 600, color: s.color }}>{s.goal}%</span>
                    </div>
                    <div style={{ height: "3px", background: "var(--border)", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${s.goal}%`, background: s.color, borderRadius: "4px" }} />
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    marginTop: "14px", paddingTop: "12px", borderTop: "1px solid var(--border)",
                  }}>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "#22C55E" }}>↑ trending up</span>
                    <span style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "'JetBrains Mono', monospace" }}>
                      {s.footer}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Notes + AI */}
            <div className="mid-grid">
              <NotesList />
              <AskAI />
            </div>

            {/* Add Note + Search */}
            <div className="bottom-grid">
              <AddNote />
              <SearchNotes />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}