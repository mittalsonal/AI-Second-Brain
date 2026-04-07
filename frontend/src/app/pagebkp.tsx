"use client";

import AddNote from "@/components/AddNote";
import NotesList from "@/components/NotesList";
import AskAI from "@/components/AskAI";
import SearchNotes from "@/components/SearchNotes";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";

// ✅ CONFIG (static UI data only)
const statsConfig = [
  {
    key: "total_notes",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
    ),
    label: "Total Notes",
    color: "#3B82F6",
    colorBg: "rgba(59,130,246,0.08)",
    colorBorder: "rgba(59,130,246,0.15)",
  },
  {
    key: "ai_queries",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    label: "AI Queries",
    color: "#22C55E",
    colorBg: "rgba(34,197,94,0.08)",
    colorBorder: "rgba(34,197,94,0.15)",
  },
];

export default function Home() {
  const [refresh, setRefresh] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // ✅ STATS STATE
  const [stats, setStats] = useState({
    total_notes: 0,
    ai_queries: 0,
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const refreshNotes = () => {
    setRefresh(!refresh);
  };

  // ✅ FETCH STATS FROM BACKEND
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:8000/stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.log("Stats error", err);
      }
    };
    fetchStats();
  }, [refresh]);

  return (
    // ✅ KEY FIX: data-theme lives on the outermost div so all CSS selectors work
    <div data-theme={theme} style={{ minHeight: "100vh" }}>
      <div className="scanline" />
      <div className="grid-bg" />

      <div className="app-shell">
        <Sidebar />

        <div className="main-area">

          {/* Topbar */}
          <div className="topbar">
            <div>
              <div style={{ fontSize: "18px", fontWeight: 700 }}>Dashboard</div>
              <div style={{ fontSize: "12px", color: "var(--muted)" }}>
                Your knowledge, supercharged by AI
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="topbar-actions">
              <button
                className="theme-toggle"
                onClick={toggleTheme}
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  /* Sun — click to go light */
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/>
                    <line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                ) : (
                  /* Moon — click to go dark */
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="content-scroll">

            {/* ✅ STATS (DYNAMIC) */}
            <div className="stats-row">
              {statsConfig.map((s) => (
                <div
                  key={s.label}
                  className="stat-card"
                  style={{ "--card-color": s.color } as React.CSSProperties}
                >
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "12px",
                      background: s.colorBg,
                      border: `1px solid ${s.colorBorder}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: s.color,
                    }}>
                      {s.icon}
                    </div>
                  </div>

                  <div className="stat-num">
                    {stats[s.key as keyof typeof stats]}
                  </div>

                  <div className="stat-label" style={{ marginTop: "6px" }}>
                    {s.label}
                  </div>

                </div>
              ))}
            </div>

            {/* Notes + AI */}
            <div className="mid-grid">
              <NotesList refresh={refresh} />
              <AskAI />
            </div>

            {/* Add Note + Search */}
            <div className="bottom-grid">
              <AddNote refreshNotes={refreshNotes} />
              <SearchNotes />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}