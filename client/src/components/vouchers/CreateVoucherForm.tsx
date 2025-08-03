"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  createVoucherSchema,
  TCreateVoucherSchema,
  TCreateVoucherPayload,
} from "@/lib/validators/createVoucher.schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatePickerFormField } from "../events/DatePickerFormField";
import { createVoucher } from "@/lib/api/vouchers";

interface CreateVoucherFormProps {
  eventId: number;
}

export const CreateVoucherForm = ({ eventId }: CreateVoucherFormProps) => {
  const router = useRouter();

  const form = useForm<TCreateVoucherSchema>({
    resolver: zodResolver(createVoucherSchema),
    defaultValues: {
      eventId: eventId,
      voucherCode: "",
      discountValue: "0",
      usageLimit: "10",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createVoucher,
    onSuccess: (data) => {
      alert("Voucher berhasil dibuat!");
      router.push(`/dashboard/events/${eventId}`);
    },
    onError: (error) => {
      alert(`Error ${error.message}`);
    },
  });

  function onSubmit(values: TCreateVoucherSchema) {
    const transformedValues: TCreateVoucherPayload = {
      ...values,
      discountValue: Number(values.discountValue),
      usageLimit: Number(values.usageLimit),
    };
    mutate(transformedValues);
  }
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="voucherCode"
          render={({ field }) => (
            <FormItem>
              <Input placeholder="DISKONBARU25" {...field} />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="discountValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nilai Diskon (Rp)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="25000" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="usageLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Batas Pemakaian</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <DatePickerFormField
              name="startDate"
              label="Tanggal Mulai Berlaku"
            />
            <DatePickerFormField name="endDate" label="Tanggal Berakhir" />
          </div>
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Membuat voucher..." : "Buat Voucher"}
        </Button>
      </form>
    </FormProvider>
  );
};
