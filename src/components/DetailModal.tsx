"use client";
import * as React from 'react';
import type { Anime } from '@/types';

export default function DetailModal({ anime, open, onClose }: { anime: Anime | null; open: boolean; onClose: () => void }) {
  if (!open || !anime) return null;
  const ytId = anime.trailer?.site?.toLowerCase() === 'youtube' ? anime.trailer?.id : undefined;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold">{anime.title}</h3>
          <button onClick={onClose} aria-label="Close" className="rounded p-2 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2">✕</button>
        </div>
        <div className="grid gap-4 p-4 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm text-gray-700">{anime.synopsis}</p>
            <div className="text-sm text-gray-600">Genres: {anime.genres.join(', ')}</div>
            <div className="text-sm text-gray-600">Episodes: {anime.episodes ?? 'Ongoing'}</div>
            <div className="text-sm text-gray-600">Year: {anime.year ?? '—'}</div>
          </div>
          <div className="aspect-video w-full bg-black">
            {ytId ? (
              <iframe
                title="Trailer"
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${ytId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-white/70">No trailer</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


