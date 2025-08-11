"use client";
import { useEffect, useMemo, useState } from 'react';
import { Button, Badge } from '@/components/ui';
import { getPreferredGenres, setPreferredGenres } from '@/lib/storage';

const COMMON_GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Dark Fantasy', 'Historical', 'School'
];

export default function GenreQuiz({ onDone }: { onDone: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const existing = getPreferredGenres();
    if (existing.length) setSelected(existing);
  }, []);

  const toggle = (g: string) => {
    setSelected(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  const canContinue = selected.length >= 3;

  return (
    <div className="w-full max-w-xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-2 text-xl font-semibold">Pick a few genres you like</h2>
      <p className="mb-4 text-sm text-gray-600">Select at least 3 to personalize your deck. You can change this later.</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {COMMON_GENRES.map(g => (
          <button
            key={g}
            onClick={() => toggle(g)}
            className={
              'rounded-full border px-3 py-1 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
              (selected.includes(g) ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300 hover:bg-gray-50')
            }
            aria-pressed={selected.includes(g)}
            aria-label={`Select genre ${g}`}
          >
            {g}
          </button>
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => { setSelected([]); }}>Clear</Button>
        <Button
          aria-label="Save preferences"
          disabled={!canContinue}
          onClick={() => { setPreferredGenres(selected); onDone(); }}
        >
          Save & Continue
        </Button>
      </div>
    </div>
  );
}


