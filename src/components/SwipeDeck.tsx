"use client";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import type { Anime } from '@/types';
import localData from '@/data/anime.json';
import AnimeCard from './AnimeCard';
import { getLikes, getSkips, toggleLike, markSkip, resetAll, getPreferredGenres, hasPreferences, getWatched, toggleWatched, unmarkSkip, getWatchedDislikedIds } from '@/lib/storage';
import { useAnimeData } from '@/lib/data';
import { Button } from '@/components/ui';
import { useToast } from '@/components/Toast';
import { scoreByGenres, applyFeedbackBoost, blendScores } from '@/lib/recommend';
import { getFeedbackMap } from '@/lib/storage';
import GenreQuiz from '@/components/GenreQuiz';

const SWIPE_THRESHOLD = 120;

export default function SwipeDeck() {
  const fallbackAll: Anime[] = localData as unknown as Anime[];
  const [deck, setDeck] = useState<Anime[]>([]);
  const [index, setIndex] = useState(0);
  const { toast } = useToast();
  const [needsQuiz, setNeedsQuiz] = useState(false);
  const { items: remoteItems, loadMore, hasNext } = useAnimeData();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setNeedsQuiz(!hasPreferences());
    // remoteItems are provided by hook
    const onStorage = () => setRefreshKey(k => k + 1);
    const onFocus = () => setRefreshKey(k => k + 1);
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  useEffect(() => {
    const liked = getLikes();
    const skipped = new Set(getSkips());
    const watched = new Set(getWatched());
    const disliked = new Set(getWatchedDislikedIds());
    const all = (remoteItems.length ? remoteItems : fallbackAll);
    const filtered = all.filter(a => !liked.includes(a.id) && !skipped.has(a.id) && !watched.has(a.id) && !disliked.has(a.id));
    const prefs = getPreferredGenres();
    const reference = liked.length > 0 ? liked : prefs; // prioritize liked IDs if present
    // Cold start weighting: if fewer than 5 likes, weight genre quiz stronger
    const likes = getLikes();
    const prefsScores = scoreByGenres(getPreferredGenres(), filtered);
    const likeScores = scoreByGenres(likes, filtered);
    const base = likes.length < 5
      ? blendScores(prefsScores, likeScores, 0.7, 0.3)
      : likeScores;
    const fb = getFeedbackMap();
    const boosted = applyFeedbackBoost(base, new Set(Object.keys(fb).filter(id => fb[id] === 'like')), new Set(Object.keys(fb).filter(id => fb[id] === 'dislike')));
    const map = new Map(boosted.map(s => [s.id, s.score] as const));
    const ordered = [...filtered].sort((a, b) => (map.get(b.id) ?? 0) - (map.get(a.id) ?? 0));
    setDeck(ordered);
    setIndex(0);
  }, [remoteItems, refreshKey]);

  // Prefetch next pages when nearing end of deck
  useEffect(() => {
    if (hasNext && deck.length - index < 5) {
      loadMore();
    }
  }, [hasNext, deck, index, loadMore]);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-12, 0, 12]);
  const likeOpacity = useTransform(x, [40, 160], [0, 1]);
  const skipOpacity = useTransform(x, [-160, -40], [1, 0]);

  // Optional in-memory filtering based on activeGenres stored on body dataset
  const activeGenres = (typeof document !== 'undefined' && document.body.dataset.filter) ? document.body.dataset.filter.split(',').filter(Boolean) : [];
  const filteredDeck = activeGenres.length ? deck.filter(a => a.genres.some(g => activeGenres.includes(g))) : deck;
  const current = filteredDeck[index];
  const next = filteredDeck[index + 1];

  const advance = useCallback(() => setIndex(i => i + 1), []);

  const [undoStack, setUndoStack] = useState<{ id: string; action: 'like' | 'skip' | 'watched' }[]>([]);
  const handleDecision = useCallback((dir: 'left' | 'right') => {
    if (!current) return;
    if (dir === 'right') { toggleLike(current.id); setUndoStack(s => [{ id: current.id, action: 'like' }, ...s]); toast('Added to To‑Watch', { label: 'Undo', onClick: () => {
      toggleLike(current.id);
      setUndoStack(s => s.filter(u => !(u.id === current.id && u.action === 'like')));
    }}); }
    else { markSkip(current.id); setUndoStack(s => [{ id: current.id, action: 'skip' }, ...s]); toast('Passed', { label: 'Undo', onClick: () => {
      unmarkSkip(current.id);
      setUndoStack(s => s.filter(u => !(u.id === current.id && u.action === 'skip')));
    }}); }
    advance();
    x.set(0);
  }, [current, advance, x]);

  const markCurrentWatched = () => {
    if (!current) return;
    toggleWatched(current.id);
    setUndoStack(s => [{ id: current.id, action: 'watched' }, ...s]);
    // Prompt for like/dislike quick feedback
    toast('Marked watched', { label: 'Undo', onClick: () => {
      toggleWatched(current.id);
      setUndoStack(s => s.filter(u => !(u.id === current.id && u.action === 'watched')));
    }});
    advance();
    x.set(0);
  };

  const onDragEnd = (_: any, info: { offset: { x: number } }) => {
    const dx = info.offset.x;
    if (dx > SWIPE_THRESHOLD) handleDecision('right');
    else if (dx < -SWIPE_THRESHOLD) handleDecision('left');
    else x.set(0);
  };

  const reset = () => {
    resetAll();
    const liked = new Set(getLikes());
    const skipped = new Set(getSkips());
    const all = (remoteItems.length ? remoteItems : fallbackAll);
    setDeck(all.filter(a => !liked.has(a.id) && !skipped.has(a.id)));
    setIndex(0);
  };

  if (needsQuiz) {
    return <GenreQuiz onDone={() => { setNeedsQuiz(false); /* rebuild deck after quiz */ setIndex(0); }} />;
  }

  if (!current) {
    return (
      <div className="flex w-full max-w-md flex-col items-center rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        <p className="text-gray-700">You reached the end! 🎉</p>
        <Button className="mt-4" onClick={reset} aria-label="Reset deck">Reset</Button>
      </div>
    );
  }

  return (
    <div className="relative h-[36rem] w-full max-w-md">
      {next && (
        <div className="absolute inset-0 translate-y-2 scale-[0.98] opacity-70">
          <AnimeCard anime={next} readOnly />
        </div>
      )}
      <AnimatePresence initial={false} mode="popLayout">
        {current && (
          <motion.div
            key={current.id}
            className="absolute inset-0"
            style={{ x, rotate }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={onDragEnd}
          >
            <motion.div className="pointer-events-none absolute left-4 top-4 rounded-md border-2 border-green-600 px-3 py-1 text-sm font-bold text-green-700" style={{ opacity: likeOpacity }}>TO WATCH</motion.div>
            <motion.div className="pointer-events-none absolute right-4 top-4 rounded-md border-2 border-red-600 px-3 py-1 text-sm font-bold text-red-700" style={{ opacity: skipOpacity }}>PASS</motion.div>
            <AnimeCard
              anime={current}
              onLike={() => handleDecision('right')}
              onSkip={() => handleDecision('left')}
              onWatched={markCurrentWatched}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


