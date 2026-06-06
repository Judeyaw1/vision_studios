import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    BLOB_READ_WRITE_TOKEN: !!process.env.BLOB_READ_WRITE_TOKEN,
    ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
    GALLERY_SECRET: !!process.env.GALLERY_SECRET,
    DATABASE_URL: !!process.env.DATABASE_URL,
  });
}
