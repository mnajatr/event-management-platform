export type TransactionStatus = "PENDING"| "WAITING_PAYMENT"| "PAID"| "COMPLETED"| "CANCELLED"| "EXPIRED";

export type Transaction = {
  id: number;
  quantity: number;
  finalAmount: number;
  status: TransactionStatus;
  paymentProof?: string | null;
  customer: {
    fullName: string;
    email: string;
    profilePicture: string;
  };
};

export type TTransaction = {
  id: number;
  customerId: number;
  eventId: number;
  ticketTypeId: number;
  quantity: number;
  baseAmount: number;
  finalAmount: number;
  status: string;
  paymentDeadline: string | null;
  createdAt: string;
};
