"use client";
import Image from 'next/image';
import { Badge, Button, Card, CardContent, CardHeader } from '@/components/ui';
import type { Anime } from '@/types';
import { useState } from 'react';

type Props = {
  anime: Anime;
  onLike?: () => void;
  onSkip?: () => void;
  onWatched?: () => void;
  readOnly?: boolean;
  status?: 'liked' | 'disliked';
};

export default function AnimeCard({ anime, onLike, onSkip, onWatched, readOnly = false, status }: Props) {
  const [imgLoaded, setImgLoaded] = useState(false);
  // Guard invalid or placeholder data
  const validTitle = anime.title && anime.title.trim().length > 0;
  const validImage = typeof anime.coverImage === 'string' && anime.coverImage.startsWith('http');
  return (
    <Card className="max-w-md w-full">
      <div className="relative h-80 w-full bg-gray-100">
        {validImage ? (
          <Image
            src={anime.coverImage}
            alt={(validTitle ? anime.title : 'Anime') + ' cover'}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
            onLoad={() => setImgLoaded(true)}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-gray-400">No image</div>
        )}
        {!imgLoaded && <div className="absolute inset-0 animate-pulse bg-gray-100" />}
        {status && (
          <div className={
            'pointer-events-none absolute left-3 top-3 rounded-md px-2 py-0.5 text-xs font-semibold ' +
            (status === 'liked' ? 'bg-green-600 text-white' : 'bg-red-600 text-white')
          }>
            {status === 'liked' ? 'Liked' : 'Disliked'}
          </div>
        )}
      </div>
      <CardHeader>
        <h2 className="text-xl font-semibold">{validTitle ? anime.title : 'Untitled'}</h2>
        {typeof anime.score === 'number' && (
          <div className="mt-1 text-sm text-gray-600" aria-label={`AniList score ${anime.score}`}>
            Score: {anime.score}
          </div>
        )}
        <div className="mt-2 flex flex-wrap gap-2">
          {anime.genres.map((g) => (
            <Badge key={g} aria-label={`Genre ${g}`}>{g}</Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ExpandableSynopsis text={anime.synopsis} />
        <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
          <span>{anime.episodes ? `${anime.episodes} ep` : 'Ongoing'}</span>
          <span>{anime.year ?? ''}</span>
        </div>
        {/* Streaming badges intentionally removed per product requirements */}
        {!readOnly && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Button aria-label="Add to To-Watch" onClick={onLike}>To Watch</Button>
            <Button aria-label="Pass" variant="outline" onClick={onSkip}>Pass</Button>
            {onWatched && <Button aria-label="Mark watched" variant="outline" onClick={onWatched}>Watched</Button>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ExpandableSynopsis({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const clean = (text || '').replace(/<[^>]+>/g, '');
  if (!clean) return null;
  return (
    <div>
      <p className={open ? 'text-gray-700' : 'line-clamp-3 text-gray-700'}>{clean}</p>
      <button className="mt-1 text-xs text-blue-700 underline" onClick={() => setOpen(v => !v)} aria-label={open ? 'Show less' : 'Read more'}>
        {open ? 'Show less' : 'Read more'}
      </button>
    </div>
  );
}


