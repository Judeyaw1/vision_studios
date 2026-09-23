import { NextRequest, NextResponse } from 'next/server';
import { getGallery, verifyPassword, makeSessionToken } from '@/lib/galleries';

export async function POST(req: NextRequest) {
  const { galleryId, password } = await req.json();

  const gallery = await getGallery(galleryId);
  if (!gallery) {
    return NextResponse.json({ error: 'Gallery not found' }, { status: 404 });
  }

  if (!verifyPassword(password, gallery.passwordHash)) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  // Keyed by the internal id, not the typed code: codes are free text and may
  // contain characters that are illegal in a cookie name.
  const token = makeSessionToken(gallery.id);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(`gallery_${gallery.id}`, token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  return res;
}
