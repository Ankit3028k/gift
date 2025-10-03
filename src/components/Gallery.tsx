import { Search, Image as ImageIcon, Calendar, Eye } from 'lucide-react';
import { useState } from 'react';

interface GalleryProps {
  artworks: any[];
  onSelectArtwork: (artwork: any) => void;
  onNavigate: (view: string) => void;
}

export default function Gallery({ artworks, onSelectArtwork, onNavigate }: GalleryProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArtworks = artworks.filter(artwork =>
    artwork.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleArtworkClick = (artwork: any) => {
    onSelectArtwork(artwork);
    onNavigate('artwork-detail');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Gallery</h1>
          <p className="text-gray-600">View and manage your AI-generated artworks</p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search artworks..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {filteredArtworks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Artworks Yet</h3>
            <p className="text-gray-600 mb-6">Create your first AI artwork to get started</p>
            <button
              onClick={() => onNavigate('upload')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Create Artwork
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtworks.map((artwork) => (
              <div
                key={artwork.id}
                onClick={() => handleArtworkClick(artwork)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 hover:shadow-xl transition-all"
              >
                <div className="relative h-64 bg-gray-200">
                  <img
                    src={artwork.ai_artwork_url || artwork.original_photo_url}
                    alt={artwork.title}
                    className="w-full h-full object-cover"
                  />
                  {artwork.has_hidden_content && (
                    <div className="absolute top-3 right-3 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>Hidden Content</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{artwork.title}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(artwork.created_at).toLocaleDateString()}</span>
                  </div>
                  {artwork.art_style && (
                    <div className="mt-2">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {artwork.art_style}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
