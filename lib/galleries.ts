import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import crypto from 'crypto';

export type Gallery = {
  id: string;
  clientName: string;
  eventDate: string;
  eventType: string;
  passwordHash: string;
  photos: string[];       // Vercel Blob URLs
  coverPhoto?: string;
  createdAt: string;
};

const DATA_PATH = path.join(process.cwd(), 'data', 'galleries.json');

export function getGalleries(): Gallery[] {
  const raw = readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw).galleries as Gallery[];
}

export function getGallery(id: string): Gallery | null {
  return getGalleries().find((g) => g.id === id) ?? null;
}

export function saveGallery(gallery: Gallery) {
  const raw = readFileSync(DATA_PATH, 'utf-8');
  const data = JSON.parse(raw);
  const idx = data.galleries.findIndex((g: Gallery) => g.id === gallery.id);
  if (idx >= 0) {
    data.galleries[idx] = gallery;
  } else {
    data.galleries.push(gallery);
  }
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

export function deleteGallery(id: string) {
  const raw = readFileSync(DATA_PATH, 'utf-8');
  const data = JSON.parse(raw);
  data.galleries = data.galleries.filter((g: Gallery) => g.id !== id);
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + process.env.GALLERY_SECRET).digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export function makeSessionToken(galleryId: string): string {
  return crypto
    .createHmac('sha256', process.env.GALLERY_SECRET ?? 'dev-secret')
    .update(galleryId)
    .digest('hex');
}
