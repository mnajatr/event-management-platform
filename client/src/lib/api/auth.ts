import api from "@/lib/axios";

export type ForgotPasswordResponse = {
  success: boolean;
  message: string;
  data?: { dev_link?: string };
};

export function requestPasswordReset(email: string) {
  return api.post<ForgotPasswordResponse>("/auth/forgot-password", { email });
}

export function submitNewPassword(token: string, password: string) {
  return api.post<{ message: string }>("/auth/reset-password", { token, password });
}