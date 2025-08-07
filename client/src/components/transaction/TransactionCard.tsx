"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Image from "next/image";
import { TransactionStatus } from "@/types/transaction.type";

type TransactionCardProps = {
  id: number;
  customer: {
    fullName: string;
    email: string;
    profilePicture: string;
  };
  quantity: number;
  finalAmount: number;
  status: TransactionStatus;
  paymentProof?: string | null;
  onStatusChange?: (id: number, newStatus: TransactionStatus) => void;
};

export const TransactionCard = ({
  id,
  customer,
  quantity,
  finalAmount,
  status,
  paymentProof,
  onStatusChange,
}: TransactionCardProps) => {
  return (
    <Card className="w-full p-4">
      <CardHeader className="flex flex-row items-center gap-4">
        <Image
          src={customer.profilePicture}
          alt={customer.fullName}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div>
          <p className="font-semibold">{customer.fullName}</p>
          <p className="text-sm text-gray-500">{customer.email}</p>
        </div>
        <div className="ml-auto">
          <Select
            value={status}
            onValueChange={(value) =>
              onStatusChange?.(id, value as TransactionStatus)
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PAID">PAID</SelectItem>
              <SelectItem value="CANCELLED">CANCELLED</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col sm:flex-row justify-between pt-2">
        <p>
          🎫 <strong>{quantity}</strong> tickets
        </p>
        <p>💵 Rp {finalAmount.toLocaleString()}</p>
        {paymentProof && (
          <a
            href={paymentProof}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View payment proof
          </a>
        )}
      </CardContent>
    </Card>
  );
};