import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const App = () => {
  const webcamRef = useRef(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const captureAndRegister = async () => {
    const screenshot = webcamRef.current.getScreenshot();

    if (!name || !screenshot) {
      alert("Please enter a name and allow camera access.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          image: screenshot,
        }),
      });

      const data = await res.json();
      setMessage(data.message || "Unknown response");
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Face Registration</h1>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={350}
        height={280}
        videoConstraints={{
          width: 350,
          height: 280,
          facingMode: "user",
        }}
      />
      <div style={{ marginTop: "10px" }}>
        <input
          type="text"
          value={name}
          placeholder="Enter name"
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "5px", marginRight: "10px" }}
        />
        <button onClick={captureAndRegister} style={{ padding: "5px 10px" }}>
          Register Face
        </button>
      </div>
      <p>{message}</p>
    </div>
  );
};

export default App;
