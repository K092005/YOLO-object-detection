<div align="center">
  <h1>🚀 YOLO Real-Time Object Detection</h1>
  <p><strong>A full-stack AI application powered by YOLOv8, FastAPI, and React</strong></p>

  <img src="https://img.shields.io/badge/Python-3.10+-blue.svg" alt="Python Version"/>
  <img src="https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=flat&logo=vite&logoColor=FFD62E" alt="Vite"/>
  <img src="https://img.shields.io/badge/YOLO-Ultralytics-orange?style=flat" alt="YOLOv8"/>
</div>

<br/>

## 🌟 Overview

Welcome to the **YOLO Real-Time Object Detection** project! This repository contains a complete, robust, and highly responsive web application that leverages state-of-the-art computer vision models (YOLOv8) to perform object detection. 

Whether you want to upload a static image or stream directly from your webcam, this application provides instantaneous inferences directly on your browser!

---

## ✨ Features

- **📷 Real-Time Webcam Detection**: Low-latency video streaming and bounding-box rendering using WebSockets.
- **🖼️ Image Upload Inference**: Upload any image and instantly receive an annotated version highlighting detected objects.
- **⚡ High Performance**: Fast and efficient backend using FastAPI, fully optimized for inference.
- **🎨 Beautiful UI**: A sleek, modern frontend built with React & Vite.
- **🧠 Custom Models**: Easily plug in your own custom-trained YOLO models (`best.pt`) or fall back to the pre-trained `yolov8n.pt`.

---

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Blazing fast Python web framework.
- **Ultralytics (YOLOv8)**: The core AI engine for object detection.
- **OpenCV & NumPy**: Image processing and matrix manipulations.
- **WebSockets**: Bi-directional communication for real-time video streaming.

### Frontend
- **React 19**: Modern frontend library for building user interfaces.
- **Vite**: Next-generation frontend tooling for ultra-fast builds.
- **Lucide React**: Beautiful open-source icons.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v16+)
- [Python](https://www.python.org/) (3.10+)

### 1. Clone the repository

```bash
git clone https://github.com/K092005/YOLO-object-detection.git
cd YOLO-object-detection
```

### 2. Backend Setup

Open a new terminal and navigate to the `backend` directory:

```bash
cd backend
python -m venv venv
```

**Activate the virtual environment:**
- On Windows: `venv\Scripts\activate`
- On macOS/Linux: `source venv/bin/activate`

**Install dependencies:**
```bash
pip install fastapi uvicorn ultralytics opencv-python-headless python-multipart websockets
```

**Run the FastAPI Server:**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
The backend API will be available at `http://localhost:8000`.

### 3. Frontend Setup

Open a new terminal and navigate to the `frontend` directory:

```bash
cd frontend
npm install
```

**Run the React Development Server:**
```bash
npm run dev
```
The frontend will be accessible at `http://localhost:5173`.

---

## 📁 Project Structure

```text
YOLO-object-detection/
├── backend/
│   ├── main.py             # FastAPI Server & WebSocket handlers
│   └── yolov8n.pt          # Pre-trained YOLO model (fallback)
├── frontend/
│   ├── src/
│   │   ├── components/     # React Components (WebcamDetector, ImageDetector)
│   │   ├── App.jsx         # Main App logic
│   │   └── main.jsx        # React entry point
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
└── README.md               # You are here!
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/K092005/YOLO-object-detection/issues).

---


