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
    change: "+ live",
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
    change: "+ live",
    color: "#22C55E",
    colorBg: "rgba(34,197,94,0.08)",
    colorBorder: "rgba(34,197,94,0.15)",
  },
];

export default function Home() {

  const [refresh, setRefresh] = useState(false);

  // ✅ STATS STATE
  const [stats, setStats] = useState({
    total_notes: 0,
    ai_queries: 0,
  });

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
  }, [refresh]); // 🔥 auto update on new note

  return (
    <>
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
          </div>

          <div className="content-scroll">

            {/* ✅ STATS (DYNAMIC NOW) */}
            <div className="stats-row">
              {statsConfig.map((s) => (
                <div
                  key={s.label}
                  className="stat-card"
                  style={{ "--card-color": s.color } as React.CSSProperties}
                >
                  {/* Icon */}
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

                  {/* 🔥 NUMBER FROM BACKEND */}
                  <div style={{
                    fontSize: "48px",
                    fontWeight: 700,
                    color: "var(--text)",
                  }}>
                    {stats[s.key]}
                  </div>

                  {/* Label */}
                  <div style={{ fontSize: "14px", fontWeight: 600 }}>
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
    </>
  );
}