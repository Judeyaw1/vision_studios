'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Upload, Copy, Check, Loader2, ExternalLink, LogOut } from 'lucide-react';
import { upload } from '@vercel/blob/client';
import type { Gallery } from '@/lib/galleries';

export default function AdminDashboard({ galleries: initial }: { galleries: Gallery[] }) {
  const [galleries, setGalleries] = useState(initial);
  const [creating, setCreating] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [form, setForm] = useState({ clientName: '', eventDate: '', eventType: 'Wedding', password: '' });
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);
  const router = useRouter();

  async function logout() {
    setLoggingOut(true);
    await fetch('/api/admin/logout', { method: 'POST' });
    router.refresh();
  }

  async function createGallery(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/admin/galleries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const g = await res.json();
      setGalleries((prev) => [...prev, g]);
      setForm({ clientName: '', eventDate: '', eventType: 'Wedding', password: '' });
      setCreating(false);
    }
  }

  async function deleteGallery(id: string) {
    if (!confirm('Delete this gallery? This cannot be undone.')) return;
    await fetch('/api/admin/galleries', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setGalleries((prev) => prev.filter((g) => g.id !== id));
  }

  async function uploadPhotos(galleryId: string, files: FileList) {
    setUploading(galleryId);
    const fileArr = Array.from(files);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < fileArr.length; i++) {
      const file = fileArr[i];
      setUploadProgress(`Uploading ${i + 1} of ${fileArr.length}…`);
      const blob = await upload(`${galleryId}/${Date.now()}-${file.name}`, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/upload-token',
      });
      uploadedUrls.push(blob.url);
    }

    setUploadProgress('Saving…');
    await fetch('/api/admin/save-photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ galleryId, urls: uploadedUrls }),
    });

    setUploading(null);
    setUploadProgress('');
    setGalleries((prev) =>
      prev.map((g) =>
        g.id === galleryId ? { ...g, photos: [...g.photos, ...uploadedUrls] } : g
      )
    );
    router.refresh();
  }

  function copyLink(id: string) {
    const url = `${window.location.origin}/clients/${id}`;
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <main className="pt-20 min-h-screen">
      <section className="max-w-6xl mx-auto px-6 lg:px-12 py-12">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-2">Vision Studios</p>
            <h1 className="font-serif text-4xl text-[#f0ebe3]">Client Galleries</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCreating((v) => !v)}
              className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase px-5 py-3 bg-[#c9a96e] text-[#0c0b09] hover:bg-[#f0ebe3] transition-colors"
            >
              <Plus size={14} /> New Gallery
            </button>
            <button
              onClick={logout}
              disabled={loggingOut}
              className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase px-4 py-3 border border-white/15 text-[#6b6460] hover:text-[#f0ebe3] hover:border-white/30 transition-colors"
              aria-label="Log out"
            >
              {loggingOut ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />}
              Log Out
            </button>
          </div>
        </div>

        {/* Create form */}
        {creating && (
          <form onSubmit={createGallery} className="border border-[#c9a96e]/30 p-6 mb-8 space-y-4">
            <p className="text-xs tracking-[0.2em] uppercase text-[#c9a96e] mb-2">New Gallery</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#6b6460] block mb-1">Client Name *</label>
                <input
                  required
                  value={form.clientName}
                  onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))}
                  placeholder="Jane & John Smith"
                  className="w-full bg-transparent border border-white/15 px-4 py-2.5 text-[#f0ebe3] placeholder:text-[#6b6460]/60 focus:border-[#c9a96e] focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-[#6b6460] block mb-1">Event Date</label>
                <input
                  type="date"
                  value={form.eventDate}
                  onChange={(e) => setForm((f) => ({ ...f, eventDate: e.target.value }))}
                  className="w-full bg-transparent border border-white/15 px-4 py-2.5 text-[#f0ebe3] focus:border-[#c9a96e] focus:outline-none text-sm scheme-dark"
                />
              </div>
              <div>
                <label className="text-xs text-[#6b6460] block mb-1">Event Type</label>
                <select
                  value={form.eventType}
                  onChange={(e) => setForm((f) => ({ ...f, eventType: e.target.value }))}
                  className="w-full bg-[#0c0b09] border border-white/15 px-4 py-2.5 text-[#f0ebe3] focus:border-[#c9a96e] focus:outline-none text-sm"
                >
                  <option>Wedding</option>
                  <option>Portrait</option>
                  <option>Birthday</option>
                  <option>Event</option>
                  <option>Engagement</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[#6b6460] block mb-1">Gallery Password *</label>
                <input
                  required
                  type="text"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="e.g. sunshine2024"
                  className="w-full bg-transparent border border-white/15 px-4 py-2.5 text-[#f0ebe3] placeholder:text-[#6b6460]/60 focus:border-[#c9a96e] focus:outline-none text-sm"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="text-xs tracking-[0.2em] uppercase px-6 py-3 bg-[#c9a96e] text-[#0c0b09] hover:bg-[#f0ebe3] transition-colors">
                Create Gallery
              </button>
              <button type="button" onClick={() => setCreating(false)} className="text-xs tracking-[0.2em] uppercase px-6 py-3 border border-white/15 text-[#6b6460] hover:text-[#f0ebe3] transition-colors">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Gallery list */}
        {galleries.length === 0 ? (
          <div className="text-center py-24 text-[#6b6460]">
            <p className="mb-2">No galleries yet.</p>
            <p className="text-sm">Click "New Gallery" to create your first client gallery.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {galleries.map((g) => (
              <div key={g.id} className="border border-white/8 p-6 hover:border-white/15 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="font-serif text-xl text-[#f0ebe3]">{g.clientName}</h2>
                      <span className="text-xs tracking-[0.15em] uppercase bg-[#c9a96e]/10 text-[#c9a96e] px-2 py-0.5">{g.eventType}</span>
                    </div>
                    {g.eventDate && (
                      <p className="text-[#6b6460] text-sm mb-1">
                        {new Date(g.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    )}
                    <p className="text-[#6b6460] text-xs">{g.photos.length} photo{g.photos.length !== 1 ? 's' : ''}</p>
                    <p className="text-[#6b6460]/50 text-xs mt-1 font-mono">/clients/{g.id}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Copy link */}
                    <button
                      onClick={() => copyLink(g.id)}
                      className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase px-4 py-2 border border-white/15 text-[#6b6460] hover:text-[#f0ebe3] hover:border-white/30 transition-colors"
                    >
                      {copied === g.id ? <Check size={12} className="text-[#c9a96e]" /> : <Copy size={12} />}
                      {copied === g.id ? 'Copied!' : 'Copy Link'}
                    </button>

                    {/* View */}
                    <a
                      href={`/clients/${g.id}`}
                      target="_blank"
                      className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase px-4 py-2 border border-white/15 text-[#6b6460] hover:text-[#f0ebe3] hover:border-white/30 transition-colors"
                    >
                      <ExternalLink size={12} /> View
                    </a>

                    {/* Upload */}
                    <button
                      onClick={() => { setActiveUploadId(g.id); fileInputRef.current?.click(); }}
                      disabled={uploading === g.id}
                      className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase px-4 py-2 border border-[#c9a96e]/40 text-[#c9a96e] hover:bg-[#c9a96e] hover:text-[#0c0b09] transition-colors disabled:opacity-50"
                    >
                      {uploading === g.id
                        ? <><Loader2 size={12} className="animate-spin" />{uploadProgress}</>
                        : <><Upload size={12} />Upload Photos</>
                      }
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteGallery(g.id)}
                      className="p-2 text-[#6b6460] hover:text-red-400 transition-colors"
                      aria-label="Delete gallery"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && activeUploadId) {
            uploadPhotos(activeUploadId, e.target.files);
            e.target.value = '';
          }
        }}
      />
    </main>
  );
}
