/** LocalStorage helpers for AnimeMatch (SSR-safe).
 * All functions guard for window existence and JSON parse errors.
 */

const LIKES_KEY = 'animematch_likes';
const SKIPS_KEY = 'animematch_skips';
const PREFS_KEY = 'animematch_genres';
const WATCHED_KEY = 'animematch_watched';
const FEEDBACK_KEY = 'animematch_feedback'; // map id -> 'like' | 'dislike'
const HIDE_WATCHED_KEY = 'animematch_hide_watched';

const isBrowser = typeof window !== 'undefined';
const isAniListId = (id: string) => /^\d+$/.test(id);

function safeReadArray(key: string): string[] {
  if (!isBrowser) return [];
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeWriteArray(key: string, value: string[]): void {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota or serialization errors
  }
}

export function getLikes(): string[] {
  const raw = safeReadArray(LIKES_KEY);
  const cleaned = raw.filter(isAniListId);
  if (isBrowser && cleaned.length !== raw.length) safeWriteArray(LIKES_KEY, cleaned);
  return cleaned;
}

export function getSkips(): string[] {
  const raw = safeReadArray(SKIPS_KEY);
  const cleaned = raw.filter(isAniListId);
  if (isBrowser && cleaned.length !== raw.length) safeWriteArray(SKIPS_KEY, cleaned);
  return cleaned;
}

export function toggleLike(id: string): void {
  const likes = new Set(getLikes());
  if (likes.has(id)) {
    likes.delete(id);
  } else {
    likes.add(id);
  }
  safeWriteArray(LIKES_KEY, Array.from(likes));
}

export function markSkip(id: string): void {
  const skips = new Set(getSkips());
  if (!skips.has(id)) {
    skips.add(id);
    safeWriteArray(SKIPS_KEY, Array.from(skips));
  }
}

export function unmarkSkip(id: string): void {
  const skips = new Set(getSkips());
  if (skips.has(id)) {
    skips.delete(id);
    safeWriteArray(SKIPS_KEY, Array.from(skips));
  }
}

export function resetAll(): void {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem(LIKES_KEY);
    window.localStorage.removeItem(SKIPS_KEY);
    window.localStorage.removeItem(PREFS_KEY);
    window.localStorage.removeItem(WATCHED_KEY);
    window.localStorage.removeItem(FEEDBACK_KEY);
  } catch {
    // ignore
  }
}

/** User preferred genres (cold start quiz) */
export function getPreferredGenres(): string[] {
  return safeReadArray(PREFS_KEY);
}

export function setPreferredGenres(genres: string[]): void {
  safeWriteArray(PREFS_KEY, Array.from(new Set(genres)));
}

export function hasPreferences(): boolean {
  return getPreferredGenres().length > 0;
}

/** Watched tracking */
export function getWatched(): string[] {
  const raw = safeReadArray(WATCHED_KEY);
  const cleaned = raw.filter(isAniListId);
  if (isBrowser && cleaned.length !== raw.length) safeWriteArray(WATCHED_KEY, cleaned);
  return cleaned;
}

export function toggleWatched(id: string): void {
  const set = new Set(getWatched());
  if (set.has(id)) set.delete(id); else set.add(id);
  safeWriteArray(WATCHED_KEY, Array.from(set));
}

type FeedbackValue = 'like' | 'dislike';

export function getFeedbackMap(): Record<string, FeedbackValue> {
  if (!isBrowser) return {};
  try {
    const raw = window.localStorage.getItem(FEEDBACK_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    if (!(typeof parsed === 'object' && parsed)) return {};
    const entries = Object.entries(parsed as Record<string, FeedbackValue>);
    const cleanedEntries = entries.filter(([id]) => isAniListId(id));
    const cleaned = Object.fromEntries(cleanedEntries) as Record<string, FeedbackValue>;
    if (cleanedEntries.length !== entries.length) {
      window.localStorage.setItem(FEEDBACK_KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch {
    return {};
  }
}

export function setFeedback(id: string, value: FeedbackValue): void {
  if (!isBrowser) return;
  try {
    const map = getFeedbackMap();
    map[id] = value;
    window.localStorage.setItem(FEEDBACK_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

export function clearFeedback(id: string): void {
  if (!isBrowser) return;
  const map = getFeedbackMap();
  delete map[id];
  try {
    window.localStorage.setItem(FEEDBACK_KEY, JSON.stringify(map));
  } catch {}
}

export function getWatchedLikedIds(): string[] {
  const map = getFeedbackMap();
  return Object.keys(map).filter(id => map[id] === 'like');
}

export function getWatchedDislikedIds(): string[] {
  const map = getFeedbackMap();
  return Object.keys(map).filter(id => map[id] === 'dislike');
}

export function getHideWatched(): boolean {
  if (!isBrowser) return true; // default hide
  try {
    const raw = window.localStorage.getItem(HIDE_WATCHED_KEY);
    return raw === null ? true : raw === 'true';
  } catch { return true; }
}

export function setHideWatched(value: boolean): void {
  if (!isBrowser) return;
  try { window.localStorage.setItem(HIDE_WATCHED_KEY, String(value)); } catch {}
}


