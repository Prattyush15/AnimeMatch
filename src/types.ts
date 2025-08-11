export type StreamingLink = { name: string; url: string };

export type Anime = {
  id: string;
  title: string;
  synopsis: string;
  genres: string[];
  episodes: number | null;
  coverImage: string;
  year: number | null;
  streaming?: StreamingLink[];
  trailer?: { site: string; id: string };
  score?: number | null;
};


