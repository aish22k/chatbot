const API_BASE = "http://127.0.0.1:8000";

export async function sendChatMessage(question) {
  const response = await fetch(`${API_BASE}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  const data = await response.json();
  return (
    data?.answer ||
    data?.response ||
    data?.message ||
    data?.text ||
    "Sorry, I didn't understand that."
  );
}
