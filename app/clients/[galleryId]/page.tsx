import { notFound } from 'next/navigation';
import { getGallery } from '@/lib/galleries';
import GalleryView from './GalleryView';

export default async function GalleryPage({ params }: { params: Promise<{ galleryId: string }> }) {
  const { galleryId: rawId } = await params;
  // Dynamic params arrive still percent-encoded, so a code like "P&P2026" would
  // otherwise be looked up as "P%26P2026" and 404.
  let galleryId = rawId;
  try { galleryId = decodeURIComponent(rawId); } catch { /* malformed escape: use as-is */ }

  const gallery = await getGallery(galleryId);
  if (!gallery) notFound();

  return (
    <GalleryView
      galleryId={galleryId}
      clientName={gallery.clientName}
      eventDate={gallery.eventDate}
      eventType={gallery.eventType}
      photos={gallery.photos}
      coverPhoto={gallery.coverPhoto}
      coverFocus={gallery.coverFocus}
    />
  );
}
