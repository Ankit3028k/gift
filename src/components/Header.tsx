import React, { useState } from 'react';
import { Image, Menu, X } from 'lucide-react';

interface HeaderProps {
  isAuthenticated: boolean;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export default function Header({ isAuthenticated, onNavigate, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Image className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ArtFrame</span>
          </div>

          {isAuthenticated && (
            <>
              <nav className="hidden md:flex space-x-8">
                <button
                  onClick={() => onNavigate('home')}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={() => onNavigate('upload')}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Create Artwork
                </button>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  My Gallery
                </button>
                <button
                  onClick={() => onNavigate('scan')}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Scan Frame
                </button>
              </nav>

              <div className="hidden md:block">
                <button
                  onClick={onLogout}
                  className="text-gray-700 hover:text-red-600 font-medium transition-colors"
                >
                  Logout
                </button>
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </>
          )}
        </div>

        {mobileMenuOpen && isAuthenticated && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  onNavigate('home');
                  setMobileMenuOpen(false);
                }}
                className="text-left text-gray-700 hover:text-blue-600 font-medium"
              >
                Home
              </button>
              <button
                onClick={() => {
                  onNavigate('upload');
                  setMobileMenuOpen(false);
                }}
                className="text-left text-gray-700 hover:text-blue-600 font-medium"
              >
                Create Artwork
              </button>
              <button
                onClick={() => {
                  onNavigate('gallery');
                  setMobileMenuOpen(false);
                }}
                className="text-left text-gray-700 hover:text-blue-600 font-medium"
              >
                My Gallery
              </button>
              <button
                onClick={() => {
                  onNavigate('scan');
                  setMobileMenuOpen(false);
                }}
                className="text-left text-gray-700 hover:text-blue-600 font-medium"
              >
                Scan Frame
              </button>
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-left text-red-600 hover:text-red-700 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
