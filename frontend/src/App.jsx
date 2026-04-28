import { useState } from 'react';
import ImageDetector from './components/ImageDetector';
import WebcamDetector from './components/WebcamDetector';
import { Scan } from 'lucide-react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('image');

  return (
    <div className="app-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}>
        <Scan size={40} color="#3b82f6" strokeWidth={2.5} />
        <h1>YOLO Vision</h1>
      </div>
      <p className="subtitle">Real-Time Object Detection Engine</p>

      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'image' ? 'active' : ''}`}
          onClick={() => setActiveTab('image')}
        >
          Image Detection
        </button>
        <button 
          className={`tab-btn ${activeTab === 'webcam' ? 'active' : ''}`}
          onClick={() => setActiveTab('webcam')}
        >
          Live Webcam
        </button>
      </div>

      {activeTab === 'image' ? <ImageDetector /> : <WebcamDetector />}
      
    </div>
  );
}

export default App;
