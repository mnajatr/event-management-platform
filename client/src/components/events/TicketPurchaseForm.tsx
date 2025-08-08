"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { TTicketType } from "@/types/event.type";
import { createTransaction } from "@/lib/api/transactions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface TicketPurchaseFormProps {
  eventId: number;
  ticketTypes: TTicketType[];
}

export const TicketPurchaseForm = ({
  eventId,
  ticketTypes,
}: TicketPurchaseFormProps) => {
  const router = useRouter();
  const [selectedTicket, setSelectedTicket] = useState<TTicketType | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);

  const { mutate: performTransaction, isPending } = useMutation({
    mutationFn: createTransaction,
    onSuccess: (data) => {
      toast.success("Pesanan dibuat!", {
        description: "Anda akan diarahkan ke halaman pembayaran.",
      });
      router.push(`/transactions/${data.id}`);
    },
    onError: (error) => {
      toast.error("Gagal membuat pesanan.", {
        description: error.message,
      });
    },
  });

  const handleTicketTypeChange = (ticketId: string) => {
    const ticket = ticketTypes.find((t) => t.id === Number(ticketId));
    setSelectedTicket(ticket || null);
  };

  const handlePurchase = () => {
    if (!selectedTicket || quantity < 1) {
      toast.warning("Silakan pilih jenis tiket dan jumlah yang valid.");
      return;
    }
    performTransaction({
      eventId,
      ticketTypeId: selectedTicket.id,
      quantity,
    });
  };

  const totalPrice = selectedTicket ? selectedTicket.price * quantity : 0;

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
      <h3 className="text-2xl font-semibold leading-none tracking-tight">
        Beli Tiket
      </h3>
      <div>
        <label className="text-sm font-medium">Jenis Tiket</label>
        <Select onValueChange={handleTicketTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih jenis tiket" />
          </SelectTrigger>
          <SelectContent>
            {ticketTypes.map((ticket) => (
              <SelectItem key={ticket.id} value={String(ticket.id)}>
                {ticket.name} - Rp {ticket.price.toLocaleString("id-ID")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label htmlFor="quantity" className="text-sm font-medium">
          Jumlah
        </label>
        <Input
          id="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          disabled={!selectedTicket}
        />
      </div>
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between font-bold text-lg">
          <span>Total Harga</span>
          <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
        </div>
        <Button
          className="w-full"
          onClick={handlePurchase}
          disabled={isPending || !selectedTicket}
        >
          {isPending ? "Memproses..." : "Beli Sekarang"}
        </Button>
      </div>
    </div>
  );
};
