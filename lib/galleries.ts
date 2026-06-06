import { put, list } from '@vercel/blob';
import crypto from 'crypto';

export type Gallery = {
  id: string;
  clientName: string;
  eventDate: string;
  eventType: string;
  passwordHash: string;
  photos: string[];
  coverPhoto?: string;
  createdAt: string;
};

const BLOB_PATH = 'vision-studios-galleries.json';

async function readData(): Promise<{ galleries: Gallery[] }> {
  try {
    const { blobs } = await list({ prefix: BLOB_PATH, limit: 1 });
    if (!blobs.length) return { galleries: [] };
    const res = await fetch(blobs[0].url, { cache: 'no-store' });
    return await res.json();
  } catch {
    return { galleries: [] };
  }
}

async function writeData(data: { galleries: Gallery[] }) {
  await put(BLOB_PATH, JSON.stringify(data, null, 2), {
    access: 'public',
    addRandomSuffix: false,
  });
}

export async function getGalleries(): Promise<Gallery[]> {
  return (await readData()).galleries;
}

export async function getGallery(id: string): Promise<Gallery | null> {
  const galleries = await getGalleries();
  return galleries.find((g) => g.id === id) ?? null;
}

export async function saveGallery(gallery: Gallery) {
  const data = await readData();
  const idx = data.galleries.findIndex((g) => g.id === gallery.id);
  if (idx >= 0) {
    data.galleries[idx] = gallery;
  } else {
    data.galleries.push(gallery);
  }
  await writeData(data);
}

export async function deleteGallery(id: string) {
  const data = await readData();
  data.galleries = data.galleries.filter((g) => g.id !== id);
  await writeData(data);
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + (process.env.GALLERY_SECRET ?? 'dev')).digest('hex');
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
