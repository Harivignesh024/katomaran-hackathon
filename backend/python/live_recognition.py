import cv2
import face_recognition
import sqlite3
import numpy as np

# Step 1: Load encodings from SQLite DB
conn = sqlite3.connect("../../database/faces.db")
cursor = conn.cursor()
cursor.execute("SELECT name, encoding FROM faces")
rows = cursor.fetchall()

known_encodings = []
known_names = []

for name, blob in rows:
    encoding = np.frombuffer(blob, dtype=np.float64)
    known_encodings.append(encoding)
    known_names.append(name)

print(f"[INFO] Loaded {len(known_encodings)} known faces from DB")

# Step 2: Start webcam
video = cv2.VideoCapture(0)
print("[INFO] Starting webcam... Press 'q' to quit.")

while True:
    ret, frame = video.read()
    if not ret:
        print("[ERROR] Frame not received!")
        break

    # Step 3: Resize and convert to RGB
    small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
    rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

    # Step 4: Face detection + encoding
    face_locations = face_recognition.face_locations(rgb_small_frame)
    face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

    # Step 5: Match faces
    for (top, right, bottom, left), encoding in zip(face_locations, face_encodings):
        matches = face_recognition.compare_faces(known_encodings, encoding)
        name = "Unknown"

        face_distances = face_recognition.face_distance(known_encodings, encoding)
        best_match = np.argmin(face_distances)

        if matches[best_match]:
            name = known_names[best_match]

        # Scale back up face boxes
        top *= 4
        right *= 4
        bottom *= 4
        left *= 4

        # Draw box + name
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
        cv2.putText(frame, name, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

    # Display the frame
    cv2.imshow("Live Face Recognition", frame)

    # Break on 'q' key
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Cleanup
video.release()
cv2.destroyAllWindows()
print("[INFO] Webcam closed.")
