"use client";
import type { Anime } from '@/types';
import AnimeCard from '@/components/AnimeCard';
import { getLikes, toggleLike, getWatched, toggleWatched } from '@/lib/storage';
import { Button } from '@/components/ui';
import { useEffect, useMemo, useState } from 'react';
import { useAnimeData } from '@/lib/data';

export default function ToWatchPage() {
  const { items: all } = useAnimeData();
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [watchedIds, setWatchedIds] = useState<string[]>([]);

  useEffect(() => {
    setLikedIds(getLikes());
    setWatchedIds(getWatched());
  }, []);

  const likedList = useMemo(() => {
    const set = new Set(likedIds);
    return all.filter(a => set.has(a.id));
  }, [likedIds, all]);

  const remove = (id: string) => {
    toggleLike(id);
    setLikedIds(getLikes());
  };
  const markWatchedAndRemove = (id: string) => {
    // Mark as watched and ensure it is removed from To-Watch by un-liking
    toggleWatched(id);
    if (getLikes().includes(id)) toggleLike(id);
    setWatchedIds(getWatched());
    setLikedIds(getLikes());
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">To Watch</h1>
      {likedList.length === 0 ? (
        <p className="text-gray-700">Your to-watch list is empty. Add some from Home or Recommendations.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {likedList.map(a => (
            <div key={a.id} className="flex flex-col">
              <AnimeCard anime={a} readOnly />
              <div className="mt-2 flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => remove(a.id)}
                  aria-label={`Remove ${a.title} from To Watch`}
                >
                  Remove from To‑Watch
                </Button>
                <Button
                  onClick={() => markWatchedAndRemove(a.id)}
                  aria-label={`Mark ${a.title} as watched`}
                >
                  {watchedIds.includes(a.id) ? 'Unmark watched' : 'Mark watched'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


