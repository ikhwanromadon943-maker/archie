// ================================================
// MySite — Data Store
// Menggunakan Supabase untuk persistent storage
// ================================================

import { supabase } from './supabase';

export interface Note {
  id: string;
  title?: string;
  content: string;
  created_at: string;
  likes: number;
  image_url?: string;
}

export interface GalleryItem {
  id: string;
  title?: string;
  caption?: string;
  url: string;
  created_at: string;
  likes: number;
}

export interface Snippet {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  created_at: string;
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
  added_at: string;
}

export interface VaultItem {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

// ── Default seed data (fallback jika database kosong) ──

export const defaultNotes: Partial<Note>[] = [
  {
    id: 'note-1',
    title: 'Hello, World.',
    content: 'This is the first entry. A quiet beginning to a quieter space.',
    created_at: new Date().toISOString(),
    likes: 0,
  },
];

export const defaultSnippets: Partial<Snippet>[] = [
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
    created_at: new Date().toISOString(),
    views: 0,
    likes: 0,
  },
];

export const defaultGallery: Partial<GalleryItem>[] = [];
export const defaultMusic: Partial<MusicItem>[] = [];
export const defaultVault: Partial<VaultItem>[] = [];

// ── Helper functions untuk seeding (opsional) ──

export async function seedIfEmpty() {
  try {
    // Check if notes table is empty
    const { count: notesCount, error: notesError } = await supabase
      .from('notes')
      .select('*', { count: 'exact', head: true });
    
    if (!notesError && notesCount === 0) {
      console.log('Seeding notes...');
      for (const note of defaultNotes) {
        await supabase.from('notes').insert(note);
      }
    }

    // Check if snippets table is empty
    const { count: snippetsCount, error: snippetsError } = await supabase
      .from('snippets')
      .select('*', { count: 'exact', head: true });
    
    if (!snippetsError && snippetsCount === 0) {
      console.log('Seeding snippets...');
      for (const snippet of defaultSnippets) {
        await supabase.from('snippets').insert(snippet);
      }
    }
  } catch (err) {
    console.error('Failed to seed database:', err);
  }
}

// ── CRUD Operations untuk Notes ──

export async function getNotes() {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Note[];
}

export async function getNote(id: string) {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Note;
}

export async function createNote(note: Omit<Note, 'id' | 'created_at' | 'likes'>) {
  const { data, error } = await supabase
    .from('notes')
    .insert({
      ...note,
      likes: 0,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as Note;
}

export async function updateNote(id: string, updates: Partial<Note>) {
  const { data, error } = await supabase
    .from('notes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Note;
}

export async function deleteNote(id: string) {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

export async function incrementNoteLikes(id: string) {
  const { error } = await supabase.rpc('increment_likes', {
    table_name: 'notes',
    row_id: id,
  });
  if (error) throw error;
}

// ── CRUD Operations untuk Gallery ──

export async function getGalleryItems() {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as GalleryItem[];
}

export async function createGalleryItem(item: Omit<GalleryItem, 'id' | 'created_at' | 'likes'>) {
  const { data, error } = await supabase
    .from('gallery')
    .insert({
      ...item,
      likes: 0,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as GalleryItem;
}

export async function deleteGalleryItem(id: string) {
  const { error } = await supabase
    .from('gallery')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

// ── CRUD Operations untuk Snippets ──

export async function getSnippets() {
  const { data, error } = await supabase
    .from('snippets')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Snippet[];
}

export async function createSnippet(snippet: Omit<Snippet, 'id' | 'created_at' | 'views' | 'likes'>) {
  const { data, error } = await supabase
    .from('snippets')
    .insert({
      ...snippet,
      views: 0,
      likes: 0,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as Snippet;
}

export async function deleteSnippet(id: string) {
  const { error } = await supabase
    .from('snippets')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

export async function incrementSnippetViews(id: string) {
  const { error } = await supabase.rpc('increment_views', { row_id: id });
  if (error) throw error;
}

// ── CRUD Operations untuk Music ──

export async function getMusicItems() {
  const { data, error } = await supabase
    .from('music')
    .select('*')
    .order('added_at', { ascending: false });
  
  if (error) throw error;
  return data as MusicItem[];
}

export async function createMusicItem(item: Omit<MusicItem, 'id' | 'added_at'>) {
  const { data, error } = await supabase
    .from('music')
    .insert({
      ...item,
      added_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as MusicItem;
}

export async function deleteMusicItem(id: string) {
  const { error } = await supabase
    .from('music')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

// ── CRUD Operations untuk Vault ──

export async function getVaultItems() {
  const { data, error } = await supabase
    .from('vault')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as VaultItem[];
}

export async function createVaultItem(item: Omit<VaultItem, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('vault')
    .insert({
      ...item,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as VaultItem;
}

export async function deleteVaultItem(id: string) {
  const { error } = await supabase
    .from('vault')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

// ── Settings ──

export async function getAdminPassphrase(): Promise<string> {
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'admin_pass')
    .single();
  
  if (error) {
    console.error('Failed to fetch passphrase:', error);
    return 'mysite2025';
  }
  return data?.value || 'mysite2025';
}

export async function updateAdminPassphrase(newPassphrase: string): Promise<void> {
  const { error } = await supabase
    .from('settings')
    .update({ 
      value: newPassphrase,
      updated_at: new Date().toISOString()
    })
    .eq('key', 'admin_pass');
  
  if (error) throw error;
}