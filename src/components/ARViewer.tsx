import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface ARViewerProps {
  imageUrl: string;
  videoUrl: string;
  onClose: () => void;
}

export default function ARViewer({ imageUrl, videoUrl, onClose }: ARViewerProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const videoElRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    // Clean up any existing scene
    while (sceneRef.current.firstChild) {
      sceneRef.current.removeChild(sceneRef.current.firstChild);
    }

    // Create a new scene
    const scene = document.createElement('a-scene');
    scene.setAttribute('vr-mode-ui', 'enabled: false');
    scene.setAttribute('renderer', 'logarithmicDepthBuffer: true');
    scene.setAttribute('embedded', '');
    scene.setAttribute('arjs', 'trackingMethod: best; sourceType: webcam; debugUIEnabled: false;');

    // Assets container
    const assets = document.createElement('a-assets');
    const video = document.createElement('video');
    video.setAttribute('id', 'arVideo');
    video.setAttribute('src', videoUrl);
    video.setAttribute('loop', 'true');
    video.setAttribute('crossorigin', 'anonymous');
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('preload', 'auto');
    // Muted is required for autoplay on mobile
    video.muted = true;
    videoElRef.current = video;
    assets.appendChild(video);
    scene.appendChild(assets);

    // Add camera
    const camera = document.createElement('a-entity');
    camera.setAttribute('camera', '');
    scene.appendChild(camera);

    // Add image target
    const imageTarget = document.createElement('a-nft');
    imageTarget.setAttribute('type', 'nft');
    // NOTE: AR.js NFT expects the base URL to the descriptor files (.fset/.iset/.mind) WITHOUT extension.
    // If you pass an actual .jpg here, it will not work. Provide the descriptor base path.
    imageTarget.setAttribute('url', imageUrl.replace(/\.(jpg|jpeg|png|webp)$/i, ''));
    imageTarget.setAttribute('smooth', 'true');
    imageTarget.setAttribute('smoothCount', '10');
    imageTarget.setAttribute('smoothTolerance', '0.01');
    imageTarget.setAttribute('smoothThreshold', '5');

    // Add video entity that will be shown when image is detected
    const videoEntity = document.createElement('a-video');
    // bind to asset video for reliable control
    videoEntity.setAttribute('src', '#arVideo');
    videoEntity.setAttribute('width', '1.6');
    videoEntity.setAttribute('height', '0.9');
    videoEntity.setAttribute('position', '0 0 0');
    videoEntity.setAttribute('rotation', '-90 0 0');
    videoEntity.setAttribute('autoplay', 'false');
    videoEntity.setAttribute('loop', 'true');
    videoEntity.setAttribute('material', 'transparent: true');
    videoEntity.setAttribute('visible', 'false');

    // Marker visibility events: play when found, pause & hide when lost
    const onMarkerFound = () => {
      try {
        video.play().catch(() => {/* ignore autoplay blocking if any */});
      } catch {}
      videoEntity.setAttribute('visible', 'true');
    };
    const onMarkerLost = () => {
      try {
        video.pause();
        video.currentTime = 0;
      } catch {}
      videoEntity.setAttribute('visible', 'false');
    };
    imageTarget.addEventListener('markerFound', onMarkerFound);
    imageTarget.addEventListener('markerLost', onMarkerLost);

    imageTarget.appendChild(videoEntity);
    scene.appendChild(imageTarget);

    // Add loading screen
    const loading = document.createElement('div');
    loading.innerHTML = 'Loading...';
    loading.style.position = 'absolute';
    loading.style.top = '50%';
    loading.style.left = '50%';
    loading.style.transform = 'translate(-50%, -50%)';
    loading.style.color = 'white';
    loading.style.fontSize = '24px';
    scene.appendChild(loading);

    // Add scene to DOM
    sceneRef.current.appendChild(scene);

    // Clean up
    return () => {
      try {
        video.pause();
        video.src = '';
      } catch {}
      if (sceneRef.current) {
        while (sceneRef.current.firstChild) {
          sceneRef.current.removeChild(sceneRef.current.firstChild);
        }
      }
    };
  }, [imageUrl, videoUrl]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="relative flex-1" ref={sceneRef}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-all"
          aria-label="Close AR viewer"
        >
          <X size={24} />
        </button>
      </div>
      <div className="p-4 text-center text-white bg-black bg-opacity-50">
        <p>Point your camera at the artwork to view the video</p>
      </div>
    </div>
  );
}
