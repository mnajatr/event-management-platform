"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getTransactionById, uploadPaymentProof } from "@/lib/api/transactions";
import { useState, useEffect } from "react";
import { differenceInSeconds } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Helper function untuk format waktu hitung mundur
const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
};

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const transactionId = Number(params.transactionId);

  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [countdown, setCountdown] = useState<number>(0);

  const {
    data: transaction,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["transaction", transactionId],
    queryFn: () => getTransactionById(transactionId),
    enabled: !!transactionId,
  });

  // Logika untuk hitung mundur
  useEffect(() => {
    if (transaction?.paymentDeadline) {
      const interval = setInterval(() => {
        const secondsLeft = differenceInSeconds(
          new Date(transaction.paymentDeadline!),
          new Date()
        );
        setCountdown(secondsLeft > 0 ? secondsLeft : 0);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [transaction]);

  const { mutate: performUpload, isPending } = useMutation({
    mutationFn: uploadPaymentProof,
    onSuccess: () => {
      toast.success("Bukti pembayaran berhasil diunggah!", {
        description: "Silakan tunggu konfirmasi dari penyelenggara.",
      });
      // Arahkan ke halaman "My Tickets" (akan kita buat nanti)
      router.push("/my-tickets");
    },
    onError: (error) =>
      toast.error("Gagal mengunggah.", { description: error.message }),
  });

  const handleUpload = () => {
    if (!paymentProof) {
      return toast.error("Silakan pilih file bukti pembayaran.");
    }
    const formData = new FormData();
    formData.append("paymentProof", paymentProof);
    performUpload({ transactionId, formData });
  };

  if (isLoading)
    return <div className="container mx-auto py-8 text-center">Loading...</div>;
  if (isError)
    return (
      <div className="container mx-auto py-8 text-center">
        Error: {error.message}
      </div>
    );

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Selesaikan Pembayaran</CardTitle>
          <CardDescription>
            Selesaikan pembayaran Anda sebelum waktu habis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-destructive text-destructive-foreground p-4 text-center">
            <div className="text-sm">Batas Waktu Pembayaran</div>
            <div className="text-4xl font-bold tracking-tighter">
              {countdown > 0 ? formatTime(countdown) : "Waktu Habis"}
            </div>
          </div>
          <div className="border-t border-b py-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Pembayaran</span>
              <span className="font-bold">
                Rp {transaction?.finalAmount.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="text-sm text-muted-foreground pt-2">
              Silakan transfer ke rekening berikut: <br />
              <span className="font-semibold text-foreground">
                BCA 1234567890 a/n Event Platform
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="payment-proof" className="text-sm font-medium">
              Unggah Bukti Pembayaran
            </label>
            <Input
              id="payment-proof"
              type="file"
              accept="image/*"
              onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleUpload}
            disabled={isPending || countdown <= 0}
          >
            {isPending ? "Mengunggah..." : "Konfirmasi Pembayaran"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
