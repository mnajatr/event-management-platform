import api from "../axios";
import { TTransaction } from "@/types/transaction.type";

interface ICreateTransaction {
  eventId: number;
  ticketTypeId: number;
  quantity: number;
}

export const createTransaction = async (
  data: ICreateTransaction
): Promise<TTransaction> => {
  try {
    const response = await api.post<{ data: TTransaction }>(
      "/transactions",
      data
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to create transaction:", error);
    throw new Error("Gagal memulai transaksi.");
  }
};
