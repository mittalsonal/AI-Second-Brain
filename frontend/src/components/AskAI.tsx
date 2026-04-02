"use client";

import { useState } from "react";

type Message = { role: "ai" | "user"; text: string };

const initial: Message[] = [
  { role: "ai", text: "Hi! Ask me anything about your notes. I'll search through your knowledge base to find answers." },
];

export default function AskAI() {
  const [messages, setMessages] = useState<Message[]>(initial);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    const q = question;
    setMessages((p) => [...p, { role: "user", text: q }]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      setMessages((p) => [...p, { role: "ai", text: data.answer }]);
    } catch {
      setMessages((p) => [...p, { role: "ai", text: "⚠️ Could not reach the AI server. Make sure the backend is running." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <span className="panel-dot" style={{ background: "var(--accent)", boxShadow: "0 0 8px var(--accent)" }} />
          Ask AI
        </div>
        <span style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "'JetBrains Mono', monospace" }}>
          llama3:8b
        </span>
      </div>

      <div className="ai-chat-body">
        <div className="ai-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`msg-row${msg.role === "user" ? " user" : ""}`}>
              <div
                className="msg-avatar"
                style={{
                  background: msg.role === "ai"
                    ? "linear-gradient(135deg,#3B82F6,#60A5FA)"
                    : "linear-gradient(135deg,#22C55E,#4ADE80)",
                }}
              >
                {msg.role === "ai" ? "∇" : "SK"}
              </div>
              <div className={`msg-bubble ${msg.role}`}>{msg.text}</div>
            </div>
          ))}

          {loading && (
            <div className="msg-row">
              <div className="msg-avatar" style={{ background: "linear-gradient(135deg,#3B82F6,#60A5FA)" }}>∇</div>
              <div className="msg-bubble ai" style={{ color: "var(--muted)" }}>Thinking...</div>
            </div>
          )}
        </div>

        <div className="ai-input-row">
          <input
            className="ai-text-input"
            type="text"
            placeholder="Ask about your notes..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          />
          <button className="ai-send-btn" onClick={handleAsk} disabled={loading}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}