"use client";
import { useEffect, useState } from 'react';
import localData from '@/data/anime.json';
import type { Anime } from '@/types';

export function useAnimeData() {
  const [items, setItems] = useState<Anime[]>(localData as unknown as Anime[]);
  const [remoteUsed, setRemoteUsed] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  useEffect(() => {
    let cancelled = false;
    const load = async (p: number) => {
      const r = await fetch(`/api/anilist?page=${p}&perPage=50`, { cache: 'no-store' }).then(r => r.json()).catch(() => null);
      if (!r || cancelled) return;
      const newItems = (Array.isArray(r.items) ? r.items : []).filter((a: Anime) => a && a.id && a.title && a.coverImage && Array.isArray(a.genres) && a.genres.length > 0);
      if (newItems.length) {
        setItems(prev => {
          const seen = new Set(prev.map(x => x.id));
          const merged = [...prev, ...newItems.filter((x: Anime) => !seen.has(x.id))];
          return merged;
        });
        setRemoteUsed(true);
      }
      setHasNext(Boolean(r?.pageInfo?.hasNextPage));
      setPage(Number(r?.pageInfo?.nextPage || p + 1));
    };
    load(1);
    return () => { cancelled = true; };
  }, []);
  // Expose a loader to keep fetching next pages on demand
  const loadMore = async () => {
    if (!hasNext) return;
    await fetch(`/api/anilist?page=${page}&perPage=50`, { cache: 'no-store' }).then(r => r.json()).then((r) => {
      const newItems = (Array.isArray(r.items) ? r.items : []).filter((a: Anime) => a && a.id && a.title && a.coverImage && Array.isArray(a.genres) && a.genres.length > 0);
      if (newItems.length) {
        setItems(prev => {
          const seen = new Set(prev.map(x => x.id));
          return [...prev, ...newItems.filter((x: Anime) => !seen.has(x.id))];
        });
        setRemoteUsed(true);
      }
      setHasNext(Boolean(r?.pageInfo?.hasNextPage));
      setPage(Number(r?.pageInfo?.nextPage || page + 1));
    }).catch(() => {});
  };
  return { items, remoteUsed, loadMore, hasNext } as const;
}


