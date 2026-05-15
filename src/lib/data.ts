// ================================================
// MySite — Data Store
// Ganti dengan DB (PlanetScale, Supabase, dll)
// untuk production persistent storage
// ================================================

export interface Note {
  id: string;
  title?: string;
  content: string;
  date: string;
  likes: number;
  image?: string;
}

export interface GalleryItem {
  id: string;
  title?: string;
  caption?: string;
  url: string;
  date: string;
  likes: number;
}

export interface Snippet {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  date: string;
  views: number;
  likes: number;
}

export interface MusicItem {
  id: string;
  title: string;
  artist: string;
  duration: string;
  url?: string;
  thumbnail?: string;
  addedAt: string;
}

export interface VaultItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

// ── Default seed data ─────────────────────────────

export const defaultNotes: Note[] = [
  {
    id: 'note-1',
    title: 'Hello, World.',
    content: 'This is the first entry. A quiet beginning to a quieter space.',
    date: new Date().toISOString(),
    likes: 0,
  },
];

export const defaultSnippets: Snippet[] = [
  {
    id: 'snip-1',
    title: 'Fetch with Timeout',
    description: 'Wrapper fetch dengan AbortController timeout',
    language: 'js',
    code: `async function fetchWithTimeout(url, ms = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return res.json();
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}`,
    date: new Date().toISOString(),
    views: 0,
    likes: 0,
  },
];

export const defaultGallery: GalleryItem[] = [];
export const defaultMusic: MusicItem[] = [];
export const defaultVault: VaultItem[] = [];
