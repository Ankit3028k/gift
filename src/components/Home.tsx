import React from 'react';
import { Upload, QrCode, Shield, Sparkles, Image as ImageIcon, Video } from 'lucide-react';

interface HomeProps {
  onNavigate: (view: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const features = [
    {
      icon: Sparkles,
      title: 'AI Art Generation',
      description: 'Transform your photos into stunning artwork with advanced AI technology',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Video,
      title: 'Hidden Messages',
      description: 'Embed secret videos or messages that only reveal when scanned',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: QrCode,
      title: 'QR Frame Technology',
      description: 'Each artwork comes with a unique QR code for the physical frame',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: Shield,
      title: '100% Private',
      description: 'End-to-end encryption ensures your memories stay secure',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-teal-500 rounded-3xl mb-6 shadow-2xl">
            <ImageIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Memories Transformed
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Create AI-powered artwork from your photos with hidden videos and messages that reveal only through scanning
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('upload')}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all"
            >
              <Upload className="inline-block w-5 h-5 mr-2" />
              Create Your First Artwork
            </button>
            <button
              onClick={() => onNavigate('scan')}
              className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transform hover:scale-105 transition-all"
            >
              <QrCode className="inline-block w-5 h-5 mr-2" />
              Scan a Frame
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-12 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Upload Your Photo</h4>
                    <p className="text-sm text-gray-600">Choose a special memory you want to transform</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">AI Creates Artwork</h4>
                    <p className="text-sm text-gray-600">Our AI transforms it into beautiful art</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Add Hidden Content</h4>
                    <p className="text-sm text-gray-600">Embed a secret video or message</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Scan & Reveal</h4>
                    <p className="text-sm text-gray-600">Use your phone to unlock the hidden surprise</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-teal-100 p-12 flex items-center justify-center">
              <div className="relative">
                <div className="w-64 h-64 bg-white rounded-2xl shadow-2xl transform rotate-3 absolute inset-0"></div>
                <div className="w-64 h-64 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl shadow-2xl relative flex items-center justify-center">
                  <ImageIcon className="w-24 h-24 text-white opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
