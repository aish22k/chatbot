import React, { useState, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import { useChat } from "../hooks/useChat";

const injectStyles = () => {
  if (document.getElementById("chatwidget-global-styles")) return;
  const el = document.createElement("style");
  el.id = "chatwidget-global-styles";
  el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

    @keyframes winOpen {
      from { opacity: 0; transform: scale(0.85) translateY(16px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes winClose {
      from { opacity: 1; transform: scale(1) translateY(0); }
      to   { opacity: 0; transform: scale(0.85) translateY(16px); }
    }
    @keyframes msgIn {
      from { opacity: 0; transform: translateY(10px) scale(0.96); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes typingDot {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30%            { transform: translateY(-5px); opacity: 1; }
    }
    @keyframes fabPulse {
      0%   { box-shadow: 0 0 0 0 rgba(37,99,235,0.45); }
      70%  { box-shadow: 0 0 0 12px rgba(37,99,235,0); }
      100% { box-shadow: 0 0 0 0 rgba(37,99,235,0); }
    }
    @keyframes fabIn {
      from { transform: scale(0) rotate(-90deg); opacity: 0; }
      to   { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    @keyframes badgePop {
      from { transform: scale(0); }
      to   { transform: scale(1); }
    }

    .cw-fab:hover {
      transform: scale(1.08) !important;
      box-shadow: 0 12px 32px rgba(37,99,235,0.5) !important;
    }
    .cw-fab:active { transform: scale(0.95) !important; }
    .cw-icon-btn:hover { background: rgba(255,255,255,0.28) !important; }
    .cw-send-btn:not(:disabled):hover { transform: scale(1.07) !important; }
    .cw-messages::-webkit-scrollbar { width: 4px; }
    .cw-messages::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
    .cw-messages::-webkit-scrollbar-track { background: transparent; }
    textarea::-webkit-scrollbar { display: none; }
  `;
  document.head.appendChild(el);
};

const CHAT_ICON = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const CLOSE_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [initialPulse, setInitialPulse] = useState(true);
  const { messages, loading, sendMessage, clearMessages } = useChat();

  useEffect(() => {
    injectStyles();
    const t = setTimeout(() => setInitialPulse(false), 3000);
    return () => clearTimeout(t);
  }, []);

  const handleOpen = () => {
    if (open) {
      setClosing(true);
      setTimeout(() => { setOpen(false); setClosing(false); }, 200);
    } else {
      setOpen(true);
      setInitialPulse(false);
    }
  };

  return (
    <>
      <ChatWindow
        open={open}
        closing={closing}
        onClose={handleOpen}
        messages={messages}
        loading={loading}
        onSend={sendMessage}
        onClear={clearMessages}
      />

      {/* Floating Action Button */}
      <button
        className="cw-fab"
        onClick={handleOpen}
        aria-label={open ? "Close chat" : "Open chat"}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          transition: "transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease",
          boxShadow: "0 8px 24px rgba(37,99,235,0.4), 0 2px 8px rgba(0,0,0,0.12)",
          animation: `fabIn 0.4s cubic-bezier(.34,1.4,.64,1) both${initialPulse ? ", fabPulse 2s 1s 2 ease-out" : ""}`,
          outline: "none",
        }}
      >
        <div style={{
          transition: "transform 0.3s cubic-bezier(.34,1.56,.64,1), opacity 0.2s",
          transform: open ? "rotate(90deg) scale(0.8)" : "rotate(0deg) scale(1)",
          opacity: 1,
          display: "flex",
        }}>
          {open ? CLOSE_ICON : CHAT_ICON}
        </div>

        {/* Unread badge */}
        {!open && (
          <div style={{
            position: "absolute",
            top: "0px", right: "0px",
            width: "16px", height: "16px",
            borderRadius: "50%",
            background: "#ef4444",
            border: "2px solid #fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "9px",
            fontWeight: "700",
            color: "#fff",
            animation: "badgePop 0.3s 1.2s cubic-bezier(.34,1.56,.64,1) both",
            fontFamily: "system-ui",
          }}>
            1
          </div>
        )}
      </button>
    </>
  );
}
