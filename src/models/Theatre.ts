export enum TheatreStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface Theatre {
  // FIX: was `id?: number` — the backend generates ids like "TH-<uuid>".
  id?: string;
  name: string;
  location: string;
  capacity: number;
  status: TheatreStatus;
}