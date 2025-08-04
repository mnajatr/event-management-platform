import axios from "axios";
import { TCreateVoucherPayload } from "../validators/createVoucher.schema";
import { TVoucher } from "@/types/voucher.type";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const createVoucher = async (
  data: TCreateVoucherPayload
): Promise<TVoucher> => {
  try {
    const response = await axios.post<{ data: TVoucher }>(
      `${API_URL}/vouchers`,
      data
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to create voucher", error);
    throw new Error("Gagal membuat vouhcer.");
  }
};

export const getVouchersByEventId = async (
  eventId: number
): Promise<TVoucher[]> => {
  try {
    const response = await axios.get<{ data: TVoucher[] }>(
      `${API_URL}/vouchers/event/${eventId}`
    );
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch vouchers ${error}`);
    throw new Error("Gagal mengambil data voucher.");
  }
};
