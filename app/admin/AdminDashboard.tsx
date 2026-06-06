'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Upload, Copy, Check, Loader2, ExternalLink, LogOut, ChevronDown, ChevronUp, X } from 'lucide-react';
import type { Gallery } from '@/lib/galleries';

export default function AdminDashboard({ galleries: initial }: { galleries: Gallery[] }) {
  const [galleries, setGalleries] = useState(initial);
  const [creating, setCreating] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [form, setForm] = useState({ clientName: '', eventDate: '', eventType: 'Wedding', password: '' });
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });
  const [uploadError, setUploadError] = useState('');
  const [uploadSkipped, setUploadSkipped] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deletingPhoto, setDeletingPhoto] = useState<string | null>(null);
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

  async function hashFile(file: File): Promise<string> {
    // Hash only first 1MB for speed — good enough for duplicate detection
    const slice = file.slice(0, 1024 * 1024);
    const buffer = await slice.arrayBuffer();
    const digest = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  async function uploadPhotos(galleryId: string, files: FileList) {
    const gallery = galleries.find((g) => g.id === galleryId);
    const existingHashes = new Set(gallery?.photoHashes ?? []);
    const seenThisSession = new Set<string>();

    const fileArr = Array.from(files);
    const total = fileArr.length;
    let done = 0;
    let skipped = 0;
    const BATCH = 5;

    setUploading(galleryId);
    setUploadError('');
    setUploadSkipped(0);
    setUploadProgress({ done: 0, total });

    async function processFile(file: File): Promise<{ url: string; hash: string } | null> {
      const hash = await hashFile(file);
      if (existingHashes.has(hash) || seenThisSession.has(hash)) {
        seenThisSession.add(hash);
        return null;
      }
      seenThisSession.add(hash);

      const res = await fetch(
        `/api/admin/photo-upload?galleryId=${galleryId}&filename=${encodeURIComponent(file.name)}`,
        { method: 'POST', body: file, headers: { 'Content-Type': file.type || 'image/jpeg' } }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(data.error ?? 'Upload failed');
      }
      const { url } = await res.json();
      return { url, hash };
    }

    try {
      for (let i = 0; i < fileArr.length; i += BATCH) {
        const batch = fileArr.slice(i, i + BATCH);

        // Upload batch in parallel
        const settled = await Promise.allSettled(batch.map((f) => processFile(f)));

        const batchUrls: string[] = [];
        const batchHashes: string[] = [];

        for (const result of settled) {
          done++;
          if (result.status === 'fulfilled' && result.value) {
            batchUrls.push(result.value.url);
            batchHashes.push(result.value.hash);
          } else {
            skipped++;
            setUploadSkipped(skipped);
          }
          setUploadProgress({ done, total });
        }

        if (batchUrls.length > 0) {
          await fetch('/api/admin/save-photos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ galleryId, urls: batchUrls, hashes: batchHashes }),
          });
          setGalleries((prev) =>
            prev.map((g) =>
              g.id === galleryId ? { ...g, photos: [...g.photos, ...batchUrls] } : g
            )
          );
        }
      }

      router.refresh();
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadError(`Upload failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setUploading(null);
      setUploadProgress({ done: 0, total: 0 });
    }
  }

  async function deletePhoto(galleryId: string, photoUrl: string) {
    setDeletingPhoto(photoUrl);
    await fetch('/api/admin/delete-photo', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ galleryId, photoUrl }),
    });
    setGalleries((prev) =>
      prev.map((g) =>
        g.id === galleryId
          ? { ...g, photos: g.photos.filter((u) => u !== photoUrl) }
          : g
      )
    );
    setDeletingPhoto(null);
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

                  {uploadError && (
                    <p className="text-red-400 text-xs mt-1">{uploadError}</p>
                  )}
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
                    {uploading === g.id ? (
                      <div className="flex flex-col gap-1 min-w-35">
                        <div className="flex items-center gap-2 text-xs text-[#c9a96e]">
                          <Loader2 size={12} className="animate-spin shrink-0" />
                          {uploadProgress.done} / {uploadProgress.total} uploaded
                          {uploadSkipped > 0 && (
                            <span className="text-[#6b6460]">· {uploadSkipped} duplicate{uploadSkipped > 1 ? 's' : ''} skipped</span>
                          )}
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#c9a96e] transition-all duration-300"
                            style={{ width: `${uploadProgress.total ? (uploadProgress.done / uploadProgress.total) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setActiveUploadId(g.id); fileInputRef.current?.click(); }}
                        className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase px-4 py-2 border border-[#c9a96e]/40 text-[#c9a96e] hover:bg-[#c9a96e] hover:text-[#0c0b09] transition-colors"
                      >
                        <Upload size={12} /> Upload Photos
                      </button>
                    )}

                    {/* Expand photos */}
                    <button
                      onClick={() => setExpanded(expanded === g.id ? null : g.id)}
                      className="inline-flex items-center gap-1 text-xs tracking-[0.15em] uppercase px-4 py-2 border border-white/15 text-[#6b6460] hover:text-[#f0ebe3] hover:border-white/30 transition-colors"
                    >
                      {expanded === g.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      Photos
                    </button>

                    {/* Delete gallery */}
                    <button
                      onClick={() => deleteGallery(g.id)}
                      className="p-2 text-[#6b6460] hover:text-red-400 transition-colors"
                      aria-label="Delete gallery"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Photo grid */}
                {expanded === g.id && (
                  <div className="mt-6 pt-6 border-t border-white/8">
                    {g.photos.length === 0 ? (
                      <p className="text-[#6b6460] text-sm">No photos uploaded yet.</p>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                        {g.photos.map((url) => (
                          <div key={url} className="relative group aspect-square overflow-hidden bg-white/5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => deletePhoto(g.id, url)}
                              disabled={deletingPhoto === url}
                              className="absolute inset-0 bg-[#0c0b09]/0 group-hover:bg-[#0c0b09]/60 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                              aria-label="Delete photo"
                            >
                              {deletingPhoto === url
                                ? <Loader2 size={18} className="animate-spin text-white" />
                                : <X size={18} className="text-red-400" />
                              }
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
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
