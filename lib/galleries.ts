import sql from './db';

export type Gallery = {
  id: string;
  accessCode: string;
  clientName: string;
  eventDate: string;
  eventType: string;
  passwordHash: string;
  photos: string[];
  photoHashes: string[];
  coverPhoto?: string;
  // Focal point of the cover as percentages of the image; null means the default crop.
  coverFocus?: { x: number; y: number } | null;
  createdAt: string;
};

function rowToGallery(row: Record<string, unknown>): Gallery {
  return {
    id: row.id as string,
    accessCode: (row.access_code as string) ?? '',
    clientName: row.client_name as string,
    eventDate: (row.event_date as string) ?? '',
    eventType: (row.event_type as string) ?? 'Session',
    passwordHash: row.password_hash as string,
    photos: (row.photos as string[]) ?? [],
    photoHashes: (row.photo_hashes as string[]) ?? [],
    coverPhoto: (row.cover_photo as string) ?? '',
    coverFocus:
      row.cover_focus_x != null && row.cover_focus_y != null
        ? { x: row.cover_focus_x as number, y: row.cover_focus_y as number }
        : null,
    createdAt: (row.created_at as Date).toISOString(),
  };
}

export async function getGalleries(): Promise<Gallery[]> {
  const rows = await sql`SELECT * FROM galleries ORDER BY created_at DESC`;
  return rows.map(rowToGallery);
}

export async function getGallery(id: string): Promise<Gallery | null> {
  // Match by access_code (case-insensitive) first, then by internal id
  const rows = await sql`
    SELECT * FROM galleries
    WHERE LOWER(access_code) = LOWER(${id}) OR id = ${id}
    LIMIT 1
  `;
  return rows.length ? rowToGallery(rows[0]) : null;
}

export async function saveGallery(gallery: Gallery): Promise<void> {
  await sql`
    INSERT INTO galleries (id, access_code, client_name, event_date, event_type, password_hash, photos, photo_hashes, cover_photo)
    VALUES (
      ${gallery.id},
      ${gallery.accessCode || null},
      ${gallery.clientName},
      ${gallery.eventDate},
      ${gallery.eventType},
      ${gallery.passwordHash},
      ${JSON.stringify(gallery.photos)},
      ${JSON.stringify(gallery.photoHashes ?? [])},
      ${gallery.coverPhoto ?? ''}
    )
    ON CONFLICT (id) DO UPDATE SET
      access_code   = EXCLUDED.access_code,
      client_name   = EXCLUDED.client_name,
      event_date    = EXCLUDED.event_date,
      event_type    = EXCLUDED.event_type,
      password_hash = EXCLUDED.password_hash,
      photos        = EXCLUDED.photos,
      photo_hashes  = EXCLUDED.photo_hashes,
      cover_photo   = EXCLUDED.cover_photo
  `;
}

// A targeted update rather than saveGallery, so a rename can't clobber photos
// that an in-flight upload is writing to the same row.
export async function updateGalleryDetails(
  id: string,
  fields: { clientName: string; eventDate: string; eventType: string; accessCode: string },
): Promise<Gallery | null> {
  const rows = await sql`
    UPDATE galleries
    SET client_name = ${fields.clientName},
        event_date  = ${fields.eventDate},
        event_type  = ${fields.eventType},
        access_code = ${fields.accessCode || null}
    WHERE id = ${id}
    RETURNING *
  `;
  return rows.length ? rowToGallery(rows[0]) : null;
}

// Targeted like updateGalleryDetails so it can't clobber photos an upload is writing.
// The containment check keeps a cover from pointing at a photo outside this gallery.
// The focal point belongs to the old cover image, so a new cover starts from the default crop.
export async function setCoverPhoto(id: string, photoUrl: string): Promise<boolean> {
  const rows = await sql`
    UPDATE galleries
    SET cover_photo = ${photoUrl}, cover_focus_x = NULL, cover_focus_y = NULL
    WHERE id = ${id} AND photos @> ${JSON.stringify([photoUrl])}::jsonb
    RETURNING id
  `;
  return rows.length > 0;
}

export async function setCoverFocus(id: string, x: number, y: number): Promise<boolean> {
  const rows = await sql`
    UPDATE galleries SET cover_focus_x = ${x}, cover_focus_y = ${y}
    WHERE id = ${id}
    RETURNING id
  `;
  return rows.length > 0;
}

export async function clearCoverFocus(id: string): Promise<void> {
  await sql`UPDATE galleries SET cover_focus_x = NULL, cover_focus_y = NULL WHERE id = ${id}`;
}

// getGallery resolves a code against both access_code and id, so a duplicate of
// either would make the client link ambiguous.
export async function isAccessCodeTaken(code: string, excludeId: string): Promise<boolean> {
  const rows = await sql`
    SELECT 1 FROM galleries
    WHERE id <> ${excludeId}
      AND (LOWER(access_code) = LOWER(${code}) OR LOWER(id) = LOWER(${code}))
    LIMIT 1
  `;
  return rows.length > 0;
}

export async function deleteGallery(id: string): Promise<void> {
  await sql`DELETE FROM galleries WHERE id = ${id}`;
}
