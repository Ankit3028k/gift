// Frontend environment config for API base URL
// Priority: VITE_API_BASE (from .env.<mode>) -> defaults by mode

export const MODE = import.meta.env.MODE;
export const DEV = MODE === 'development';

const DEFAULTS = {
  development: 'http://localhost:4000',
  production: 'https://gift-ea0k.onrender.com',
};

export const API_BASE: string = (
  import.meta.env.VITE_API_BASE as string
) || (DEV ? DEFAULTS.development : DEFAULTS.production);

export function apiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${p}`;
}
