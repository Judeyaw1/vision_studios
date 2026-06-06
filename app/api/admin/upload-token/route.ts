import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextRequest, NextResponse } from 'next/server';
import { makeAdminToken } from '../login/route';

function isAdminAuthed(req: NextRequest) {
  return req.cookies.get('admin_session')?.value === makeAdminToken();
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await req.json()) as HandleUploadBody;

  const jsonResponse = await handleUpload({
    body,
    request: req,
    onBeforeGenerateToken: async (pathname) => ({
      pathname: `galleries/${pathname}`,
      allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic'],
      maximumSizeInBytes: 50 * 1024 * 1024, // 50MB per file
    }),
    onUploadCompleted: async () => {
      // URL is saved separately via /api/admin/save-photos
    },
  });

  return NextResponse.json(jsonResponse);
}
