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
  const tapToStartBtnRef = useRef<HTMLButtonElement | null>(null);

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
    const onMarkerFound = async () => {
      videoEntity.setAttribute('visible', 'true');
      try {
        await video.play();
      } catch (e) {
        // Show tap-to-start overlay if autoplay is blocked
        if (tapToStartBtnRef.current) {
          tapToStartBtnRef.current.style.display = 'flex';
        }
      }
    };
    const onMarkerLost = () => {
      try {
        video.pause();
        video.currentTime = 0;
      } catch {}
      videoEntity.setAttribute('visible', 'false');
      if (tapToStartBtnRef.current) {
        tapToStartBtnRef.current.style.display = 'none';
      }
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

    // Add tap-to-start overlay button
    const btn = document.createElement('button');
    btn.textContent = 'Tap to start video';
    btn.style.position = 'absolute';
    btn.style.bottom = '20px';
    btn.style.left = '50%';
    btn.style.transform = 'translateX(-50%)';
    btn.style.padding = '10px 16px';
    btn.style.borderRadius = '8px';
    btn.style.background = 'rgba(0,0,0,0.6)';
    btn.style.color = '#fff';
    btn.style.display = 'none';
    btn.style.zIndex = '20';
    btn.onclick = async () => {
      try {
        await video.play();
        btn.style.display = 'none';
      } catch {}
    };
    tapToStartBtnRef.current = btn as HTMLButtonElement;
    sceneRef.current.appendChild(btn);

    // Clean up
    return () => {
      try {
        imageTarget.removeEventListener('markerFound', onMarkerFound);
        imageTarget.removeEventListener('markerLost', onMarkerLost);
      } catch {}
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
