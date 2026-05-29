'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#0c0b09] text-[#f0ebe3] flex items-center justify-center">
      <div className="text-center">
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', marginBottom: '1rem' }}>
          Something went wrong
        </h2>
        <button
          onClick={reset}
          style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '0.75rem 1.5rem', border: '1px solid #c9a96e', color: '#c9a96e', background: 'none', cursor: 'pointer' }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
