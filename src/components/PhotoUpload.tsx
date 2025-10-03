import React, { useState, useRef } from 'react';
import { Upload, X, Wand2, Image as ImageIcon, Loader } from 'lucide-react';

interface PhotoUploadProps {
  onArtworkCreated: (artwork: any) => void;
  onNavigate: (view: string) => void;
}

export default function PhotoUpload({ onArtworkCreated, onNavigate }: PhotoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [title, setTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [artStyle, setArtStyle] = useState('watercolor');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const artStyles = [
    { id: 'watercolor', name: 'Watercolor', description: 'Soft, flowing artistic style' },
    { id: 'oil-painting', name: 'Oil Painting', description: 'Classic, textured look' },
    { id: 'abstract', name: 'Abstract', description: 'Modern geometric patterns' },
    { id: 'sketch', name: 'Sketch', description: 'Hand-drawn pencil style' },
    { id: 'pop-art', name: 'Pop Art', description: 'Bold, vibrant colors' },
    { id: 'impressionist', name: 'Impressionist', description: 'Light and color focused' }
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile || !title.trim()) return;

    setIsProcessing(true);

    setTimeout(() => {
      const mockArtwork = {
        id: Date.now().toString(),
        user_id: 'demo-user',
        original_photo_url: previewUrl,
        ai_artwork_url: previewUrl,
        title: title,
        created_at: new Date().toISOString(),
        qr_code_url: '',
        has_hidden_content: false,
        art_style: artStyle
      };

      onArtworkCreated(mockArtwork);
      setIsProcessing(false);
      onNavigate('artwork-detail');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create AI Artwork</h1>
          <p className="text-gray-600">Upload a photo and transform it into beautiful art</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Artwork Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your artwork a name..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Upload Photo
              </label>
              {!previewUrl ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-3 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium mb-2">Click to upload photo</p>
                  <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-96 object-cover rounded-2xl"
                  />
                  <button
                    onClick={handleRemoveFile}
                    className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Choose Art Style
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {artStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setArtStyle(style.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      artStyle === style.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900 mb-1">{style.name}</div>
                    <div className="text-xs text-gray-600">{style.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!selectedFile || !title.trim() || isProcessing}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Generating Artwork...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  Generate AI Artwork
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <ImageIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Privacy First</h3>
              <p className="text-sm text-gray-600">
                Your photos are processed securely with end-to-end encryption. We never store your original images without your permission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
