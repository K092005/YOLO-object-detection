import base64

import os
import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained YOLO model (best.pt)
CUSTOM_MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'best.pt')
FALLBACK_MODEL_PATH = 'yolov8n.pt'

if os.path.exists(CUSTOM_MODEL_PATH):
    model_path = CUSTOM_MODEL_PATH
    print(f"Loading custom trained model from: {os.path.abspath(CUSTOM_MODEL_PATH)}")
else:
    model_path = FALLBACK_MODEL_PATH
    print(f"Custom model not found at {CUSTOM_MODEL_PATH}, falling back to {FALLBACK_MODEL_PATH}")

model = YOLO(model_path)
print(f"Model loaded successfully: {model_path}")

def process_image(img_numpy: np.ndarray):
    # Run YOLO inference with optimized parameters for CPU
    results = model(img_numpy, imgsz=320, verbose=False)
    # Get annotated image (BGR format)
    annotated_frame = results[0].plot()
    return annotated_frame

@app.get("/")
def read_root():
    return {"status": "YOLO Detection Server Running"}

@app.post("/detect/image")
async def detect_image(file: UploadFile = File(...)):
    contents = await file.read()
    # Decode image
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Process
    annotated_img = process_image(img)
    
    # Encode back to JPEG
    _, buffer = cv2.imencode('.jpg', annotated_img)
    encoded_img = base64.b64encode(buffer).decode('utf-8')
    
    return {"image_base64": encoded_img}

@app.websocket("/ws/detect")
async def detect_webcam(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Receive base64 frame
            data = await websocket.receive_text()
            
            # Remove header if present (e.g., "data:image/jpeg;base64,...")
            if "," in data:
                data = data.split(",")[1]
                
            img_data = base64.b64decode(data)
            nparr = np.frombuffer(img_data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is not None:
                # Process
                annotated_img = process_image(img)
                
                # Encode response with higher compression for lower latency
                _, buffer = cv2.imencode('.jpg', annotated_img, [int(cv2.IMWRITE_JPEG_QUALITY), 70])
                encoded_img = base64.b64encode(buffer).decode('utf-8')
                
                await websocket.send_text(encoded_img)
    except WebSocketDisconnect:
        print("Client disconnected from WebSocket")
