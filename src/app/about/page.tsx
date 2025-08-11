"use client";
import ResetControls from '@/components/ResetControls';
import GenreQuiz from '@/components/GenreQuiz';
import { useState } from 'react';

export default function AboutPage() {
  const [showQuiz, setShowQuiz] = useState(false);
  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-2xl font-semibold">How to use AnimeMatch</h1>
      <p className="mb-3">
        Build your personal To‑Watch list and get smart recommendations. AnimeMatch orders cards by your
        genre preferences and feedback (likes, dislikes, watched).
      </p>
      <h2 className="mt-6 mb-2 text-xl font-semibold">Basics</h2>
      <ul className="list-disc pl-5 space-y-1 text-gray-800">
        <li>On Home, drag right or press L to add to <strong>To‑Watch</strong>. Drag left or press S to <strong>Pass</strong>.</li>
        <li>Press W or use the button to mark an anime as <strong>Watched</strong>.</li>
        <li>Use the <strong>To‑Watch</strong> page to manage your list. Marking watched moves it to <strong>Watched</strong>.</li>
        <li>Click “Not for me” anywhere to hide similar titles from recommendations.</li>
        <li>Undo appears briefly after each action.</li>
      </ul>
      <h2 className="mt-6 mb-2 text-xl font-semibold">Keyboard shortcuts</h2>
      <ul className="list-disc pl-5">
        <li>L = To‑Watch</li>
        <li>S = Pass</li>
        <li>W = Mark watched</li>
      </ul>
      <div className="mt-6">
        <ResetControls />
      </div>
      <div className="mt-6">
        {!showQuiz ? (
          <button className="rounded border px-3 py-2 text-sm hover:bg-gray-50" onClick={() => setShowQuiz(true)}>
            Edit genre preferences
          </button>
        ) : (
          <div className="mt-4">
            <GenreQuiz onDone={() => setShowQuiz(false)} />
          </div>
        )}
      </div>
    </div>
  );
}


