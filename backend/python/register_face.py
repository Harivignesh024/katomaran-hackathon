# backend/python/register_face.py

import base64
import cv2
import numpy as np
import face_recognition
import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Connect to SQLite DB
conn = sqlite3.connect("../../database/faces.db", check_same_thread=False)
cursor = conn.cursor()
cursor.execute('''CREATE TABLE IF NOT EXISTS faces (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    encoding BLOB,
    timestamp TEXT
)''')
conn.commit()

def convert_encoding_to_blob(encoding):
    return encoding.tobytes()

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data["name"]
    image_data = data["image"].split(",")[1]  # remove base64 prefix
    image_bytes = base64.b64decode(image_data)
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    face_locations = face_recognition.face_locations(img)
    if not face_locations:
        return jsonify({"message": "No face detected!"}), 400

    encodings = face_recognition.face_encodings(img, face_locations)
    encoding = encodings[0]
    blob = convert_encoding_to_blob(encoding)
    timestamp = datetime.now().isoformat()

    cursor.execute("INSERT INTO faces (name, encoding, timestamp) VALUES (?, ?, ?)",
                   (name, blob, timestamp))
    conn.commit()
    print(f"[REGISTER] {name} registered at {timestamp}")

    return jsonify({"message": f"Face for {name} registered successfully!"})

if __name__ == "__main__":
    app.run(port=5000)
