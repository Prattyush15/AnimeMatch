"use client";
import { useEffect, useMemo, useState } from 'react';
import { useAnimeData } from '@/lib/data';
import { getLikes, getPreferredGenres, getWatched, getFeedbackMap, setFeedback, markSkip, toggleWatched } from '@/lib/storage';
import { scoreByGenres, applyFeedbackBoost } from '@/lib/recommend';
import type { Anime } from '@/types';
import AnimeCard from '@/components/AnimeCard';

export default function RecommendPage() { return null }


