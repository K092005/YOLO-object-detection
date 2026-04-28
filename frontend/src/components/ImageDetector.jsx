import { useState, useRef, useCallback } from 'react';
import { Upload, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';

export default function ImageDetector() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(URL.createObjectURL(file));
      setResultImage(null);
      setError(null);
      handleUpload(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleUpload = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch('http://localhost:8000/detect/image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();
      setResultImage(`data:image/jpeg;base64,${data.image_base64}`);
    } catch (err) {
      console.error(err);
      setError("Failed to process the image. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setSelectedImage(null);
    setResultImage(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="glass-panel">
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <ImageIcon size={22} color="#3b82f6" /> Static Image Detection
      </h2>

      {/* Single hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        style={{ display: 'none' }} 
        accept="image/*"
      />

      {!selectedImage && (
        <div 
          className={`upload-area ${dragOver ? 'drag-over' : ''}`}
          onClick={() => fileInputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload size={44} color="#3b82f6" style={{ marginBottom: '1rem' }} />
          <h3 style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>Drag & Drop or Click to Upload</h3>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>Supports JPG, PNG, WebP</p>
        </div>
      )}

      {selectedImage && (
        <div className="result-container">
          <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <img 
              src={resultImage || selectedImage} 
              alt="Detection Result" 
              className="image-preview" 
              style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.3s ease' }}
            />
            {loading && (
              <div style={{ 
                position: 'absolute', top: '50%', left: '50%', 
                transform: 'translate(-50%, -50%)', 
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', 
                background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
                padding: '2rem', borderRadius: '16px',
                border: '1px solid var(--border-subtle)'
              }}>
                <div className="loader"></div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Analyzing with YOLO...</span>
              </div>
            )}
          </div>

          {!loading && resultImage && (
            <div style={{ display: 'flex', gap: '8px', color: 'var(--success)', marginTop: '0.5rem', alignItems: 'center', fontSize: '0.9rem', fontWeight: 500 }}>
              <CheckCircle size={18} /> Analysis Complete
            </div>
          )}

          {error && (
            <div style={{ display: 'flex', gap: '8px', color: 'var(--error)', marginTop: '0.5rem', alignItems: 'center', fontSize: '0.9rem' }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
             <button 
                className="primary-btn" 
                onClick={() => {
                  resetState();
                  setTimeout(() => fileInputRef.current?.click(), 100);
                }}
              >
                Upload New Image
              </button>
          </div>
        </div>
      )}
    </div>
  );
}
