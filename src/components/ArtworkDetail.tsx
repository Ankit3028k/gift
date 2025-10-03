import { Download, QrCode, Video, MessageSquare, Upload, Lock, X, CheckCircle } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import QRCodeLib from 'qrcode';

interface ArtworkDetailProps {
  artwork: any;
  onUpdateArtwork: (artwork: any) => void;
  onNavigate: (view: string) => void;
}

export default function ArtworkDetail({ artwork, onUpdateArtwork, onNavigate }: ArtworkDetailProps) {
  const [showHiddenContentForm, setShowHiddenContentForm] = useState(false);
  const [contentType, setContentType] = useState<'video' | 'message'>('message');
  const [message, setMessage] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const videoInputRef = useRef<HTMLInputElement>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleAddHiddenContent = () => {
    const updatedArtwork = {
      ...artwork,
      has_hidden_content: true,
      hidden_content: {
        type: contentType,
        message: contentType === 'message' ? message : null,
        video_name: contentType === 'video' ? videoFile?.name : null
      }
    };
    onUpdateArtwork(updatedArtwork);
    setShowHiddenContentForm(false);
    setMessage('');
    setVideoFile(null);
  };

  const handleGenerateQR = async () => {
    try {
      const qrData = JSON.stringify({
        artworkId: artwork.id,
        title: artwork.title,
        hasHiddenContent: artwork.has_hidden_content
      });

      const qrUrl = await QRCodeLib.toDataURL(qrData, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      setQrCodeUrl(qrUrl);
      setQrGenerated(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleDownloadQR = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement('a');
    link.download = `${artwork.title}-qr-code.png`;
    link.href = qrCodeUrl;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate('gallery')}
          className="mb-6 text-gray-600 hover:text-blue-600 font-medium transition-colors"
        >
          ← Back to Gallery
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <img
                src={artwork.ai_artwork_url || artwork.original_photo_url}
                alt={artwork.title}
                className="w-full h-96 object-cover"
              />
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{artwork.title}</h1>
                <p className="text-gray-600 mb-4">
                  Created {new Date(artwork.created_at).toLocaleDateString()}
                </p>
                {artwork.art_style && (
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {artwork.art_style}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
                  <Download className="w-5 h-5" />
                  <span>Download Artwork</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                  <Download className="w-5 h-5" />
                  <span>Download Original Photo</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Hidden Content</h2>
                {artwork.has_hidden_content && (
                  <span className="flex items-center text-green-600 text-sm font-semibold">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Added
                  </span>
                )}
              </div>

              {!artwork.has_hidden_content && !showHiddenContentForm ? (
                <div className="text-center py-8">
                  <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-6">Add a secret video or message to this artwork</p>
                  <button
                    onClick={() => setShowHiddenContentForm(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
                  >
                    <Upload className="inline-block w-5 h-5 mr-2" />
                    Add Hidden Content
                  </button>
                </div>
              ) : artwork.has_hidden_content ? (
                <div className="space-y-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      {artwork.hidden_content?.type === 'video' ? (
                        <Video className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <MessageSquare className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">
                          {artwork.hidden_content?.type === 'video' ? 'Video Message' : 'Text Message'}
                        </p>
                        {artwork.hidden_content?.type === 'video' ? (
                          <p className="text-sm text-gray-600">{artwork.hidden_content?.video_name}</p>
                        ) : (
                          <p className="text-sm text-gray-600">{artwork.hidden_content?.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">
                        This content is encrypted and can only be revealed by scanning the QR code on the physical frame.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Content Type</h3>
                    <button
                      onClick={() => setShowHiddenContentForm(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setContentType('message')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        contentType === 'message'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <MessageSquare className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                      <div className="text-sm font-semibold">Message</div>
                    </button>
                    <button
                      onClick={() => setContentType('video')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        contentType === 'video'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <Video className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                      <div className="text-sm font-semibold">Video</div>
                    </button>
                  </div>

                  {contentType === 'message' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Secret Message
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        placeholder="Write a heartfelt message..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Video
                      </label>
                      <div
                        onClick={() => videoInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all"
                      >
                        {videoFile ? (
                          <div>
                            <Video className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-700 font-medium">{videoFile.name}</p>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Click to upload video</p>
                          </>
                        )}
                        <input
                          ref={videoInputRef}
                          type="file"
                          accept="video/*"
                          onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleAddHiddenContent}
                    disabled={contentType === 'message' ? !message.trim() : !videoFile}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Save Hidden Content
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">QR Code for Frame</h2>
              {!qrGenerated ? (
                <div className="text-center py-8">
                  <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-6">Generate a QR code for your physical frame</p>
                  <button
                    onClick={handleGenerateQR}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
                  >
                    <QrCode className="inline-block w-5 h-5 mr-2" />
                    Generate QR Code
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-8 flex items-center justify-center">
                    {qrCodeUrl ? (
                      <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" />
                    ) : (
                      <div className="w-48 h-48 bg-gray-900 rounded-lg flex items-center justify-center">
                        <QrCode className="w-32 h-32 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      Print this QR code and attach it to your physical frame. Scanning the artwork photo will reveal the hidden content.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadQR}
                    className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Download className="inline-block w-5 h-5 mr-2" />
                    Download QR Code
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
