import { NextRequest, NextResponse } from 'next/server';
import { getGallery, saveGallery } from '@/lib/galleries';
import { makeAdminToken } from '../login/route';

function isAdminAuthed(req: NextRequest) {
  return req.cookies.get('admin_session')?.value === makeAdminToken();
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { galleryId, urls, hashes } = await req.json() as {
    galleryId: string;
    urls: string[];
    hashes: string[];
  };

  if (!galleryId || !urls?.length) {
    return NextResponse.json({ error: 'Missing galleryId or urls' }, { status: 400 });
  }

  const gallery = await getGallery(galleryId);
  if (!gallery) return NextResponse.json({ error: 'Gallery not found' }, { status: 404 });

  gallery.photos = [...gallery.photos, ...urls];
  gallery.photoHashes = [...(gallery.photoHashes ?? []), ...(hashes ?? [])];
  if (!gallery.coverPhoto) gallery.coverPhoto = urls[0];
  await saveGallery(gallery);

  return NextResponse.json({ total: gallery.photos.length });
}
