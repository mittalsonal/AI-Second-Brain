"use client";

import { useState } from "react";
import Image from "next/image";

const navItems = [
  {
    label: "Dashboard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "All Notes",
    badge: "24",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    label: "Search",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    label: "Ask AI",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];



export default function Sidebar() {
  const [active, setActive] = useState("Dashboard");

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-inner">
          {/* <div className="sidebar-logo-icon"></div> */}
          <div className="sidebar-logo-icon">
            <Image
              src="/logo.png"
              alt="Logo"
              width={28}
              height={28}
              style={{ borderRadius: "8px" }}
            />
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>
              AI SECOND BRAIN
            </div>
            {/* <div style={{ fontSize: "9px", color: "var(--muted)", letterSpacing: "1px", marginTop: "2px" }}>
              AI SECOND BRAIN
            </div> */}
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="sidebar-nav">
        <span className="sidebar-section-label">Workspace</span>
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`nav-btn${active === item.label ? " active" : ""}`}
            onClick={() => setActive(item.label)}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </button>
        ))}
      </div>

      

      {/* User */}
      <div className="sidebar-user">
        <div className="sidebar-user-inner">
          <div className="user-avatar">SK</div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>Sonal Mittal</div>
            {/* <div style={{ fontSize: "11px", color: "var(--muted)" }}>Pro Plan</div> */}
          </div>
          <span
            className="pulse-dot"
            style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: "var(--accent)", boxShadow: "0 0 8px var(--accent)",
              marginLeft: "auto", display: "inline-block", flexShrink: 0,
            }}
          />
        </div>
      </div>
    </aside>
  );
}