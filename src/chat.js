import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Image as ImageIcon, Home, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const Chat = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    let stream = null;

    const setupCamera = async () => {
      try {
        if (isCameraActive && videoRef.current) {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: 'environment' // Prefer rear camera on mobile
            } 
          });
          videoRef.current.srcObject = stream;
          // Wait for video to be loaded
          await new Promise((resolve) => {
            videoRef.current.onloadedmetadata = resolve;
          });
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
      }
    };

    setupCamera();

    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraActive]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setIsCameraActive(false); // Disable camera if an image is selected
    }
  };

  const handleCapture = () => {
    if (videoRef.current) {
      // Create a temporary canvas with video dimensions
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      const context = canvas.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        const file = new File([blob], "captured-image.jpg", { type: "image/jpeg" });
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(blob));
        setIsCameraActive(false);
      }, 'image/jpeg');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      alert('Please select or capture an image.');
      return;
    }

    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { image: imagePreview, sender: 'user' },
      { text: 'Processing...', sender: 'ai' }
    ]);

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/predict/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const predictedClass = response.data.predicted_class;
      const advice = response.data.advice || "No specific advice available.";

      setMessages((prev) => [
        ...prev.slice(0, -1), // Remove "Processing..."
        { text: `🛑 Detected: ${predictedClass}`, sender: 'ai' },
        { text: `✅ Advice: ${advice}`, sender: 'ai' }
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { text: 'An error occurred.', sender: 'ai' }
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#FAFDF7]">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-emerald-700 hover:text-emerald-600 transition-colors">
            <Home size={24} />
          </Link>
          <div className="flex items-center gap-3">
            <Leaf className="text-emerald-600" size={24} />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
              Plant Disease Detection
            </h1>
          </div>
          <div className="w-6"></div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#1B4332]/30 bg-opacity-50"
           style={{
             backgroundImage: `radial-gradient(#588157 0.5px, transparent 0.5px)`,
             backgroundSize: '15px 15px'
           }}>
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div 
              className={`max-w-sm rounded-2xl shadow-md
                ${message.sender === 'user' 
                  ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-white' 
                  : 'bg-white border border-gray-100'
                }`}>
              {message.image ? (
                <div className="relative p-2">
                  <img 
                    src={message.image} 
                    alt="Uploaded" 
                    className="rounded-xl shadow-sm transition-transform hover:scale-105" 
                  />
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Your Crop
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  {message.text.startsWith('🛑') ? (
                    <div className="space-y-2">
                      <div className="font-semibold text-xl">{message.text}</div>
                    </div>
                  ) : message.text.startsWith('✅') ? (
                    <div className="space-y-3">
                      <div className="font-medium text-emerald-800">Treatment Recommendation:</div>
                      <div className={`p-4 rounded-lg ${message.sender === 'user' ? 'bg-emerald-500/20' : 'bg-emerald-50'} text-emerald-800`}>
                        {message.text.replace('✅ Advice: ', '')}
                      </div>
                    </div>
                  ) : (
                    <div className={`text-lg ${message.sender === 'ai' ? 'text-gray-700' : ''}`}>
                      {message.text}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="px-4 py-3 bg-white border-t">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-20 h-20 rounded-2xl object-cover shadow-sm border border-gray-100" 
              />
              <button 
                onClick={() => setImagePreview(null)}
                className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white text-sm font-medium"
              >
                Remove
              </button>
            </div>
            <div className="text-sm text-gray-500">Image ready for analysis</div>
          </div>
        </div>
      )}

      {/* Camera Section */}
      {isCameraActive && (
        <div className="p-4 bg-white border-t">
          <div className="relative max-w-2xl mx-auto overflow-hidden">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              muted // Add muted to prevent audio feedback
              className="w-full rounded-2xl shadow-lg object-cover"
              style={{ 
                maxHeight: '60vh',
                transform: 'scaleX(-1)' // Mirror front camera
              }}
            />
            <div className="absolute bottom-4 left-0 right-0">
              <div className="flex justify-center gap-4 px-4">
                <button 
                  onClick={handleCapture} 
                  className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all duration-300 flex items-center gap-2 shadow-lg backdrop-blur-sm bg-opacity-90"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  Capture Photo
                </button>
                <button 
                  onClick={() => setIsCameraActive(false)} 
                  className="px-6 py-3 bg-black/50 text-white rounded-xl hover:bg-black/60 transition-all duration-300 backdrop-blur-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input & Buttons */}
      <div className="p-4 bg-white border-t">
        <div className="container mx-auto flex items-center gap-3">
          <label 
            htmlFor="image-upload" 
            className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-5 py-3 rounded-xl hover:bg-emerald-100 transition-all font-medium"
          >
            <ImageIcon size={20} />
            <span>Upload Image</span>
          </label>
          <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

          <button 
            onClick={() => setIsCameraActive(!isCameraActive)} 
            className="flex items-center gap-2 px-5 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            {isCameraActive ? 'Close Camera' : 'Open Camera'}
          </button>

          <button 
            onClick={handleSubmit} 
            disabled={loading} 
            className={`flex-1 px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all
              ${loading 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white shadow-sm'
              } font-medium`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span>Analyze Crop</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
