const WebSocket = require("ws");
const { spawn } = require("child_process");

const wss = new WebSocket.Server({ port: 8080 }, () =>
  console.log("✅ WebSocket Server running on ws://localhost:8080")
);

wss.on("connection", (ws) => {
  console.log("🟢 New client connected");

  ws.on("message", (message) => {
    console.log("📨 Received:", message.toString());

    const py = spawn("python", ["../python/rag_engine.py", message.toString()]);
    let buffer = "";

    py.stdout.on("data", (data) => {
      buffer += data.toString();

      if (buffer.includes("BOT_RESPONSE_START") && buffer.includes("BOT_RESPONSE_END")) {
        const response = buffer
          .split("BOT_RESPONSE_START")[1]
          .split("BOT_RESPONSE_END")[0]
          .trim();
        ws.send(response);
        buffer = ""; // clear buffer
      }
    });

    py.stderr.on("data", (err) => {
      console.error("🐍 Python Error:", err.toString());
      ws.send("❌ Internal server error from RAG engine.");
    });
  });
});
