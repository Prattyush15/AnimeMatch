"use client";
import SwipeDeck from '@/components/SwipeDeck';
import KeyboardHints from '@/components/KeyboardHints';
import { useEffect } from 'react';
import GenreQuiz from '@/components/GenreQuiz';
import { hasPreferences } from '@/lib/storage';

export default function HomePage() {
  useEffect(() => {
    // Ensure any filter is cleared on home to show full deck
    delete (document.body.dataset as any).filter;
  }, []);
  // Keyboard shortcuts: L to-watch, S pass, W watched
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      const key = e.key.toLowerCase();
      if (key === 'l') document.querySelector<HTMLButtonElement>('button[aria-label="Add to To-Watch"]')?.click();
      if (key === 's') document.querySelector<HTMLButtonElement>('button[aria-label="Pass"]')?.click();
      if (key === 'w') document.querySelector<HTMLButtonElement>('button[aria-label="Mark watched"]')?.click();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* Home acts as recommendations; quiz first-run gate lives in deck too, but show entry point here */}
      <SwipeDeck />
      <KeyboardHints />
    </div>
  );
}


