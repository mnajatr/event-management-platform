"use client";

import { useParams } from "next/navigation";
import { CreateVoucherForm } from "@/components/vouchers/CreateVoucherForm";

export default function CreateVoucherPage() {
  const params = useParams();
  const eventId = Number(params.eventId);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold">Buat Voucher Baru</h1>
        <p className="text-muted-foreground">
          Tambahkan voucher baru untuk event Anda.
        </p>
      </div>

      {eventId ? (
        <CreateVoucherForm eventId={eventId} />
      ) : (
        <div>Loading atau Event ID tidak valid...</div>
      )}
    </div>
  );
}
