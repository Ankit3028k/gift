import React, { useState } from 'react';
import Header from './components/Header';
import AuthForm from './components/AuthForm';
import Home from './components/Home';
import PhotoUpload from './components/PhotoUpload';
import Gallery from './components/Gallery';
import ArtworkDetail from './components/ArtworkDetail';
import Scanner from './components/Scanner';
import { ViewMode } from './types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [artworks, setArtworks] = useState<any[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<any>(null);

  const handleLogin = (email: string, password: string) => {
    setIsAuthenticated(true);
    setCurrentView('home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('home');
    setArtworks([]);
    setSelectedArtwork(null);
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view as ViewMode);
  };

  const handleArtworkCreated = (artwork: any) => {
    setArtworks([...artworks, artwork]);
    setSelectedArtwork(artwork);
  };

  const handleSelectArtwork = (artwork: any) => {
    setSelectedArtwork(artwork);
  };

  const handleUpdateArtwork = (updatedArtwork: any) => {
    setArtworks(artworks.map(a => a.id === updatedArtwork.id ? updatedArtwork : a));
    setSelectedArtwork(updatedArtwork);
  };

  if (!isAuthenticated) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isAuthenticated={isAuthenticated}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      {currentView === 'home' && <Home onNavigate={handleNavigate} />}

      {currentView === 'upload' && (
        <PhotoUpload
          onArtworkCreated={handleArtworkCreated}
          onNavigate={handleNavigate}
        />
      )}

      {currentView === 'gallery' && (
        <Gallery
          artworks={artworks}
          onSelectArtwork={handleSelectArtwork}
          onNavigate={handleNavigate}
        />
      )}

      {currentView === 'artwork-detail' && selectedArtwork && (
        <ArtworkDetail
          artwork={selectedArtwork}
          onUpdateArtwork={handleUpdateArtwork}
          onNavigate={handleNavigate}
        />
      )}

      {currentView === 'scan' && <Scanner artworks={artworks} />}
    </div>
  );
}

export default App;
