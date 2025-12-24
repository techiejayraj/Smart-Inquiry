
import React, { useRef, useState, useCallback, useEffect } from 'react';

interface CameraCaptureProps {
  onCapture: (images: string[]) => void;
  onCancel: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      // Requesting highest possible resolution for better OCR
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 3840, min: 1280 }, // Prefer 4K/1080p
          height: { ideal: 2160, min: 720 },
          frameRate: { ideal: 30 }
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Check if the device has a torch/flashlight
      const track = mediaStream.getVideoTracks()[0];
      const capabilities = track.getCapabilities() as any;
      if (capabilities && capabilities.torch) {
        setHasTorch(true);
      }
    } catch (err) {
      setError("Unable to access high-quality camera. Please ensure permissions are granted.");
      console.error(err);
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const toggleTorch = async () => {
    if (stream && hasTorch) {
      const track = stream.getVideoTracks()[0];
      try {
        await track.applyConstraints({
          advanced: [{ torch: !isTorchOn } as any]
        });
        setIsTorchOn(!isTorchOn);
      } catch (e) {
        console.error("Failed to toggle torch", e);
      }
    }
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d', { alpha: false });
      
      if (context) {
        // Capture at the actual resolution of the video stream, not the CSS size
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // High quality drawing
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Using a high quality JPEG compression for the base64 output
        const base64 = canvas.toDataURL('image/jpeg', 0.95);
        setCapturedImages(prev => [...prev, base64]);

        // Haptic feedback if available
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      }
    }
  };

  const removeImage = (index: number) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // FIX: Cast to File[] to ensure the compiler recognizes File objects as Blobs
    const files = Array.from(e.target.files || []) as File[];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // reader.result is cast as string since we use readAsDataURL
        setCapturedImages(prev => [...prev, reader.result as string]);
      };
      // FIX: readAsDataURL expects a Blob; File is a subclass of Blob
      reader.readAsDataURL(file);
    });
  };

  const handleFinish = () => {
    if (capturedImages.length > 0) {
      onCapture(capturedImages);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-between p-4 pb-12 sm:pb-4 transition-all">
      {/* Header Info */}
      <div className="w-full max-w-lg flex items-center justify-between text-white mb-4 mt-2">
        <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition active:scale-90">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="text-center">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400">Professional Scan</h3>
          <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest mt-0.5">High-Resolution Active</p>
        </div>
        <div className="w-10">
          {hasTorch && (
            <button 
              onClick={toggleTorch}
              className={`p-2 rounded-full transition-all ${isTorchOn ? 'bg-yellow-400 text-slate-900 shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'bg-white/5 text-white'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isTorchOn ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Main Viewport */}
      <div className="relative w-full max-w-lg aspect-[3/4] bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/20">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center bg-slate-900">
            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="mb-8 font-bold text-slate-300 leading-relaxed">{error}</p>
            <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="w-full max-w-xs bg-indigo-600 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest cursor-pointer active:scale-95 transition shadow-xl shadow-indigo-600/20">
              Pick from Gallery
            </label>
          </div>
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            
            {/* Guide Overlay */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
               <div className="w-full aspect-[1.6/1] border-2 border-dashed border-white/30 rounded-3xl relative">
                  <div className="absolute -top-10 left-0 right-0 text-center">
                    <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">Align Document</span>
                  </div>
                  {/* Corner indicators */}
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-indigo-500 rounded-tl-lg"></div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-indigo-500 rounded-tr-lg"></div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-indigo-500 rounded-bl-lg"></div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-indigo-500 rounded-br-lg"></div>
               </div>
            </div>
            
            {/* Status indicator */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
              <div className="px-3 py-1.5 bg-slate-900/80 backdrop-blur-md rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-widest border border-white/5">
                {videoRef.current ? `${videoRef.current.videoWidth}x${videoRef.current.videoHeight}` : 'Initializing...'}
              </div>
              <div className="px-4 py-2 bg-indigo-600 text-white font-black text-[10px] rounded-full shadow-lg shadow-indigo-600/30">
                {capturedImages.length} {capturedImages.length === 1 ? 'SIDE' : 'SIDES'}
              </div>
            </div>
          </>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* Thumbnails Gallery */}
      {capturedImages.length > 0 && (
        <div className="w-full max-w-lg flex gap-4 overflow-x-auto py-4 px-2 no-scrollbar">
          {capturedImages.map((img, idx) => (
            <div key={idx} className="relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 border-indigo-500/50 group shadow-lg">
              <img src={img} alt="" className="w-full h-full object-cover" />
              <button 
                onClick={() => removeImage(idx)}
                className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-1 shadow-md transform hover:scale-110 active:scale-90 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Control Bar */}
      <div className="w-full max-w-lg flex items-center justify-between px-6 mt-4">
        <div className="flex-1 flex justify-start">
          <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" id="file-upload-2" />
          <label htmlFor="file-upload-2" className="w-14 h-14 rounded-2xl bg-white/5 text-white flex items-center justify-center hover:bg-white/10 transition cursor-pointer border border-white/5 active:scale-90">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </label>
        </div>

        <div className="flex-1 flex justify-center">
          <button 
            onClick={captureFrame}
            disabled={!!error}
            className="w-20 h-20 rounded-full border-[5px] border-white/20 flex items-center justify-center group active:scale-95 transition-all disabled:opacity-50"
          >
            <div className="w-14 h-14 rounded-full bg-white group-hover:scale-90 transition duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)]" />
          </button>
        </div>

        <div className="flex-1 flex justify-end">
          <button 
            onClick={handleFinish}
            disabled={capturedImages.length === 0}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border-2 ${
              capturedImages.length > 0 
              ? 'bg-indigo-600 text-white border-indigo-400 shadow-xl shadow-indigo-600/40 active:scale-90' 
              : 'bg-white/5 text-white/10 border-white/5 cursor-not-allowed'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
