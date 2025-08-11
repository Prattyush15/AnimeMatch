"use client";
import { useEffect, useState } from 'react';

export default function FilterChips({ allGenres, onChange }: { allGenres: string[]; onChange: (genres: string[]) => void }) {
  const [active, setActive] = useState<string[]>([]);
  useEffect(() => onChange(active), [active, onChange]);
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {allGenres.map(g => (
        <button
          key={g}
          onClick={() => setActive(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])}
          aria-pressed={active.includes(g)}
          className={'rounded-full border px-3 py-1 text-sm ' + (active.includes(g) ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300 hover:bg-gray-50')}
        >
          {g}
        </button>
      ))}
      {active.length > 0 && (
        <button onClick={() => setActive([])} className="rounded-full border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">Clear</button>
      )}
    </div>
  );
}


