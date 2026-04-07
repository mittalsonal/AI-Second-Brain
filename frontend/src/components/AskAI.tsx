"use client";

import { useState, useRef, useEffect } from "react";

type Message = { role: "ai" | "user"; text: string; sources?: string[] };

const initial: Message[] = [
  {
    role: "ai",
    text: "Hi! I'm your AI Second Brain 🧠 Ask me anything about your notes — I'll search through your knowledge base to find answers.",
  },
];

export default function AskAI() {
  const [messages, setMessages] = useState<Message[]>(initial);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [useNotes, setUseNotes] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleAsk = async () => {
    if (!question.trim() || loading) return;
    const q = question.trim();
    setMessages((p) => [...p, { role: "user", text: q }]);
    setQuestion("");
    setLoading(true);

    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const res = await fetch("http://localhost:8000/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      setMessages((p) => [
        ...p,
        { role: "ai", text: data.answer, sources: data.sources ?? [] },
      ]);
    } catch {
      setMessages((p) => [
        ...p,
        { role: "ai", text: "⚠️ Could not reach the AI server. Make sure the backend is running." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const clearChat = () => setMessages(initial);

  return (
    <div className="ai-full-panel">
      {/* Header */}
      <div className="panel-header">
        <div className="panel-title">
          <span className="panel-dot" style={{ background: "var(--accent)", boxShadow: "0 0 8px var(--accent)" }} />
          AI Chat
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label className="toggle-label" title="Use my notes as context">
            <input
              type="checkbox"
              checked={useNotes}
              onChange={(e) => setUseNotes(e.target.checked)}
              style={{ display: "none" }}
            />
            <span className={`mini-toggle${useNotes ? " on" : ""}`} />
            <span style={{ fontSize: "11px", color: "var(--muted)" }}>Use Notes</span>
          </label>
          <button className="btn-icon-ghost" onClick={clearChat} title="Clear chat">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
          <span style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "'JetBrains Mono', monospace" }}>
            llama3:8b
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="ai-messages-full">
        {messages.map((msg, i) => (
          <div key={i} className={`msg-row${msg.role === "user" ? " user" : ""}`}>
            <div
              className="msg-avatar"
              style={{
                background:
                  msg.role === "ai"
                    ? "linear-gradient(135deg,#3B82F6,#60A5FA)"
                    : "linear-gradient(135deg,#22C55E,#4ADE80)",
              }}
            >
              {msg.role === "ai" ? "∇" : "SM"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className={`msg-bubble ${msg.role}`}>{msg.text}</div>
              {msg.sources && msg.sources.length > 0 && (
                <div className="msg-sources">
                  <span style={{ fontSize: "10px", color: "var(--muted)", fontWeight: 700 }}>Sources: </span>
                  {msg.sources.map((s, si) => (
                    <span key={si} className="source-chip">{s}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="msg-row">
            <div className="msg-avatar" style={{ background: "linear-gradient(135deg,#3B82F6,#60A5FA)" }}>∇</div>
            <div className="msg-bubble ai">
              <div className="typing-dots">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="ai-input-area">
        <div className="ai-input-box">
          <textarea
            ref={textareaRef}
            className="ai-textarea"
            placeholder="Ask about your notes… (Enter to send, Shift+Enter for new line)"
            value={question}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={loading}
          />
          <div className="ai-input-actions">
            <span style={{ fontSize: "11px", color: "var(--muted)" }}>
              {question.length}/500
            </span>
            <button
              className="ai-send-btn"
              onClick={handleAsk}
              disabled={loading || !question.trim()}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}