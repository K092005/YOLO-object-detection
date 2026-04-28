import { useState, useRef, useEffect } from 'react';
import { Camera, StopCircle, Video, AlertCircle } from 'lucide-react';

export default function WebcamDetector() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const wsRef = useRef(null);
  const streamRef = useRef(null);
  const captureIntervalRef = useRef(null);
  const isReadyForNextFrame = useRef(true);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsStreaming(true);
      setError(null);
      connectWebSocket();
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setError("Could not access webcam. Please check permissions.");
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
    }
    setIsStreaming(false);
    if (imageRef.current) {
      imageRef.current.src = "";
    }
  };

  const connectWebSocket = () => {
    wsRef.current = new WebSocket('ws://localhost:8000/ws/detect');

    wsRef.current.onopen = () => {
      console.log("WebSocket connected");
      isReadyForNextFrame.current = true;
      captureAndSendFrame(); // Trigger first frame
    };

    wsRef.current.onmessage = (event) => {
      const data = event.data;
      if (imageRef.current) {
        imageRef.current.src = `data:image/jpeg;base64,${data}`;
      }
      
      // Request next frame after a small delay
      isReadyForNextFrame.current = true;
      setTimeout(captureAndSendFrame, 10);
    };

    wsRef.current.onerror = (err) => {
      console.error("WebSocket error:", err);
      setError("WebSocket connection failed. Is the backend running?");
      stopWebcam();
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket connection closed");
    };
  };

  const captureAndSendFrame = () => {
    if (
      isReadyForNextFrame.current &&
      videoRef.current && 
      videoRef.current.readyState >= 2 && 
      canvasRef.current && 
      wsRef.current && 
      wsRef.current.readyState === WebSocket.OPEN
    ) {
      isReadyForNextFrame.current = false;
      const context = canvasRef.current.getContext('2d');
      context.save();
      context.translate(canvasRef.current.width, 0);
      context.scale(-1, 1);
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      context.restore();
      
      const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.8);
      wsRef.current.send(dataUrl);
    }
  };

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  return (
    <div className="glass-panel">
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <Video size={22} color="#f59e0b" /> Live Webcam Detection
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        
        {/* Hidden elements for capturing */}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }} 
        ></video>
        <canvas 
          ref={canvasRef} 
          width="640" 
          height="480" 
          style={{ display: 'none' }}
        ></canvas>

        {/* Display element for the annotated stream */}
        <div style={{ 
          width: '100%', 
          maxWidth: '640px', 
          aspectRatio: '4/3', 
          background: 'rgba(0,0,0,0.4)', 
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)',
          position: 'relative'
        }}>
          {!isStreaming && !error && (
             <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Camera is offline</span>
          )}
          
          <img 
            ref={imageRef} 
            className="webcam-canvas" 
            style={{ 
              display: isStreaming ? 'block' : 'none', 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }} 
            alt="Webcam stream" 
          />
          
          {/* Pulsing LIVE indicator */}
          {isStreaming && (
            <div style={{ 
              position: 'absolute', top: '12px', right: '12px', 
              display: 'flex', alignItems: 'center', gap: '6px', 
              background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
              padding: '4px 12px', borderRadius: '50px', 
              fontSize: '0.75rem', fontWeight: 600, color: '#22c55e',
              letterSpacing: '0.05em', textTransform: 'uppercase'
            }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 1.5s ease-in-out infinite' }}></div>
              LIVE
            </div>
          )}
        </div>

        {error && (
            <div style={{ display: 'flex', gap: '8px', color: 'var(--error)', marginTop: '0.5rem', alignItems: 'center', fontSize: '0.9rem' }}>
              <AlertCircle size={18} /> {error}
            </div>
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          {!isStreaming ? (
            <button className="primary-btn" onClick={startWebcam}>
              <Camera size={18} /> Start Webcam
            </button>
          ) : (
            <button className="primary-btn danger-btn" onClick={stopWebcam}>
              <StopCircle size={18} /> Stop Streaming
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
