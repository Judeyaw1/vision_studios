'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lock, Loader2 } from 'lucide-react';

export default function UnlockForm({ galleryId, clientName }: { galleryId: string; clientName: string }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/clients/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ galleryId, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.refresh();
    } else {
      setError('Incorrect password. Please try again.');
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Image
        src="/images/0M0A6893.jpeg"
        alt="Wedding"
        fill
        priority
        className="object-cover"
        style={{ objectPosition: '50% 22%' }}
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[#0c0b09]/82" />

      <div className="relative z-10 w-full max-w-md mx-auto px-6 text-center">
        <div className="w-12 h-12 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/30 flex items-center justify-center mx-auto mb-6">
          <Lock size={18} className="text-[#c9a96e]" />
        </div>
        <p className="text-xs tracking-[0.35em] uppercase text-[#c9a96e] mb-3">Private Gallery</p>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#f0ebe3] mb-2">
          {clientName}
        </h1>
        <p className="text-[#6b6460] text-sm mb-10">Enter your password to access your photos.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your gallery password"
            className="w-full bg-transparent border border-white/20 px-5 py-4 text-[#f0ebe3] placeholder:text-[#6b6460] focus:border-[#c9a96e] focus:outline-none transition-colors text-sm text-center"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full inline-flex items-center justify-center gap-3 text-xs tracking-[0.2em] uppercase px-8 py-4 bg-[#c9a96e] text-[#0c0b09] hover:bg-[#f0ebe3] transition-colors duration-300 disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : 'View My Photos'}
          </button>
        </form>
      </div>
    </main>
  );
}
