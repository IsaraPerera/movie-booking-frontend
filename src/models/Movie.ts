export enum MovieStatus {
  UPCOMING = 'UPCOMING',
  NOW_SHOWING = 'NOW_SHOWING',
  ENDED = 'ENDED'
}

export interface Movie {
  // FIX: was `id?: number` — the backend generates ids like "MV-<uuid>",
  // never a number.
  id?: string;
  title: string;
  description: string;
  duration: number;
  language: string;
  genre: string;
  releaseDate: string;
  status: MovieStatus;
}