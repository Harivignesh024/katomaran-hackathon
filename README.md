# Katomaran AI Hackathon – Face Recognition + RAG Platform

This is a full-stack browser-based AI platform built for the **Katomaran AI Hackathon**. It allows users to:
- Register faces using a webcam
- Recognize multiple faces in real-time with bounding boxes and name labels
- Interact with a chat interface that uses Retrieval-Augmented Generation (RAG) to answer queries about registered faces

---

## 🚀 Features

- 👤 Face Registration (via webcam)
- 👁️ Real-Time Multi-Face Recognition with overlays
- 🧠 Smart Chat Q&A using LangChain + FAISS + OpenAI
- 🔗 WebSocket integration between React ↔ Node.js ↔ Python

---

## 🛠️ Technologies Used

| Module             | Tech Stack                           |
|--------------------|---------------------------------------|
| Frontend           | React.js                             |
| Backend (API/ws)   | Node.js + WebSocket                  |
| Face Recognition   | Python + face_recognition + Flask    |
| RAG Engine         | Python + LangChain + FAISS + OpenAI  |
| Database           | SQLite (or MongoDB optional)         |
| LLM Provider       | OpenAI GPT-4 (via Groq endpoint)     |

---

## 📁 Folder Structure

katomaran-hackathon/
├── frontend/ # React frontend (register, live, chat)
│ └── src/
│ ├── App.jsx
│ ├── Register.jsx
│ ├── Live.jsx
│ ├── Chat.jsx
│ └── index.css
│
├── backend/
│ ├── python/
│ │ ├── register_face.py # Face registration API
│ │ ├── recognize_faces.py # Live recognition API
│ │ └── rag_engine.py # RAG chat engine
│ │
│ └── node/
│ └── server.js # WebSocket server
│
├── database/
│ └── faces.db # SQLite database (face encodings)
│
├── architecture.png # System architecture diagram
└── README.md


## 🧑‍💻 Instructions to Run the App Locally

Follow the steps below to set up and run the full application:

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/katomaran-face-rag-hackathon.git
cd katomaran-face-rag-hackathon
2. Setup Python Backend (Face APIs & RAG)
cd backend/python
pip install -r requirements.txt  # Ensure face_recognition, flask, langchain, faiss, etc.

# Run registration API
python register_face.py

# In a new terminal tab, run live recognition
python recognize_faces.py
⚠️ Ensure your camera is accessible and lighting is sufficient for recognition to work well.

3. Setup Node.js WebSocket Server
cd ../node
npm install
node server.js
4. Setup React Frontend
cd ../../frontend
npm install
npm run dev
The app will start on http://localhost:5173 (or another port if that one is taken)

🔐 Environment Variables
To run the RAG module, create a .env file in backend/python/ and add:

GROQ_API_KEY=your_openai_compatible_key_here
✅ Functional Tabs Overview
Register Tab: Use webcam to register a face with a name.

Live Tab: Detect multiple faces in real-time, show bounding boxes and names.

Chat Tab: Ask questions like:

"Who was the last person registered?"

"At what time was Karthik registered?"

"How many people are currently registered?"

🪵 Logging
Each backend module logs events to console for debugging and traceability:

register_face.py: Logs registered names and timestamps

recognize_faces.py: Logs all faces detected in each frame

rag_engine.py: Logs queries and generated LLM responses

server.js: Logs all messages received/sent via WebSocket

📌 Assumptions
System assumes clean lighting and clear face input for better detection

Face encodings are reloaded on every recognition call (in-memory refresh)

Chat responses are generated based on text metadata (not image content)

Demo Video:

https://www.loom.com/share/5e4c37de503a474193cf328ab610293e?sid=70482e3e-293e-4c1a-a1e1-18ee0801bdba
This project is a part of a hackathon run by https://katomaran.com
