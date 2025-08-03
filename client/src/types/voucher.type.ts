export type TVoucher = {
  id: number;
  eventId: number;
  organizerId: number;
  voucherCode: string;
  discountValue: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
};
