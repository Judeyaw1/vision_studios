import { NextRequest, NextResponse } from 'next/server';
import { getGallery, verifyPassword, makeSessionToken } from '@/lib/galleries';

export async function POST(req: NextRequest) {
  const { galleryId, password } = await req.json();

  const gallery = getGallery(galleryId);
  if (!gallery) {
    return NextResponse.json({ error: 'Gallery not found' }, { status: 404 });
  }

  if (!verifyPassword(password, gallery.passwordHash)) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const token = makeSessionToken(galleryId);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(`gallery_${galleryId}`, token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  return res;
}
