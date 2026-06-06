'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Download, X, ChevronLeft, ChevronRight, ImageIcon, Loader2 } from 'lucide-react';
import JSZip from 'jszip';

type Props = {
  galleryId: string;
  clientName: string;
  eventDate: string;
  eventType: string;
  photos: string[];
};

export default function GalleryView({ clientName, eventDate, eventType, photos }: Props) {
  const [lightbox, setLightbox] = useState(-1);
  const [zipping, setZipping] = useState(false);

  const prev = useCallback(() => setLightbox((i) => (i - 1 + photos.length) % photos.length), [photos.length]);
  const next = useCallback(() => setLightbox((i) => (i + 1) % photos.length), [photos.length]);

  useEffect(() => {
    if (lightbox < 0) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(-1);
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [lightbox, prev, next]);

  async function downloadOne(url: string, index: number) {
    const res = await fetch(url);
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `photo-${index + 1}.jpg`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function downloadAll() {
    setZipping(true);
    const zip = new JSZip();
    const folder = zip.folder(clientName) ?? zip;
    await Promise.all(
      photos.map(async (url, i) => {
        const res = await fetch(url);
        const blob = await res.blob();
        folder.file(`photo-${String(i + 1).padStart(3, '0')}.jpg`, blob);
      })
    );
    const content = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = `${clientName.replace(/\s+/g, '-')}-photos.zip`;
    a.click();
    URL.revokeObjectURL(a.href);
    setZipping(false);
  }

  const formattedDate = eventDate
    ? new Date(eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <main className="pt-20 min-h-screen">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-2">{eventType}</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#f0ebe3]">{clientName}</h1>
          {formattedDate && (
            <p className="text-[#6b6460] text-sm mt-2">{formattedDate}</p>
          )}
          <p className="text-[#6b6460] text-xs mt-1">{photos.length} photo{photos.length !== 1 ? 's' : ''}</p>
        </div>

        {photos.length > 0 && (
          <button
            onClick={downloadAll}
            disabled={zipping}
            className="inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase px-6 py-3 border border-[#c9a96e] text-[#c9a96e] hover:bg-[#c9a96e] hover:text-[#0c0b09] transition-all disabled:opacity-50"
          >
            {zipping ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {zipping ? 'Preparing zip…' : 'Download All'}
          </button>
        )}
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
        {photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <ImageIcon size={40} className="text-[#6b6460] mb-4" />
            <p className="text-[#6b6460]">Your photos are being processed. Check back soon.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {photos.map((url, i) => (
              <div
                key={url}
                className="relative overflow-hidden group cursor-pointer break-inside-avoid"
                onClick={() => setLightbox(i)}
              >
                <Image
                  src={url}
                  alt={`Photo ${i + 1}`}
                  width={800}
                  height={1000}
                  className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-[#0c0b09]/0 group-hover:bg-[#0c0b09]/40 transition-colors duration-500 flex items-end justify-between p-4">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs tracking-[0.2em] uppercase text-[#f0ebe3]">
                    View
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); downloadOne(url, i); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-[#c9a96e] text-[#0c0b09] hover:bg-[#f0ebe3]"
                    aria-label="Download photo"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      {lightbox >= 0 && (
        <div
          className="fixed inset-0 z-50 bg-[#0c0b09]/97 flex items-center justify-center"
          onClick={() => setLightbox(-1)}
        >
          <button
            onClick={() => setLightbox(-1)}
            className="absolute top-6 right-6 text-[#f0ebe3]/60 hover:text-[#f0ebe3] transition-colors p-2"
          >
            <X size={24} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); downloadOne(photos[lightbox], lightbox); }}
            className="absolute top-6 right-16 text-[#f0ebe3]/60 hover:text-[#c9a96e] transition-colors p-2"
            aria-label="Download"
          >
            <Download size={20} />
          </button>

          <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 md:left-8 text-[#f0ebe3]/60 hover:text-[#f0ebe3] p-2">
            <ChevronLeft size={32} />
          </button>

          <div className="relative max-w-5xl max-h-[85vh] w-full mx-16" onClick={(e) => e.stopPropagation()}>
            <Image
              src={photos[lightbox]}
              alt={`Photo ${lightbox + 1}`}
              width={1200}
              height={1400}
              className="object-contain max-h-[85vh] w-auto mx-auto"
              priority
            />
            <p className="text-center text-xs tracking-[0.2em] uppercase text-[#6b6460] mt-4">
              {lightbox + 1} / {photos.length}
            </p>
          </div>

          <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 md:right-8 text-[#f0ebe3]/60 hover:text-[#f0ebe3] p-2">
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </main>
  );
}
