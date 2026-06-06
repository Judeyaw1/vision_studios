import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getGallery, saveGallery } from '@/lib/galleries';

function isAdminAuthed(req: NextRequest) {
  return req.cookies.get('admin_session')?.value === process.env.ADMIN_PASSWORD;
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const galleryId = formData.get('galleryId') as string;
  const files = formData.getAll('photos') as File[];

  if (!galleryId || !files.length) {
    return NextResponse.json({ error: 'Missing galleryId or photos' }, { status: 400 });
  }

  const gallery = getGallery(galleryId);
  if (!gallery) return NextResponse.json({ error: 'Gallery not found' }, { status: 404 });

  const uploaded: string[] = [];
  for (const file of files) {
    const blob = await put(`galleries/${galleryId}/${Date.now()}-${file.name}`, file, {
      access: 'public',
    });
    uploaded.push(blob.url);
  }

  gallery.photos = [...gallery.photos, ...uploaded];
  if (!gallery.coverPhoto && uploaded.length) gallery.coverPhoto = uploaded[0];
  saveGallery(gallery);

  return NextResponse.json({ uploaded, total: gallery.photos.length });
}
