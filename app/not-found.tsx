import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Image
        src="/images/0M0A6893.jpeg"
        alt="Wedding ceremony"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[#0c0b09]/80" />

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <p className="font-serif text-[8rem] sm:text-[12rem] leading-none text-[#c9a96e]/20 select-none">
          404
        </p>
        <div className="-mt-6 sm:-mt-10">
          <p className="text-xs tracking-[0.35em] uppercase text-[#c9a96e] mb-5">
            Page Not Found
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#f0ebe3] leading-tight mb-6">
            This moment has<br />
            <em className="italic">slipped away.</em>
          </h1>
          <p className="text-[#6b6460] leading-relaxed mb-10">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back to something beautiful.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-3 text-xs tracking-[0.2em] uppercase px-8 py-4 bg-[#c9a96e] text-[#0c0b09] hover:bg-[#f0ebe3] transition-colors duration-300"
            >
              Go Home <ArrowRight size={14} />
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center gap-3 text-xs tracking-[0.2em] uppercase px-8 py-4 border border-[#f0ebe3]/40 text-[#f0ebe3] hover:border-[#f0ebe3] transition-colors duration-300"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
