import { apiUrl } from '../config/env';

export interface ArtworkPayload {
  title: string;
  image_url?: string;
  original_photo_url?: string;
  has_hidden_content?: boolean;
  hidden_content?: {
    type?: 'message' | 'video';
    message?: string;
    video_name?: string;
  } | null;
  ar_content?: string;
  marker_descriptor_base?: string;
}

export interface Artwork extends ArtworkPayload {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}

async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<T>;
}

export const api = {
  async listArtworks(): Promise<Artwork[]> {
    return http<Artwork[]>(apiUrl('/api/artworks'));
  },
  async getArtwork(id: string): Promise<Artwork> {
    return http<Artwork>(apiUrl(`/api/artworks/${id}`));
  },
  async createArtwork(payload: ArtworkPayload): Promise<Artwork> {
    return http<Artwork>(apiUrl('/api/artworks'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },
  async updateArtwork(id: string, payload: Partial<ArtworkPayload>): Promise<Artwork> {
    return http<Artwork>(apiUrl(`/api/artworks/${id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },
  async deleteArtwork(id: string): Promise<void> {
    await fetch(apiUrl(`/api/artworks/${id}`), { method: 'DELETE' });
  },
};
