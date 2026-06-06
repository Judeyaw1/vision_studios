import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export function makeAdminToken() {
  return crypto
    .createHmac('sha256', process.env.GALLERY_SECRET ?? 'dev-secret')
    .update('admin-' + process.env.ADMIN_PASSWORD)
    .digest('hex');
}

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  // Session cookie — no maxAge means it expires when the browser closes
  res.cookies.set('admin_session', makeAdminToken(), {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
  });
  return res;
}
