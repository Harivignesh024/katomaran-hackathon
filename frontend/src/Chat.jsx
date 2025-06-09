import React, { useEffect, useState } from "react";

let socket;

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket = new WebSocket("ws://localhost:8080");

    socket.onmessage = (event) => {
      const botMessage = { role: "bot", content: event.data };
      setMessages((prev) => [...prev, botMessage]);
    };

    return () => socket.close();
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(input);
    } else {
      console.error("WebSocket not connected.");
    }

    setInput("");
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>🧠 Chat with RAG Engine</h2>
      <div style={{ margin: "20px auto", width: "90%", height: "300px", overflowY: "scroll", border: "1px solid #ccc", padding: "10px", borderRadius: "10px" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.role === "user" ? "right" : "left" }}>
            <strong>{msg.role === "user" ? "You" : "Bot"}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          style={{ padding: "10px", width: "300px", borderRadius: "8px" }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
