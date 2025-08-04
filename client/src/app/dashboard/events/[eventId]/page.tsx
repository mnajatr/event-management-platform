"use client";

import { useParams } from "next/navigation";
import { VoucherList } from "@/components/vouchers/VoucherList";

export default function EventManagmentPage() {
  const params = useParams();
  const eventId = Number(params.eventId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold">Manajemen Event</h1>
        <p className="text-muted-foreground">
          Kelola voucher dan lihat statstik untuk event Anda.
        </p>
      </div>

      {eventId ? (
        <VoucherList eventId={eventId} />
      ) : (
        <div>Loading atau Event ID tidak valid...</div>
      )}
    </div>
  );
}
