import React from "react";

const BOT_AVATAR = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <line x1="12" y1="7" x2="12" y2="11" />
    <circle cx="8.5" cy="15.5" r="0.8" fill="#fff" stroke="none" />
    <circle cx="15.5" cy="15.5" r="0.8" fill="#fff" stroke="none" />
  </svg>
);

const styles = {
  row: (isUser) => ({
    display: "flex",
    flexDirection: isUser ? "row-reverse" : "row",
    alignItems: "flex-end",
    gap: "8px",
    maxWidth: "100%",
    animationName: "msgIn",
    animationDuration: "0.28s",
    animationTimingFunction: "cubic-bezier(.34,1.4,.64,1)",
    animationFillMode: "both",
  }),
  avatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginBottom: "2px",
    boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
  },
  bubble: (isUser, isError) => ({
    maxWidth: "75%",
    padding: "10px 14px",
    borderRadius: isUser ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
    background: isError
      ? "#fef2f2"
      : isUser
      ? "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)"
      : "#f1f5f9",
    color: isUser && !isError ? "#fff" : isError ? "#b91c1c" : "#1e293b",
    fontSize: "13.5px",
    lineHeight: "1.6",
    wordBreak: "break-word",
    boxShadow: isUser
      ? "0 3px 12px rgba(37,99,235,0.25)"
      : "0 1px 4px rgba(0,0,0,0.07)",
    border: isError ? "1px solid #fecaca" : "none",
    letterSpacing: "0.005em",
  }),
};

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div style={styles.row(isUser)}>
      {!isUser && <div style={styles.avatar}>{BOT_AVATAR}</div>}
      <div style={styles.bubble(isUser, message.isError)}>
        {message.text}
      </div>
    </div>
  );
}
