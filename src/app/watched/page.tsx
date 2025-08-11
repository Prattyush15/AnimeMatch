"use client";
import { useAnimeData } from '@/lib/data';
import { getWatched, toggleWatched, getFeedbackMap, setFeedback } from '@/lib/storage';
import AnimeCard from '@/components/AnimeCard';
import type { Anime } from '@/types';
import { useEffect, useMemo, useState } from 'react';

export default function WatchedPage() {
  const { items: all } = useAnimeData();
  const [watchedIds, setWatchedIds] = useState<string[]>([]);
  const [feedback, setFeedbackState] = useState(getFeedbackMap());

  useEffect(() => {
    setWatchedIds(getWatched());
  }, []);

  const watchedList = useMemo(() => {
    const set = new Set(watchedIds);
    return all.filter(a => set.has(a.id));
  }, [watchedIds, all]);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Watched</h1>
      {watchedList.length === 0 ? (
        <p className="text-gray-700">No watched anime yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {watchedList.map((a: Anime) => (
            <div key={a.id} className="flex flex-col">
              <AnimeCard anime={a} readOnly status={feedback[a.id] === 'like' ? 'liked' : feedback[a.id] === 'dislike' ? 'disliked' : undefined} />
              <div className="mt-2 flex items-center gap-2">
                <button
                  className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
                  onClick={() => { setFeedback(a.id, 'like'); setFeedbackState(getFeedbackMap()); }}
                  aria-label={`I liked ${a.title}`}
                >
                  I liked it
                </button>
                <button
                  className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
                  onClick={() => { setFeedback(a.id, 'dislike'); setFeedbackState(getFeedbackMap()); }}
                  aria-label={`I didn't like ${a.title}`}
                >
                  I didn’t like it
                </button>
                <button className="rounded border px-2 py-1 text-xs hover:bg-gray-50" onClick={() => { toggleWatched(a.id); setWatchedIds(getWatched()); }}>Unmark watched</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


