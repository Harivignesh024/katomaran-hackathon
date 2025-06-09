import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";

const Live = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [people, setPeople] = useState([]);

  const drawBoxes = (boxes, ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    boxes.forEach((person) => {
      const [top, right, bottom, left] = person.box;
      const width = right - left;
      const height = bottom - top;

      // Draw bounding box
      ctx.strokeStyle = "#8a2be2";
      ctx.lineWidth = 2;
      ctx.strokeRect(left, top, width, height);

      // Draw label background
      ctx.fillStyle = "#8a2be2";
      ctx.fillRect(left, top - 20, ctx.measureText(person.name).width + 10, 20);

      // Draw label text
      ctx.fillStyle = "#fff";
      ctx.font = "16px sans-serif";
      ctx.fillText(person.name, left + 5, top - 5);
    });
  };

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    try {
      const res = await fetch("http://localhost:5001/recognize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageSrc }),
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setPeople(data);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        drawBoxes(data, ctx);
      }
    } catch (e) {
      console.error("Recognition error:", e);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      capture();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
  <div style={{
    position: "relative",
    width: 640,
    height: 480,
    margin: "auto",
    marginTop: "40px",
  }}>
    <Webcam
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      width={640}
      height={480}
      videoConstraints={{ width: 640, height: 480 }}
      style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
    />
    <canvas
      ref={canvasRef}
      width={640}
      height={480}
      style={{ position: "absolute", top: 0, left: 0, zIndex: 2 }}
    />
  </div>
);
};

export default Live;
