'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  { src: '/images/IMG_8089.jpeg', alt: 'Birthday celebration',      objectPosition: '50% 50%' },
  { src: '/images/0M0A0793.jpeg', alt: 'Portrait in red dress',     objectPosition: '50% 25%' },
  { src: '/images/IMG_8169.jpeg', alt: 'Celebration with flowers',  objectPosition: '50% 50%' },

  { src: '/images/IMG_8198.jpeg', alt: 'Autumn birthday session',   objectPosition: '50% 50%' },
  { src: '/images/0M0A6742.jpeg', alt: 'Wedding ceremony vows',     objectPosition: '50% 5%'  },
];

const INTERVAL = 5000;

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);

  useEffect(() => {
    const id = setInterval(() => advance(1), INTERVAL);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  function advance(dir: 1 | -1) {
    setPrev(current);
    setCurrent((c) => (c + dir + slides.length) % slides.length);
  }

  return (
    <section className="relative h-screen flex items-end pb-24 overflow-hidden">
      {/* Previous slide (fading out) */}
      {prev !== null && (
        <div key={`prev-${prev}`} className="absolute inset-0 animate-fade-out pointer-events-none">
          <Image
            src={slides[prev].src}
            alt={slides[prev].alt}
            fill
            className="object-cover"
            style={{ objectPosition: slides[prev].objectPosition }}
            sizes="100vw"
            priority
          />
        </div>
      )}

      {/* Current slide (fading in) */}
      <div key={`curr-${current}`} className="absolute inset-0 animate-fade-in">
        <Image
          src={slides[current].src}
          alt={slides[current].alt}
          fill
          className="object-cover"
          style={{ objectPosition: slides[current].objectPosition }}
          sizes="100vw"
          priority
        />
      </div>

      <div className="absolute inset-0 bg-linear-to-t from-[#0c0b09] via-[#0c0b09]/30 to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <p className="text-xs tracking-[0.35em] uppercase text-[#c9a96e] mb-6">
          Wedding &amp; Event Photography
        </p>
        <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-light leading-none text-[#f0ebe3] max-w-3xl">
          Every moment<br />
          <em className="italic text-[#c9a96e]">deserves</em> to<br />
          live forever.
        </h1>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase px-8 py-4 bg-[#c9a96e] text-[#0c0b09] hover:bg-[#f0ebe3] transition-colors duration-300"
          >
            View Portfolio <ArrowRight size={14} />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase px-8 py-4 border border-[#f0ebe3]/40 text-[#f0ebe3] hover:border-[#f0ebe3] transition-colors duration-300"
          >
            Book a Session
          </Link>
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={() => advance(-1)}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 text-[#f0ebe3]/50 hover:text-[#c9a96e] transition-colors p-2"
        aria-label="Previous slide"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={() => advance(1)}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 text-[#f0ebe3]/50 hover:text-[#c9a96e] transition-colors p-2"
        aria-label="Next slide"
      >
        <ChevronRight size={32} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setPrev(current); setCurrent(i); }}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? 'w-6 h-1.5 bg-[#c9a96e]'
                : 'w-1.5 h-1.5 bg-[#f0ebe3]/30 hover:bg-[#f0ebe3]/60'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll cue */}
      <a
        href="#teaser"
        className="absolute bottom-8 right-6 lg:right-12 z-20 text-[#f0ebe3]/40 hover:text-[#c9a96e] transition-colors animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown size={24} />
      </a>
    </section>
  );
}
