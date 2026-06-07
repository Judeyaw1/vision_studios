'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

type Category = 'All' | 'Weddings' | 'Portraits' | 'Events';

const photos: { src: string; alt: string; category: Exclude<Category, 'All'> }[] = [
  { src: '/images/0M0A6970.jpeg', alt: 'Bride walking to the altar', category: 'Weddings' },
  { src: '/images/0M0A6831.jpeg', alt: 'Couple at church altar', category: 'Weddings' },
  { src: '/images/0M0A6893.jpeg', alt: 'Wedding portrait at altar', category: 'Weddings' },
  { src: '/images/0M0A6742.jpeg', alt: 'Wedding ceremony vows', category: 'Weddings' },
  { src: '/images/0M0A7015.jpeg', alt: 'Wedding ring close-up', category: 'Weddings' },
  { src: '/images/0M0A0717.jpeg', alt: 'Portrait in red dress', category: 'Portraits' },
  { src: '/images/0M0A0723.jpeg', alt: 'Studio portrait', category: 'Portraits' },
  { src: '/images/0M0A0764.jpeg', alt: 'Confident portrait', category: 'Portraits' },
  { src: '/images/0M0A0793.jpeg', alt: 'Smiling portrait', category: 'Portraits' },
  { src: '/images/IMG_3179.jpeg', alt: 'Elegant portrait with YSL', category: 'Portraits' },
  { src: '/images/IMG_3217.jpeg', alt: 'Portrait in white beaded gown', category: 'Portraits' },
  { src: '/images/IMG_3218.jpeg', alt: 'Joyful portrait', category: 'Portraits' },
  { src: '/images/IMG_8089.jpeg', alt: 'Birthday celebration', category: 'Events' },
  { src: '/images/IMG_8139.jpeg', alt: 'Birthday outdoor shoot', category: 'Events' },
  { src: '/images/IMG_8169.jpeg', alt: 'Celebration with flower', category: 'Events' },
  { src: '/images/IMG_8198.jpeg', alt: 'Autumn birthday session', category: 'Events' },
];

const categories: Category[] = ['All', 'Weddings', 'Portraits', 'Events'];

export default function PortfolioPage() {
  const [active, setActive] = useState<Category>('All');
  const [index, setIndex] = useState(-1);

  const filtered = active === 'All' ? photos : photos.filter((p) => p.category === active);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + filtered.length) % filtered.length);
  }, [filtered.length]);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % filtered.length);
  }, [filtered.length]);

  useEffect(() => {
    if (index < 0) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIndex(-1);
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [index, prev, next]);

  return (
    <main className="pt-20">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12 sm:py-20">
        <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-4">Our Work</p>
        <h1 className="font-serif text-5xl sm:text-6xl font-light text-[#f0ebe3]">Portfolio</h1>
      </section>

      {/* Filter tabs */}
      <div className="border-y border-white/8 sticky top-20 z-40 bg-[#0c0b09]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center gap-1 overflow-x-auto py-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActive(cat); setIndex(-1); }}
              className={`flex-shrink-0 text-xs tracking-[0.2em] uppercase px-5 py-2 transition-all ${
                active === cat
                  ? 'bg-[#c9a96e] text-[#0c0b09]'
                  : 'text-[#6b6460] hover:text-[#f0ebe3]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filtered.map((photo, i) => (
            <div
              key={photo.src}
              onClick={() => setIndex(i)}
              className="relative overflow-hidden cursor-pointer group break-inside-avoid"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={800}
                height={1000}
                className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-[#0c0b09]/0 group-hover:bg-[#0c0b09]/40 transition-colors duration-500 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs tracking-[0.25em] uppercase text-[#f0ebe3]">
                  View
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {index >= 0 && (
        <div
          className="fixed inset-0 z-50 bg-[#0c0b09]/97 flex items-center justify-center"
          onClick={() => setIndex(-1)}
        >
          <button
            onClick={() => setIndex(-1)}
            className="absolute top-6 right-6 text-[#f0ebe3]/60 hover:text-[#f0ebe3] transition-colors p-2"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 md:left-8 text-[#f0ebe3]/60 hover:text-[#f0ebe3] transition-colors p-2"
            aria-label="Previous"
          >
            <ChevronLeft size={32} />
          </button>

          <div
            className="relative max-w-5xl max-h-[85vh] w-full mx-4 sm:mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={filtered[index].src}
              alt={filtered[index].alt}
              width={1200}
              height={1400}
              className="object-contain max-h-[85vh] w-auto mx-auto"
              priority
            />
            <p className="text-center text-xs tracking-[0.2em] uppercase text-[#6b6460] mt-4">
              {filtered[index].alt} — {index + 1} / {filtered.length}
            </p>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 md:right-8 text-[#f0ebe3]/60 hover:text-[#f0ebe3] transition-colors p-2"
            aria-label="Next"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </main>
  );
}
