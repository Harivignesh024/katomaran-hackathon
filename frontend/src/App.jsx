import React, { useState } from "react";
import Register from "./Register";
import Chat from "./Chat";
import Live from "./Live";

const App = () => {
  const [tab, setTab] = useState("register");

  const renderTab = () => {
    switch (tab) {
      case "register":
        return <Register />;
      case "chat":
        return <Chat />;
      case "live":
        return <Live />;
      default:
        return null;
    }
  };

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "#0d0d0d",
      color: "#f0e6ff",
    }}>
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "1rem",
        marginTop: "20px"
      }}>
        <button onClick={() => setTab("register")}>Register Face</button>
        <button onClick={() => setTab("chat")}>Chat</button>
        <button onClick={() => setTab("live")}>Live Recognition</button>
      </div>
      <div style={{
        flex: 1,
        width: "100%",
        maxWidth: "1280px",
        marginTop: "20px",
        padding: "10px",
        boxSizing: "border-box"
      }}>
        {renderTab()}
      </div>
    </div>
  );
};

export default App;
