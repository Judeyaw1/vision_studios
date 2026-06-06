import { NextRequest, NextResponse } from 'next/server';
import { getGalleries, saveGallery, deleteGallery, hashPassword } from '@/lib/galleries';
import { makeAdminToken } from '../login/route';

function isAdminAuthed(req: NextRequest) {
  return req.cookies.get('admin_session')?.value === makeAdminToken();
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(getGalleries());
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { clientName, eventDate, eventType, password } = body;

  if (!clientName || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const id = clientName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    + '-' + Date.now().toString(36);

  const gallery = {
    id,
    clientName,
    eventDate: eventDate ?? '',
    eventType: eventType ?? 'Session',
    passwordHash: hashPassword(password),
    photos: [],
    createdAt: new Date().toISOString(),
  };

  saveGallery(gallery);
  return NextResponse.json(gallery, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  deleteGallery(id);
  return NextResponse.json({ ok: true });
}
