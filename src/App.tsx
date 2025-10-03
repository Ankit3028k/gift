import React, { useState } from 'react';
import Header from './components/Header';
import AuthForm from './components/AuthForm';
import Home from './components/Home';
import PhotoUpload from './components/PhotoUpload';
import Gallery from './components/Gallery';
import ArtworkDetail from './components/ArtworkDetail';
import Scanner from './components/Scanner';
import { ViewMode } from './types';
import { useEffect } from 'react';
import { api, Artwork as ApiArtwork, ArtworkPayload } from './api/client';

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

  // Load artworks on mount (after login as well)
  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      try {
        const list = await api.listArtworks();
        // normalize _id -> id for UI compatibility
        const normalized = list.map((a: ApiArtwork) => ({ ...a, id: a._id }));
        setArtworks(normalized);
      } catch (e) {
        console.error('Failed to load artworks', e);
      }
    })();
  }, [isAuthenticated]);

  const handleArtworkCreated = async (artwork: ArtworkPayload | any) => {
    try {
      // If caller already posted, accept; else create via API
      if ((artwork as any)._id) {
        const withId = { ...(artwork as any), id: (artwork as any)._id };
        setArtworks(prev => [...prev, withId]);
        setSelectedArtwork(withId);
      } else {
        const created = await api.createArtwork(artwork as ArtworkPayload);
        const withId = { ...created, id: created._id } as any;
        setArtworks(prev => [...prev, withId]);
        setSelectedArtwork(withId);
      }
    } catch (e) {
      console.error('Failed to create artwork', e);
    }
  };

  const handleSelectArtwork = (artwork: any) => {
    setSelectedArtwork(artwork);
  };

  const handleUpdateArtwork = async (updatedArtwork: any) => {
    try {
      const id = updatedArtwork._id || updatedArtwork.id;
      if (!id) return;
      const saved = await api.updateArtwork(id, updatedArtwork);
      const withId = { ...saved, id: saved._id } as any;
      setArtworks(prev => prev.map(a => a.id === withId.id ? withId : a));
      setSelectedArtwork(withId);
    } catch (e) {
      console.error('Failed to update artwork', e);
    }
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
