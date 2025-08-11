import type { Anime } from '@/types';

/**
 * Compute naive content-based scores by genre overlap.
 * Score is (# overlapping genres with any liked title) / (total unique genres in union).
 * Returns array sorted by score descending.
 * TODO(phase2): incorporate weights, recency, embeddings, and cold-start survey.
 */
export function scoreByGenres(referenceIdsOrGenres: string[], all: Anime[]): Array<{ id: string; score: number; reasons: string[] }> {
  // referenceIdsOrGenres may be liked IDs or explicit genres
  const idSet = new Set(referenceIdsOrGenres);
  const refAnimes = all.filter(a => idSet.has(a.id));
  const referenceGenres = new Set<string>(
    refAnimes.length > 0 ? refAnimes.flatMap(a => a.genres) : referenceIdsOrGenres
  );
  if (referenceGenres.size === 0) return all.map(a => ({ id: a.id, score: 0, reasons: [] }));

  return all
    .map(anime => {
      const union = new Set([...referenceGenres, ...anime.genres]);
      let overlap = 0;
      const reasons: string[] = [];
      for (const g of anime.genres) if (referenceGenres.has(g)) overlap += 1;
      if (overlap > 0) reasons.push(`Shares ${overlap} genre${overlap > 1 ? 's' : ''}`);
      const score = union.size === 0 ? 0 : overlap / union.size;
      return { id: anime.id, score, reasons };
    })
    .sort((a, b) => b.score - a.score);
}

export function applyFeedbackBoost(
  base: Array<{ id: string; score: number; reasons: string[] }>,
  likedIds: Set<string>,
  dislikedIds: Set<string>
) {
  return base.map(item => {
    let bonus = 0;
    if (likedIds.has(item.id)) bonus += 0.2; // direct positive signal
    if (dislikedIds.has(item.id)) bonus -= 0.4; // strong negative
    return {
      ...item,
      score: Math.max(0, item.score + bonus),
      reasons: [
        ...item.reasons,
        likedIds.has(item.id) ? 'You liked this' : '',
        dislikedIds.has(item.id) ? 'You disliked this' : ''
      ].filter(Boolean)
    };
  }).sort((a, b) => b.score - a.score);
}

function mapScores(list: Array<{ id: string; score: number; reasons: string[] }>) {
  const map = new Map<string, { score: number; reasons: string[] }>();
  for (const item of list) map.set(item.id, { score: item.score, reasons: item.reasons });
  return map;
}

export function blendScores(
  primary: Array<{ id: string; score: number; reasons: string[] }>,
  secondary: Array<{ id: string; score: number; reasons: string[] }>,
  wPrimary: number,
  wSecondary: number
) {
  const a = mapScores(primary);
  const b = mapScores(secondary);
  const ids = new Set<string>([...a.keys(), ...b.keys()]);
  const out: Array<{ id: string; score: number; reasons: string[] }> = [];
  for (const id of ids) {
    const sA = a.get(id)?.score ?? 0;
    const sB = b.get(id)?.score ?? 0;
    const score = wPrimary * sA + wSecondary * sB;
    const reasons: string[] = [];
    if (a.get(id)?.reasons?.length) reasons.push(...a.get(id)!.reasons);
    if (b.get(id)?.reasons?.length) reasons.push(...b.get(id)!.reasons);
    out.push({ id, score, reasons });
  }
  return out.sort((x, y) => y.score - x.score);
}


