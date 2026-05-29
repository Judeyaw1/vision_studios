'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

type Suggestion = {
  place_id: number;
  display_name: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function VenueAutocomplete({ value, onChange }: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length < 3) { setSuggestions([]); setOpen(false); return; }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=5&addressdetails=1`,
          { headers: { 'Accept-Language': 'en' } }
        );
        const data: Suggestion[] = await res.json();
        setSuggestions(data);
        setOpen(data.length > 0);
        setHighlighted(-1);
      } catch {
        setSuggestions([]);
        setOpen(false);
      }
    }, 350);
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function select(name: string) {
    onChange(name);
    setOpen(false);
    setSuggestions([]);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter' && highlighted >= 0) {
      e.preventDefault();
      select(suggestions[highlighted].display_name);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        autoComplete="off"
        className="w-full bg-transparent border border-white/15 px-4 py-3 text-[#f0ebe3] placeholder:text-[#6b6460]/60 focus:border-[#c9a96e] focus:outline-none transition-colors text-sm"
        placeholder="Start typing a venue or address…"
      />

      {open && (
        <ul className="absolute z-50 w-full mt-1 bg-[#1a1814] border border-white/10 shadow-xl max-h-60 overflow-y-auto">
          {suggestions.map((s, i) => (
            <li
              key={s.place_id}
              onMouseDown={() => select(s.display_name)}
              onMouseEnter={() => setHighlighted(i)}
              className={`flex items-start gap-3 px-4 py-3 cursor-pointer text-sm transition-colors ${
                i === highlighted
                  ? 'bg-[#c9a96e]/15 text-[#f0ebe3]'
                  : 'text-[#6b6460] hover:bg-white/5 hover:text-[#f0ebe3]'
              }`}
            >
              <MapPin size={13} className="text-[#c9a96e] flex-shrink-0 mt-0.5" />
              <span className="leading-snug line-clamp-2">{s.display_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
