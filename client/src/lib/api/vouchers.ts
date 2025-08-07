import api from "../axios"; // GUNAKAN instance api, bukan axios langsung
import { TCreateVoucherPayload } from "../validators/createVoucher.schema";
import { TVoucher } from "@/types/voucher.type";

export const createVoucher = async (
  data: TCreateVoucherPayload
): Promise<TVoucher> => {
  try {
    const response = await api.post<{ data: TVoucher }>("/vouchers", data);
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
    const response = await api.get<{ data: TVoucher[] }>(
      `/vouchers/event/${eventId}`
    );
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch vouchers ${error}`);
    throw new Error("Gagal mengambil data voucher.");
  }
};
