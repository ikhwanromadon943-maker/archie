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


export const defaultGallery: GalleryItem[] = [];
export const defaultMusic: MusicItem[] = [];
export const defaultVault: VaultItem[] = [];
