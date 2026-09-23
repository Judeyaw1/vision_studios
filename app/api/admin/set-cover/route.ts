import { NextRequest, NextResponse } from 'next/server';
import { setCoverPhoto } from '@/lib/galleries';
import { makeAdminToken } from '../login/route';

function isAdminAuthed(req: NextRequest) {
  return req.cookies.get('admin_session')?.value === makeAdminToken();
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { galleryId, photoUrl } = await req.json() as { galleryId: string; photoUrl: string };
  if (!galleryId || !photoUrl) {
    return NextResponse.json({ error: 'Missing galleryId or photoUrl' }, { status: 400 });
  }

  const updated = await setCoverPhoto(galleryId, photoUrl);
  if (!updated) {
    return NextResponse.json({ error: 'That photo is not in this gallery' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
