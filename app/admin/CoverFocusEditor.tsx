'use client';

import { useRef, useState } from 'react';
import { Check, Loader2, RotateCcw } from 'lucide-react';

export type Focus = { x: number; y: number };

const DEFAULT_FOCUS: Focus = { x: 50, y: 30 };
const clamp = (n: number) => Math.min(100, Math.max(0, Math.round(n)));

type Props = {
  imageUrl: string;
  initial: Focus | null;
  saving: boolean;
  error: string;
  onSave: (focus: Focus) => void;
  onClose: () => void;
};

export default function CoverFocusEditor({ imageUrl, initial, saving, error, onSave, onClose }: Props) {
  const [focus, setFocus] = useState<Focus>(initial ?? DEFAULT_FOCUS);
  const boxRef = useRef<HTMLDivElement>(null);
  const objectPosition = `${focus.x}% ${focus.y}%`;

  function moveTo(e: React.PointerEvent) {
    const rect = boxRef.current?.getBoundingClientRect();
    if (!rect) return;
    setFocus({
      x: clamp(((e.clientX - rect.left) / rect.width) * 100),
      y: clamp(((e.clientY - rect.top) / rect.height) * 100),
    });
  }

  return (
    <div className="mb-6 border border-white/10 p-4 sm:p-5">
      <p className="text-sm text-[#f0ebe3] mb-1">Cover focus</p>
      <p className="text-xs text-[#6b6460] mb-4">
        Click or drag on the photo to choose the part that must stay in view. The previews show how the cover is cropped on a computer and on a phone.
      </p>

      <div className="flex flex-col md:flex-row gap-6 md:items-start">
        <div
          ref={boxRef}
          className="relative self-start touch-none select-none cursor-crosshair"
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); moveTo(e); }}
          onPointerMove={(e) => { if (e.currentTarget.hasPointerCapture(e.pointerId)) moveTo(e); }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="Cover photo" draggable={false} className="block max-h-72 w-auto max-w-full" />
          <span
            aria-hidden
            data-testid="focus-dot"
            className="pointer-events-none absolute w-7 h-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#c9a96e] bg-[#c9a96e]/30 shadow-[0_0_0_1px_rgba(0,0,0,0.6)]"
            style={{ left: `${focus.x}%`, top: `${focus.y}%` }}
          />
        </div>

        <div className="flex flex-wrap items-start gap-4">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#6b6460] mb-1.5">Computer</p>
            <div className="w-36 sm:w-56 aspect-video overflow-hidden bg-white/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="" className="w-full h-full object-cover" style={{ objectPosition }} />
            </div>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#6b6460] mb-1.5">Phone</p>
            <div className="w-16 sm:w-20 aspect-[9/19] overflow-hidden bg-white/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="" className="w-full h-full object-cover" style={{ objectPosition }} />
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-red-400 text-xs mt-4">{error}</p>}

      <div className="flex flex-wrap items-center gap-2 mt-4">
        <button
          onClick={() => onSave(focus)}
          disabled={saving}
          className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase px-4 py-2 bg-[#c9a96e] text-[#0c0b09] hover:bg-[#f0ebe3] transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
          Save focus
        </button>
        <button
          onClick={() => setFocus(DEFAULT_FOCUS)}
          disabled={saving}
          className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase px-4 py-2 border border-white/15 text-[#6b6460] hover:text-[#f0ebe3] hover:border-white/30 transition-colors disabled:opacity-50"
        >
          <RotateCcw size={12} /> Reset
        </button>
        <button
          onClick={onClose}
          className="text-xs tracking-[0.15em] uppercase px-4 py-2 border border-white/15 text-[#6b6460] hover:text-[#f0ebe3] hover:border-white/30 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
