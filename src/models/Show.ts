export enum ShowStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Show {
  // FIX: id/movieId/theatreId were `number` — the backend uses ids like
  // "SW-<uuid>" / "MV-<uuid>" / "TH-<uuid>".
  id?: string;
  movieId: string;
  theatreId: string;
  showDate: string;
  showTime: string;
  ticketPrice: number;
  status: ShowStatus;
}