import { NextRequest, NextResponse } from 'next/server';
import { setCoverFocus } from '@/lib/galleries';
import { makeAdminToken } from '../login/route';

function isAdminAuthed(req: NextRequest) {
  return req.cookies.get('admin_session')?.value === makeAdminToken();
}

const clampPercent = (n: number) => Math.min(100, Math.max(0, Math.round(n)));

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { galleryId, x, y } = await req.json() as { galleryId: string; x: number; y: number };
  if (!galleryId || typeof x !== 'number' || typeof y !== 'number' || !Number.isFinite(x) || !Number.isFinite(y)) {
    return NextResponse.json({ error: 'Missing galleryId, x or y' }, { status: 400 });
  }

  const focus = { x: clampPercent(x), y: clampPercent(y) };
  const updated = await setCoverFocus(galleryId, focus.x, focus.y);
  if (!updated) {
    return NextResponse.json({ error: 'Gallery not found' }, { status: 404 });
  }

  return NextResponse.json(focus);
}
