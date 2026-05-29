import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronDown } from 'lucide-react';

const teaserPhotos = [
  { src: '/images/0M0A6970.jpeg', alt: 'Bride at the altar', span: 'md:col-span-2 md:row-span-2' },
  { src: '/images/0M0A0717.jpeg', alt: 'Portrait in red', span: '' },
  { src: '/images/0M0A6831.jpeg', alt: 'Wedding couple', span: '' },
  { src: '/images/IMG_3179.jpeg', alt: 'Elegant portrait', span: '' },
  { src: '/images/0M0A7015.jpeg', alt: 'Wedding ring detail', span: '' },
];

const stats = [
  { value: '500+', label: 'Sessions' },
  { value: '5+', label: 'Years' },
  { value: 'DMV', label: 'Based in' },
  { value: '98%', label: 'Satisfaction' },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative h-screen flex items-end pb-24 overflow-hidden">
        <Image
          src="/images/0M0A6893.jpeg"
          alt="Wedding ceremony"
          fill
          priority
          className="object-cover object-center scale-105"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b09] via-[#0c0b09]/30 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
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

        <a
          href="#teaser"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#f0ebe3]/40 hover:text-[#c9a96e] transition-colors animate-bounce"
          aria-label="Scroll down"
        >
          <ChevronDown size={24} />
        </a>
      </section>

      {/* Stats */}
      <section className="border-y border-white/8 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="font-serif text-4xl text-[#c9a96e]">{value}</p>
              <p className="text-xs tracking-[0.2em] uppercase text-[#6b6460] mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Teaser Gallery */}
      <section id="teaser" className="max-w-7xl mx-auto px-6 lg:px-12 py-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-3">Our Work</p>
            <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#f0ebe3]">
              Stories We&apos;ve Told
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#c9a96e] hover:gap-4 transition-all"
          >
            Full Portfolio <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 auto-rows-[220px] md:auto-rows-[260px]">
          {teaserPhotos.map((photo, i) => (
            <div key={i} className={`relative overflow-hidden group ${photo.span}`}>
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-[#0c0b09]/0 group-hover:bg-[#0c0b09]/30 transition-colors duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-[#111009] py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative h-[500px]">
            <Image
              src="/images/0M0A0764.jpeg"
              alt="Photographer at work"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-4">Philosophy</p>
            <h2 className="font-serif text-4xl sm:text-5xl font-light leading-tight text-[#f0ebe3] mb-8">
              Light, Emotion,<br />
              <em className="italic">Truth.</em>
            </h2>
            <p className="text-[#6b6460] leading-relaxed mb-6">
              We believe the most powerful photographs are the ones that feel like a whisper —
              a stolen glance, a tear brushed away, the exact second joy becomes a memory.
              Our job is to be invisible enough that those moments happen, and present enough to capture them.
            </p>
            <p className="text-[#6b6460] leading-relaxed mb-10">
              Based in the DMV area, we travel for clients who want imagery
              that transcends the ordinary.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-[#c9a96e] hover:gap-5 transition-all"
            >
              Our Story <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-36">
        <Image
          src="/images/0M0A6742.jpeg"
          alt="Wedding ceremony"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0c0b09]/75" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-5">Limited dates available</p>
          <h2 className="font-serif text-4xl sm:text-6xl font-light text-[#f0ebe3] leading-tight mb-10">
            Ready to create something beautiful?
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase px-10 py-5 bg-[#c9a96e] text-[#0c0b09] hover:bg-[#f0ebe3] transition-colors duration-300"
          >
            Start a Conversation <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  );
}
