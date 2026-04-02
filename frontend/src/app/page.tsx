"use client";

import AddNote from "@/components/AddNote";
import NotesList from "@/components/NotesList";
import AskAI from "@/components/AskAI";
import SearchNotes from "@/components/SearchNotes";
import Sidebar from "@/components/Sidebar";

const stats = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    num: "24",
    label: "Total Notes",
    // sublabel: "across all categories",
    change: "+3 this week",
    color: "#3B82F6",
    colorBg: "rgba(59,130,246,0.08)",
    colorBorder: "rgba(59,130,246,0.15)",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    num: "47",
    label: "AI Queries",
    // sublabel: "last query 5m ago",
    change: "+12 today",
    color: "#22C55E",
    colorBg: "rgba(34,197,94,0.08)",
    colorBorder: "rgba(34,197,94,0.15)",
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
                  {/* Top: icon + badge */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
                    <div style={{
                      width: "42px", height: "42px", borderRadius: "12px",
                      background: s.colorBg,
                      border: `1px solid ${s.colorBorder}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: s.color,
                    }}>
                      {s.icon}
                    </div>
                    <span style={{
                      fontSize: "11px", fontWeight: 600,
                      padding: "4px 11px", borderRadius: "20px",
                      background: s.colorBg, color: s.color,
                      border: `1px solid ${s.colorBorder}`,
                      letterSpacing: "0.1px",
                    }}>
                      ↑ {s.change}
                    </span>
                  </div>

                  {/* Number */}
                  <div style={{
                    fontSize: "48px", fontWeight: 700,
                    letterSpacing: "-3px", lineHeight: 1,
                    color: "var(--text)", marginBottom: "8px",
                  }}>
                    {s.num}
                  </div>

                  {/* Label */}
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", marginBottom: "4px" }}>
                    {s.label}
                  </div>

                  {/* Sublabel */}
                  {/* <div style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 400 }}>
                    {s.sublabel}
                  </div> */}

                  {/* Bottom accent line */}
                  <div style={{
                    marginTop: "24px",
                    height: "2px",
                    borderRadius: "2px",
                    background: `linear-gradient(90deg, ${s.color} 0%, transparent 100%)`,
                    opacity: 0.5,
                  }} />
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