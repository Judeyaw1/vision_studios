'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function ClientsPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    const res = await fetch(`/api/clients/check?id=${encodeURIComponent(code.trim())}`);
    setLoading(false);
    if (res.ok) {
      router.push(`/clients/${encodeURIComponent(code.trim())}`);
    } else {
      setError('Gallery not found. Check your code and try again.');
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Image
        src="/images/0M0A6893.jpeg"
        alt="Wedding ceremony"
        fill
        priority
        className="object-cover"
        style={{ objectPosition: '50% 22%' }}
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[#0c0b09]/80" />

      <div className="relative z-10 w-full max-w-md mx-auto px-6 text-center">
        <p className="text-xs tracking-[0.35em] uppercase text-[#c9a96e] mb-4">Client Portal</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#f0ebe3] mb-3">
          Your Gallery
        </h1>
        <p className="text-[#6b6460] text-sm mb-10">
          Enter the gallery code shared by your photographer to view and download your photos.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your gallery code"
            className="w-full bg-transparent border border-white/20 px-5 py-4 text-[#f0ebe3] placeholder:text-[#6b6460] focus:border-[#c9a96e] focus:outline-none transition-colors text-sm text-center tracking-widest"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="w-full inline-flex items-center justify-center gap-3 text-xs tracking-[0.2em] uppercase px-8 py-4 bg-[#c9a96e] text-[#0c0b09] hover:bg-[#f0ebe3] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <>Access Gallery <ArrowRight size={14} /></>}
          </button>
        </form>
      </div>
    </main>
  );
}
