import { NextRequest, NextResponse } from 'next/server';
import { del } from '@vercel/blob';
import { getGallery, saveGallery, clearCoverFocus } from '@/lib/galleries';
import { makeAdminToken } from '../login/route';

function isAdminAuthed(req: NextRequest) {
  return req.cookies.get('admin_session')?.value === makeAdminToken();
}

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { galleryId, photoUrl } = await req.json() as { galleryId: string; photoUrl: string };

  if (!galleryId || !photoUrl) {
    return NextResponse.json({ error: 'Missing galleryId or photoUrl' }, { status: 400 });
  }

  const gallery = await getGallery(galleryId);
  if (!gallery) return NextResponse.json({ error: 'Gallery not found' }, { status: 404 });

  // Remove URL and its hash from DB
  const idx = gallery.photos.indexOf(photoUrl);
  gallery.photos = gallery.photos.filter((url) => url !== photoUrl);
  if (idx >= 0 && gallery.photoHashes?.length) {
    gallery.photoHashes = gallery.photoHashes.filter((_, i) => i !== idx);
  }
  const coverRemoved = gallery.coverPhoto === photoUrl;
  if (coverRemoved) {
    gallery.coverPhoto = gallery.photos[0] ?? '';
  }
  await saveGallery(gallery);
  // The focal point belonged to the deleted cover, not its replacement.
  if (coverRemoved) await clearCoverFocus(gallery.id);

  // Delete from Vercel Blob
  try {
    await del(photoUrl);
  } catch {
    // Blob may already be gone — not fatal
  }

  return NextResponse.json({ remaining: gallery.photos.length });
}
