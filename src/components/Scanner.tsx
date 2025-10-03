import React, { useState,Suspense, useEffect, useRef } from 'react';
import { QrCode, Camera, Unlock, Video, MessageSquare, AlertCircle, X, Upload, Eye } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

// Import CameraTest component
import CameraTest from './CameraTest';
// import { Suspense } from 'react';
import ARViewer from './ARViewer';

interface ScannerProps {
  artworks: any[];
}
export default function Scanner({ artworks }: ScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedContent, setScannedContent] = useState<any>(null);
  const [error, setError] = useState('');
  const [scanMethod, setScanMethod] = useState<'camera' | 'upload'>('camera');
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [arViewerOpen, setArViewerOpen] = useState(false);
  const [currentArtwork, setCurrentArtwork] = useState<any>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const handleStartCameraScan = async () => {
    setIsScanning(true);
    setError('');

    try {
      // First check if we can access the camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      // Stop the stream immediately as we just needed to check permissions
      stream.getTracks().forEach(track => track.stop());
      
      // Now initialize the scanner
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Don't show errors for normal operation
          if (!errorMessage.includes('NotReadableError') && 
              !errorMessage.includes('NotAllowedError') &&
              !errorMessage.includes('NotFoundError')) {
            console.log('Scanning...', errorMessage);
          }
        }
      );

      setCameraPermission('granted');
    } catch (err: any) {
      console.error('Camera error:', err);
      
      let errorMessage = 'Failed to access camera. ';
      
      if (err.name === 'NotAllowedError' || err.message?.includes('Permission')) {
        setCameraPermission('denied');
        errorMessage = 'Camera permission denied. ';
      } else if (err.name === 'NotFoundError' || err.message?.includes('No video input devices')) {
        errorMessage = 'No camera found. ';
      } else if (err.name === 'NotReadableError' || err.message?.includes('Could not start video source')) {
        errorMessage = 'Camera is already in use. ';
      }
      
      errorMessage += 'Please try uploading an image instead or check your camera settings.';
      setError(errorMessage);
      setIsScanning(false);
    }
  };

  const handleStopScan = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      await scannerRef.current.stop();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleFileUpload = async (file: File) => {
    setError('');
    try {
      const scanner = new Html5Qrcode('qr-reader-upload');
      const decodedText = await scanner.scanFile(file, false);
      handleScanSuccess(decodedText);
    } catch (err) {
      setError('No QR code found in the image. Please try another image.');
    }
  };

  const handleScanSuccess = async (decodedText: string) => {
    try {
      const data = JSON.parse(decodedText);
      const artwork = artworks.find(a => a.id === data.artworkId);

      if (artwork && (artwork.has_hidden_content || artwork.ar_content)) {
        setScannedContent(artwork);
        setCurrentArtwork(artwork);
        if (scannerRef.current && scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        setIsScanning(false);
      } else {
        setError('No hidden content found for this artwork.');
      }
    } catch (err) {
      setError('Invalid QR code. Please scan a valid artwork QR code.');
    }
  };

  const handleReset = () => {
    setScannedContent(null);
    setCurrentArtwork(null);
    setArViewerOpen(false);
    setError('');
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().catch(console.error);
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const openARViewer = () => {
    setArViewerOpen(true);
  };

  const closeARViewer = () => {
    setArViewerOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-12">
      {arViewerOpen && currentArtwork?.ar_content && (
        <Suspense fallback={<div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center text-white text-lg">
          Loading AR Viewer...
        </div>}>
          <ARViewer
            imageUrl={currentArtwork.marker_descriptor_base || currentArtwork.image_url || currentArtwork.original_photo_url}
            videoUrl={currentArtwork.ar_content}
            onClose={closeARViewer}
          />
        </Suspense>
      )}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Scan Artwork</h1>
          <p className="text-gray-600">Use your camera or upload an image to reveal hidden content</p>
        </div>

        {!scannedContent ? (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {!isScanning ? (
              <div>
                <div className="text-center py-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <QrCode className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Scan</h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Scan the QR code from your artwork to reveal hidden messages and videos
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 max-w-xl mx-auto mb-6">
                    <button
                      onClick={() => {
                        setScanMethod('camera');
                        handleStartCameraScan();
                      }}
                      className="p-6 border-2 border-blue-500 rounded-xl hover:bg-blue-50 transition-all"
                    >
                      <Camera className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-1">Use Camera</h3>
                      <p className="text-sm text-gray-600">Scan QR code live</p>
                    </button>

                    <button
                      onClick={() => {
                        setScanMethod('upload');
                        fileInputRef.current?.click();
                      }}
                      className="p-6 border-2 border-teal-500 rounded-xl hover:bg-teal-50 transition-all"
                    >
                      <Upload className="w-8 h-8 text-teal-600 mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-1">Upload Image</h3>
                      <p className="text-sm text-gray-600">Select QR image</p>
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    className="hidden"
                  />

                  {error && (
                    <div className="space-y-4 w-full">
                      <div className="bg-red-50 border-l-4 border-red-400 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-red-400" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Camera Access Required</h3>
                            <p className="text-sm text-red-700 mt-1">{error}</p>
                            {cameraPermission === 'denied' && (
                              <div className="mt-2 text-xs text-red-600">
                                <p>To enable camera access:</p>
                                <ol className="list-decimal list-inside mt-1 space-y-1">
                                  <li>Click the camera icon in your browser's address bar</li>
                                  <li>Select "Allow" for camera access</li>
                                  <li>Refresh the page and try again</li>
                                </ol>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <CameraTest />
                      </div>
                      
                      <div className="flex justify-center">
                        <button
                          onClick={() => {
                            setError('');
                            setScanMethod('upload');
                            fileInputRef.current?.click();
                          }}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Upload className="-ml-1 mr-2 h-4 w-4" />
                          Upload Image Instead
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="hidden">
                  <div id="qr-reader-upload" style={{ width: '0px', height: '0px' }}></div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <QrCode className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">Get QR Code</h3>
                      <p className="text-sm text-gray-600">Download from artwork details</p>
                    </div>
                    <div>
                      <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Camera className="w-6 h-6 text-teal-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">Scan or Upload</h3>
                      <p className="text-sm text-gray-600">Use camera or upload image</p>
                    </div>
                    <div>
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Unlock className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">Reveal Content</h3>
                      <p className="text-sm text-gray-600">View hidden message or video</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Scanning...</h2>
                  <button
                    onClick={handleStopScan}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div id="qr-reader" className="rounded-xl overflow-hidden"></div>

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 text-center">
                    Position the QR code within the scanning area
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4">
                <div className="flex items-center space-x-3">
                  <Unlock className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-bold text-white">Hidden Content Unlocked!</h2>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <img
                    src={scannedContent.ai_artwork_url || scannedContent.original_photo_url}
                    alt={scannedContent.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">{scannedContent.title}</h3>

                {scannedContent.hidden_content?.type === 'message' ? (
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Secret Message</h4>
                        <p className="text-sm text-gray-600">Revealed just for you</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-gray-800 leading-relaxed">
                        {scannedContent.hidden_content?.message}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Video className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Secret Video</h4>
                        <p className="text-sm text-gray-600">Revealed just for you</p>
                      </div>
                    </div>
                    <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
                      <Video className="w-16 h-16 text-gray-600" />
                    </div>
                    <p className="text-sm text-gray-600 mt-3">
                      {scannedContent.hidden_content?.video_name}
                    </p>
                  </div>
                )}

                {scannedContent.ar_content && (
                  <button
                    onClick={openARViewer}
                    className="w-full mb-4 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded-lg hover:opacity-90 transition-all flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-5 h-5" />
                    <span>View in AR</span>
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Scan Another QR Code
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <Unlock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Privacy Protected</h3>
                  <p className="text-sm text-gray-600">
                    This content was decrypted securely on your device. No data was sent to external servers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
