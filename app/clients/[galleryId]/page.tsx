import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { getGallery, makeSessionToken } from '@/lib/galleries';
import UnlockForm from './UnlockForm';
import GalleryView from './GalleryView';

export default async function GalleryPage({ params }: { params: Promise<{ galleryId: string }> }) {
  const { galleryId } = await params;
  const gallery = await getGallery(galleryId);
  if (!gallery) notFound();

  const cookieStore = await cookies();
  const token = cookieStore.get(`gallery_${galleryId}`)?.value;
  const isUnlocked = token === makeSessionToken(galleryId);

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
