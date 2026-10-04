export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}

export interface Booking {
  // FIX: id/userId/showId were `number` — the backend uses ids like
  // "BK-<uuid>" / "SW-<uuid>", and `Number("SW-...")` is NaN.
  id?: string;
  userId?: string;
  showId: string;
  seatNumbers: string[];
  numberOfTickets: number;
  totalAmount?: number;
  bookingDate?: string;
  status?: BookingStatus;
}