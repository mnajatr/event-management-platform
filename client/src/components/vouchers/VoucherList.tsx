"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getVouchersByEventId } from "@/lib/api/vouchers";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface VoucherListProps {
  eventId: number;
}

import React from "react";

export const VoucherList = ({ eventId }: VoucherListProps) => {
  const {
    data: vouchers,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["vouchers", eventId],
    queryFn: () => getVouchersByEventId(eventId),
  });

  if (isLoading) {
    return <div>Loadign vouchers... </div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Daftar Voucher
        </h3>
        <Button asChild>
          <Link href={`/dashboard/events/${eventId}/vouchers/create`}>
            Buat Voucher Baru
          </Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kode</TableHead>
            <TableHead>Diskon (Rp)</TableHead>
            <TableHead>Batas Pakai</TableHead>
            <TableHead>Berlaku Sampai</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vouchers && vouchers.length > 0 ? (
            vouchers.map((voucher) => (
              <TableRow key={voucher.id}>
                <TableCell className="font-medium">
                  {voucher.voucherCode}
                </TableCell>
                <TableCell>
                  {voucher.discountValue.toLocaleString("id-ID")}
                </TableCell>
                <TableCell>{`${voucher.usedCount} / ${voucher.usageLimit}`}</TableCell>
                <TableCell>
                  {dayjs(voucher.endDate).format("DD MM YYYY")}
                </TableCell>
                <TableCell>
                  <Badge variant={voucher.isActive ? "default" : "destructive"}>
                    {voucher.isActive ? "Aktif" : "Tidak Aktif"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Belum ada voucher untuk event ini.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
