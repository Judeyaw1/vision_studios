import { NextRequest, NextResponse } from 'next/server';
import { getGallery } from '@/lib/galleries';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const gallery = await getGallery(id);
  if (!gallery) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
