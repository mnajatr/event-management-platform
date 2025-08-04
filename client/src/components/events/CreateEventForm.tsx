"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { eventCategories } from "@/constants/event";
import { createEvent } from "@/lib/api/events";
import {
  createEventSchema,
  TCreateEventPayload,
  TCreateEventSchema,
} from "@/lib/validators/createEvent.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { DatePickerFormField } from "./DatePickerFormField";
import { toast } from "sonner";

export const CreateEventForm = () => {
  const router = useRouter();

  const form = useForm<TCreateEventSchema>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      name: "",
      category: "TECHNOLOGY",
      location: "",
      description: "",
      basePrice: "0",
      totalSeats: "1",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createEvent,
    onSuccess: (data) => {
      toast.success("Event berhasil dibuat!");
      router.push(`/events/${data.id}`);
    },
    onError: (error) => {
      toast.error("Gagal membuat event.", {
        description: error.message,
      });
    },
  });

  function onSubmit(values: TCreateEventSchema) {
    const tranformedValues: TCreateEventPayload = {
      ...values,
      basePrice: Number(values.basePrice),
      totalSeats: Number(values.totalSeats),
    };
    mutate(tranformedValues);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Event</FormLabel>
              <FormControl>
                <Input placeholder="Tech meetup" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {eventCategories.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item.charAt(0).toUpperCase() +
                        item.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lokasi</FormLabel>
              <FormControl>
                <Input placeholder="Bandung Asia Afrika" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <DatePickerFormField name="startDate" label="Tanggal Mulai" />
          <DatePickerFormField name="endDate" label="Tanggal Berakhir" />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Jelaskan tentang event Anda..."
                  className="resize-y"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="basePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Harga Tiket (Rp)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="50000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="totalSeats"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jumlah Kursi</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Membuat Event..." : "Buat Event"}
        </Button>
      </form>
    </Form>
  );
};
