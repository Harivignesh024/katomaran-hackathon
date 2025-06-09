from flask import Flask, request, jsonify
import face_recognition
import sqlite3
import numpy as np
import base64
import cv2
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# DB connection (reuse cursor)
conn = sqlite3.connect("../../database/faces.db", check_same_thread=False)
cursor = conn.cursor()

@app.route("/recognize", methods=["POST"])
def recognize():
    try:
        cursor.execute("SELECT name, encoding FROM faces")
        known_faces = [
            (name, np.frombuffer(encoding, dtype=np.float64))
            for name, encoding in cursor.fetchall()
        ]

        data = request.get_json()
        image_data = data["image"].split(",")[1]
        image_bytes = base64.b64decode(image_data)
        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        face_locations = face_recognition.face_locations(rgb_img)
        face_encodings = face_recognition.face_encodings(rgb_img, face_locations)

        results = []
        for i, encoding in enumerate(face_encodings):
            name = "Unknown"
            for known_name, known_encoding in known_faces:
                match = face_recognition.compare_faces([known_encoding], encoding)[0]
                if match:
                    name = known_name
                    break
            top, right, bottom, left = face_locations[i]
            results.append({
                "name": name,
                "box": [top, right, bottom, left]
            })

        return jsonify(results)
    except Exception as e:
        print(f"[RECOGNIZE] Detected: {name} at box: {top, right, bottom, left}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5001)
