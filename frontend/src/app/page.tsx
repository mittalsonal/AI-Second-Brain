"use client";

import AddNote from "@/components/AddNote";
import NotesList from "@/components/NotesList";
import AskAI from "@/components/AskAI";
import SearchNotes from "@/components/SearchNotes";
import Sidebar from "@/components/Sidebar";
import UploadDocs from "@/components/UploadDocs";
// import Insights from "@/components/Insights";
import { useState, useEffect } from "react";


export default function Home() {
  const [refresh, setRefresh] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [stats, setStats] = useState({ total_notes: 0, ai_queries: 0 });
  const [globalSearch, setGlobalSearch] = useState("");

  const toggleTheme = () => setTheme((p) => (p === "dark" ? "light" : "dark"));
  const refreshNotes = () => setRefresh((p) => !p);

  useEffect(() => {
    fetch("http://localhost:8000/stats")
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => {});
  }, [refresh]);

  const getStatValue = (s: typeof statsConfig[0]) => {
    if (s.static !== undefined) return s.static;
    return stats[s.key as keyof typeof stats] ?? 0;
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <>
            

            {/* Main grid */}
            <div className="mid-grid">
              <NotesList refresh={refresh} onAddNote={() => setActiveTab("Notes")} />
              <AskAI />
            </div>

            {/* Bottom grid */}
            <div className="bottom-grid">
              <AddNote refreshNotes={refreshNotes} />
              <SearchNotes />
            </div>
          </>
        );

      case "Notes":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <AddNote refreshNotes={refreshNotes} />
            <NotesList refresh={refresh} />
          </div>
        );

      case "AI Chat":
        return <AskAI />;

      case "Search":
        return <SearchNotes />;

      case "Upload":
        return (
          <div className="mid-grid" style={{ alignItems: "flex-start" }}>
            <UploadDocs />
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="panel" style={{ padding: "20px" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)", marginBottom: "10px" }}>
                  📄 Supported Formats
                </div>
                {["PDF — Research papers, books", "DOCX — Word documents", "TXT — Plain text files"].map((f, i) => (
                  <div key={i} style={{ fontSize: "13px", color: "var(--muted)", padding: "6px 0", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
                    {f}
                  </div>
                ))}
              </div>
              <div className="panel" style={{ padding: "20px" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)", marginBottom: "10px" }}>
                  ✨ How it works
                </div>
                {["Upload your document", "AI extracts key concepts", "Notes are auto-created", "Search & ask AI about them"].map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "6px 0" }}>
                    <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "var(--primary)", color: "#fff", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {i + 1}
                    </span>
                    <span style={{ fontSize: "13px", color: "var(--muted)" }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      // case "Insights":
        // return <Insights />;

      default:
        return null;
    }
  };

  const tabTitle: Record<string, string> = {
    Dashboard: "Dashboard",
    Notes: "My Notes",
    "AI Chat": "AI Chat",
    Search: "Search Knowledge",
    Upload: "Upload Documents",
    // Insights: "Insights",
  };

  const tabSub: Record<string, string> = {
    Dashboard: "Your knowledge, supercharged by AI",
    Notes: "All your notes in one place",
    "AI Chat": "Ask anything about your notes",
    Search: "Find anything instantly",
    Upload: "Convert documents to notes",
    // Insights: "Analytics & smart suggestions",
  };

  return (
    <div data-theme={theme} style={{ minHeight: "100vh" }}>
      <div className="scanline" />
      <div className="grid-bg" />

      <div className="app-shell">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="main-area">
          {/* Topbar */}
          <div className="topbar">
            <div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--text)" }}>
                {tabTitle[activeTab]}
              </div>
              <div style={{ fontSize: "12px", color: "var(--muted)" }}>
                {tabSub[activeTab]}
              </div>
            </div>

            <div className="topbar-actions">
              {/* Global search */}
              <div className="topbar-search-wrap">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)", pointerEvents: "none" }}>
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  className="topbar-search"
                  type="text"
                  placeholder="Search anything..."
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  onFocus={() => setActiveTab("Search")}
                />
              </div>

              <button className="btn-new-note" onClick={() => setActiveTab("Notes")}>
                + New Note
              </button>

              <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
                {theme === "dark" ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="content-scroll">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}