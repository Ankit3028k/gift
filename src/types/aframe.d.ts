// Type definitions for A-Frame
interface Window {
  AFRAME: any;
  THREE: any;
  process: {
    env: {
      NODE_ENV: 'development' | 'production';
    };
  };
}

declare namespace JSX {
  interface IntrinsicElements {
    'a-scene': any;
    'a-assets': any;
    'a-marker': any;
    'a-nft': any;
    'a-entity': any;
    'a-camera': any;
    'a-box': any;
    'a-sphere': any;
    'a-cylinder': any;
    'a-plane': any;
    'a-sky': any;
    'a-sound': any;
    'a-text': any;
    'a-torus-knot': any;
    'a-triangle': any;
    'a-light': any;
    'a-image': any;
    'a-video': any;
    'a-videosphere': any;
  }
}

// Type definitions for AR.js
declare module 'aframe' {
  const AFRAME: any;
  export default AFRAME;
}

declare module '@ar-js-org/ar.js' {
  const ARjs: any;
  export default ARjs;
}
