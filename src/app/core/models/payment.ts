export type PaymentStatus = 'PENDING' | 'PAID' | 'LATE';

export interface Payment {
  id: string;
  contractId: string;
  dueDate: string;
  paidDate: string | null;
  amount: number;
  status: PaymentStatus;
}

export interface PaymentRequest {
  dueDate: string;
  amount: number;
}
