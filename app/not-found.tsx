import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="font-serif text-8xl text-[#c9a96e]/20 mb-6">404</p>
        <h1 className="font-serif text-3xl text-[#f0ebe3] mb-4">Page Not Found</h1>
        <p className="text-[#6b6460] mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#c9a96e] hover:gap-4 transition-all"
        >
          Return Home <ArrowRight size={14} />
        </Link>
      </div>
    </main>
  );
}
