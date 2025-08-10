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

export const getTransactionById = async (
  transactionId: number
): Promise<TTransaction> => {
  try {
    const response = await api.get<{ data: TTransaction }>(
      `/transactions/${transactionId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch transaction:", error);
    throw new Error("Gagal mengambil data transaksi.");
  }
};

// --- FUNGSI BARU ---
export const uploadPaymentProof = async ({
  transactionId,
  formData,
}: {
  transactionId: number;
  formData: FormData;
}): Promise<TTransaction> => {
  try {
    const response = await api.post<{ data: TTransaction }>(
      `/transactions/${transactionId}/proof`,
      formData
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to upload proof:", error);
    throw new Error("Gagal mengunggah bukti pembayaran.");
  }
};
