import React from "react";
import ChatWidget from "./components/ChatWidget";

export default function App() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    }}>
      {/* Page content placeholder */}
      <div style={{ textAlign: "center", color: "#94a3b8" }}>
        <p style={{ fontSize: "15px" }}>Your website content goes here.</p>
        <p style={{ fontSize: "13px", marginTop: "8px" }}>
          The chatbot widget is in the bottom-right corner →
        </p>
      </div>

      {/* Chatbot Widget — renders fixed over everything */}
      <ChatWidget />
    </div>
  );
}
