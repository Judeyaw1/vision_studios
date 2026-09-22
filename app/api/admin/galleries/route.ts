import { NextRequest, NextResponse } from 'next/server';
import { getGalleries, saveGallery, updateGalleryDetails, deleteGallery, hashPassword } from '@/lib/galleries';
import { makeAdminToken } from '../login/route';

function isAdminAuthed(req: NextRequest) {
  return req.cookies.get('admin_session')?.value === makeAdminToken();
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(await getGalleries());
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { clientName, eventDate, eventType, password, accessCode } = await req.json();
  if (!clientName || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const id = clientName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    + '-' + Date.now().toString(36);

  const gallery = {
    id,
    accessCode: accessCode ? accessCode.trim().toUpperCase() : '',
    clientName,
    eventDate: eventDate ?? '',
    eventType: eventType ?? 'Session',
    passwordHash: hashPassword(password),
    photos: [],
    photoHashes: [],
    createdAt: new Date().toISOString(),
  };

  await saveGallery(gallery);
  return NextResponse.json(gallery, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, clientName, eventDate, eventType } = await req.json();
  if (!id || !clientName?.trim()) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // The id stays fixed even when the name changes — it is baked into the link
  // clients already have and into their unlock cookie.
  const gallery = await updateGalleryDetails(id, {
    clientName: clientName.trim(),
    eventDate: eventDate ?? '',
    eventType: eventType || 'Session',
  });
  if (!gallery) return NextResponse.json({ error: 'Gallery not found' }, { status: 404 });

  return NextResponse.json(gallery);
}

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  await deleteGallery(id);
  return NextResponse.json({ ok: true });
}
