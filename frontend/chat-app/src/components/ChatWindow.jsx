import React, { useRef, useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";

const SEND_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const CLOSE_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const TRASH_ICON = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
);

const BOT_AVATAR = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <line x1="12" y1="7" x2="12" y2="11" />
  </svg>
);

function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
      <div style={{
        width: "28px", height: "28px", borderRadius: "50%",
        background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
      }}>
        {BOT_AVATAR}
      </div>
      <div style={{
        background: "#f1f5f9", borderRadius: "4px 18px 18px 18px",
        padding: "12px 16px", display: "flex", gap: "5px", alignItems: "center",
        boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
      }}>
        {[0, 0.18, 0.36].map((delay, i) => (
          <div key={i} style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: "#94a3b8",
            animation: `typingDot 1.1s ${delay}s infinite ease-in-out`,
          }} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  window: (visible) => ({
    position: "fixed",
    bottom: "90px",
    right: "24px",
    width: "340px",
    height: "480px",
    borderRadius: "20px",
    background: "#fff",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 9998,
    transformOrigin: "bottom right",
    animation: visible ? "winOpen 0.3s cubic-bezier(.34,1.4,.64,1) both" : "winClose 0.2s ease-in both",
    border: "1px solid rgba(0,0,0,0.06)",
    fontFamily: "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif",
  }),
  header: {
    background: "linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)",
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
  },
  headerLeft: {
    display: "flex", alignItems: "center", gap: "10px",
  },
  headerAvatar: {
    width: "36px", height: "36px", borderRadius: "50%",
    background: "rgba(255,255,255,0.18)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  headerTitle: {
    color: "#fff", fontWeight: "700", fontSize: "14.5px",
    margin: 0, letterSpacing: "0.01em",
  },
  headerStatus: {
    color: "rgba(255,255,255,0.7)", fontSize: "11px",
    margin: 0, marginTop: "2px", display: "flex", alignItems: "center", gap: "4px",
  },
  onlineDot: {
    width: "6px", height: "6px", borderRadius: "50%",
    background: "#4ade80", display: "inline-block",
    boxShadow: "0 0 0 2px rgba(74,222,128,0.3)",
  },
  headerActions: {
    display: "flex", gap: "6px",
  },
  iconBtn: {
    background: "rgba(255,255,255,0.15)",
    border: "none", borderRadius: "8px",
    width: "30px", height: "30px",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", color: "#fff",
    transition: "background 0.15s", outline: "none",
  },
  messages: {
    flex: 1, overflowY: "auto",
    padding: "16px 14px",
    display: "flex", flexDirection: "column", gap: "10px",
    background: "#f8fafc",
    scrollbarWidth: "thin",
    scrollbarColor: "#cbd5e1 transparent",
  },
  inputArea: {
    padding: "12px 12px",
    background: "#fff",
    borderTop: "1px solid #f1f5f9",
    display: "flex", gap: "8px", alignItems: "flex-end",
    flexShrink: 0,
  },
  textarea: {
    flex: 1, border: "1.5px solid #e2e8f0",
    borderRadius: "12px", padding: "9px 12px",
    fontSize: "13.5px", outline: "none",
    resize: "none", fontFamily: "inherit",
    lineHeight: "1.5", color: "#1e293b",
    background: "#f8fafc",
    transition: "border-color 0.15s, box-shadow 0.15s",
    maxHeight: "80px", overflowY: "auto",
    scrollbarWidth: "none",
  },
  sendBtn: (disabled) => ({
    width: "38px", height: "38px",
    borderRadius: "11px",
    background: disabled
      ? "#e2e8f0"
      : "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, color: disabled ? "#94a3b8" : "#fff",
    transition: "all 0.18s",
    boxShadow: disabled ? "none" : "0 2px 8px rgba(37,99,235,0.35)",
    outline: "none",
  }),
};

export default function ChatWindow({ open, closing, onClose, messages, loading, onSend, onClear }) {
  const [input, setInput] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 320);
  }, [open]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = input.trim().length > 0 && !loading;

  if (!open && !closing) return null;

  return (
    <div style={styles.window(!closing)}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerAvatar}>{BOT_AVATAR}</div>
          <div>
            <p style={styles.headerTitle}>Assistant</p>
            <p style={styles.headerStatus}>
              <span style={styles.onlineDot} />
              Online • Ready to help
            </p>
          </div>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.iconBtn} onClick={onClear} title="Clear chat">{TRASH_ICON}</button>
          <button style={styles.iconBtn} onClick={onClose} title="Close">{CLOSE_ICON}</button>
        </div>
      </div>

      {/* Messages */}
      <div style={styles.messages}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={styles.inputArea}>
        <textarea
          ref={inputRef}
          rows={1}
          style={{
            ...styles.textarea,
            ...(inputFocused ? { borderColor: "#6366f1", boxShadow: "0 0 0 3px rgba(99,102,241,0.12)" } : {}),
          }}
          placeholder="Type a message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          disabled={loading}
        />
        <button style={styles.sendBtn(!canSend)} onClick={handleSend} disabled={!canSend}>
          {SEND_ICON}
        </button>
      </div>
    </div>
  );
}
