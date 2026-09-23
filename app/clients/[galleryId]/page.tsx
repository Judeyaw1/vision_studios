import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { getGallery, makeSessionToken } from '@/lib/galleries';
import UnlockForm from './UnlockForm';
import GalleryView from './GalleryView';

export default async function GalleryPage({ params }: { params: Promise<{ galleryId: string }> }) {
  const { galleryId: rawId } = await params;
  // Dynamic params arrive still percent-encoded, so a code like "P&P2026" would
  // otherwise be looked up as "P%26P2026" and 404.
  let galleryId = rawId;
  try { galleryId = decodeURIComponent(rawId); } catch { /* malformed escape: use as-is */ }

  const gallery = await getGallery(galleryId);
  if (!gallery) notFound();

  const cookieStore = await cookies();
  const token = cookieStore.get(`gallery_${gallery.id}`)?.value;
  const isUnlocked = token === makeSessionToken(gallery.id);

  if (!isUnlocked) {
    return <UnlockForm galleryId={galleryId} clientName={gallery.clientName} />;
  }

  return (
    <GalleryView
      galleryId={galleryId}
      clientName={gallery.clientName}
      eventDate={gallery.eventDate}
      eventType={gallery.eventType}
      photos={gallery.photos}
    />
  );
}
