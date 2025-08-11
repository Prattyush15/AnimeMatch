import { NextResponse } from 'next/server';

// Ensure this route is always dynamic on Vercel and not cached
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

const ANILIST_GQL = 'https://graphql.anilist.co';

export async function GET(request: Request) {
  // Supports pagination so the client can keep loading without a hard end
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get('page') || '1'));
  const perPage = Math.min(50, Math.max(1, Number(searchParams.get('perPage') || '50')));

  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { currentPage perPage lastPage hasNextPage total }
        media(type: ANIME, isAdult: false, sort: POPULARITY_DESC) {
          id
          title { romaji }
          genres
          episodes
          seasonYear
          coverImage { extraLarge large medium }
          trailer { id site }
          averageScore
          description(asHtml: false)
        }
      }
    }
  `;
  try {
    const res = await fetch(ANILIST_GQL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { page, perPage } }),
      // Avoid Next caching issues for paginated pages; rely on AniList performance
      cache: 'no-store',
    });
    const json = await res.json();
    const pageInfo = json?.data?.Page?.pageInfo || { hasNextPage: false, currentPage: page };
    const raw = json?.data?.Page?.media ?? [];
    const items = raw.map((m: any) => ({
      id: String(m.id),
      title: m.title?.romaji ?? 'Unknown',
      synopsis: m.description ?? '',
      genres: m.genres ?? [],
      episodes: m.episodes ?? null,
      coverImage: m.coverImage?.extraLarge ?? m.coverImage?.large ?? m.coverImage?.medium ?? '',
      year: m.seasonYear ?? null,
      trailer: m.trailer ? { site: m.trailer.site, id: m.trailer.id } : undefined,
      score: m.averageScore ?? null,
    }));
    return NextResponse.json({
      items,
      pageInfo: {
        hasNextPage: Boolean(pageInfo.hasNextPage),
        nextPage: pageInfo.hasNextPage ? Number(pageInfo.currentPage || page) + 1 : null,
        currentPage: Number(pageInfo.currentPage || page),
      },
    });
  } catch (e) {
    return NextResponse.json({ items: [], pageInfo: { hasNextPage: false, nextPage: null, currentPage: page } }, { status: 200 });
  }
}


