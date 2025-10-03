import React, { useEffect, useRef, useState } from 'react';

export default function CameraTest() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function startCamera() {
      // Check if mediaDevices is available
      if (!navigator.mediaDevices) {
        setError('Camera access is not supported in this browser. Please try a modern browser like Chrome or Firefox.');
        setIsLoading(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error('Camera error:', err);
        setError(`Error: ${err.name} - ${err.message}`);
        setIsLoading(false);
      }
    }

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Camera Test</h2>
      {isLoading ? (
        <div className="h-48 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="animate-pulse text-gray-500">Requesting camera access...</div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Failed to access camera</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
                <div className="mt-2">
                  <p className="font-medium">Troubleshooting steps:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Check if your camera is connected and working</li>
                    <li>Make sure no other app is using the camera</li>
                    <li>Check browser permissions (click the lock icon in the address bar)</li>
                    <li>Try in a different browser (Chrome/Firefox recommended)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className="w-full h-auto max-h-[60vh] mx-auto"
            />
          </div>
          <div className="flex items-center justify-center text-green-600 text-sm">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Camera is working!
          </div>
        </div>
      )}
    </div>
  );
}
