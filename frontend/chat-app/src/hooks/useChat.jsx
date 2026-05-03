import { useState, useCallback } from "react";
import { sendChatMessage } from "../services/api";

const WELCOME = {
  id: "welcome",
  role: "bot",
  text: "Hello! 👋 I'm here to help. What's on your mind?",
  ts: Date.now(),
};

export function useChat() {
  const [messages, setMessages] = useState([WELCOME]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg = { id: Date.now(), role: "user", text: trimmed, ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    try {
      const botText = await sendChatMessage(trimmed);
      const botMsg = { id: Date.now() + 1, role: "bot", text: botText, ts: Date.now() };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errMsg = {
        id: Date.now() + 1,
        role: "bot",
        text: "⚠️ Couldn't reach the server. Please try again.",
        ts: Date.now(),
        isError: true,
      };
      setMessages((prev) => [...prev, errMsg]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const clearMessages = useCallback(() => {
    setMessages([WELCOME]);
    setError(null);
  }, []);

  return { messages, loading, error, sendMessage, clearMessages };
}
