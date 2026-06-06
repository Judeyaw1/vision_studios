import sql from './db';
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

function rowToGallery(row: Record<string, unknown>): Gallery {
  return {
    id: row.id as string,
    clientName: row.client_name as string,
    eventDate: (row.event_date as string) ?? '',
    eventType: (row.event_type as string) ?? 'Session',
    passwordHash: row.password_hash as string,
    photos: (row.photos as string[]) ?? [],
    coverPhoto: (row.cover_photo as string) ?? '',
    createdAt: (row.created_at as Date).toISOString(),
  };
}

export async function getGalleries(): Promise<Gallery[]> {
  const rows = await sql`SELECT * FROM galleries ORDER BY created_at DESC`;
  return rows.map(rowToGallery);
}

export async function getGallery(id: string): Promise<Gallery | null> {
  const rows = await sql`SELECT * FROM galleries WHERE id = ${id} LIMIT 1`;
  return rows.length ? rowToGallery(rows[0]) : null;
}

export async function saveGallery(gallery: Gallery): Promise<void> {
  await sql`
    INSERT INTO galleries (id, client_name, event_date, event_type, password_hash, photos, cover_photo)
    VALUES (
      ${gallery.id},
      ${gallery.clientName},
      ${gallery.eventDate},
      ${gallery.eventType},
      ${gallery.passwordHash},
      ${JSON.stringify(gallery.photos)},
      ${gallery.coverPhoto ?? ''}
    )
    ON CONFLICT (id) DO UPDATE SET
      client_name  = EXCLUDED.client_name,
      event_date   = EXCLUDED.event_date,
      event_type   = EXCLUDED.event_type,
      password_hash = EXCLUDED.password_hash,
      photos       = EXCLUDED.photos,
      cover_photo  = EXCLUDED.cover_photo
  `;
}

export async function deleteGallery(id: string): Promise<void> {
  await sql`DELETE FROM galleries WHERE id = ${id}`;
}

export function hashPassword(password: string): string {
  return crypto
    .createHash('sha256')
    .update(password + (process.env.GALLERY_SECRET ?? 'dev'))
    .digest('hex');
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
