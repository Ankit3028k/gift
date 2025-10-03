export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Artwork {
  id: string;
  user_id: string;
  original_photo_url: string;
  ai_artwork_url: string;
  title: string;
  created_at: string;
  qr_code_url: string;
  has_hidden_content: boolean;
}

export interface HiddenContent {
  id: string;
  artwork_id: string;
  content_type: 'video' | 'message' | 'audio';
  encrypted_url?: string;
  encrypted_message?: string;
  created_at: string;
}

export type ViewMode = 'home' | 'upload' | 'gallery' | 'scan' | 'artwork-detail';
