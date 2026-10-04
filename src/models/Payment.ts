export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface Payment {
  // FIX: id/bookingId were `number` — the backend uses ids like
  // "PM-<uuid>" / "BK-<uuid>".
  id?: string;
  bookingId: string;
  amount: number;
  paymentDate?: string;
  paymentMethod: string;
  status: PaymentStatus;
}