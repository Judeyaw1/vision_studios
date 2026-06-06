import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { makeAdminToken } from '../login/route';

function isAdminAuthed(req: NextRequest) {
  return req.cookies.get('admin_session')?.value === makeAdminToken();
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const galleryId = req.nextUrl.searchParams.get('galleryId');
  const filename = req.nextUrl.searchParams.get('filename') ?? 'photo.jpg';

  if (!galleryId) {
    return NextResponse.json({ error: 'Missing galleryId' }, { status: 400 });
  }

  const contentType = req.headers.get('content-type') ?? 'image/jpeg';

  try {
    const buffer = await req.arrayBuffer();

    if (!buffer.byteLength) {
      return NextResponse.json({ error: 'Empty file body' }, { status: 400 });
    }

    const blob = await put(
      `galleries/${galleryId}/${Date.now()}-${filename}`,
      buffer,
      { access: 'public', contentType },
    );

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error('photo-upload error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
