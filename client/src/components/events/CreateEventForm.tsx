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
import { createEvent, updateEvent } from "@/lib/api/events";
import {
  createEventSchema,
  TCreateEventPayload,
  TCreateEventSchema,
} from "@/lib/validators/createEvent.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { DatePickerFormField } from "./DatePickerFormField";
import { toast } from "sonner";
import { TEvent } from "@/types/event.type";

interface CreateEventFormProps {
  initialData?: TEvent;
}

export const CreateEventForm = ({ initialData }: CreateEventFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditMode = !!initialData;

  const form = useForm<TCreateEventSchema>({
    resolver: zodResolver(createEventSchema),
    defaultValues: isEditMode
      ? {
          name: initialData.name,
          category: initialData.category,
          location: initialData.location,
          description: initialData.description,
          startDate: new Date(initialData.startDate),
          endDate: new Date(initialData.endDate),
          basePrice: String(initialData.basePrice),
          totalSeats: String(initialData.availableSeats),
        }
      : {
          name: "",
          category: "TECHNOLOGY",
          location: "",
          description: "",
          basePrice: "1",
          totalSeats: "1",
        },
  });

  const { mutate: perfomeCreate, isPending: isCreating } = useMutation({
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

  const { mutate: performUpdate, isPending: isUpdating } = useMutation({
    mutationFn: updateEvent,
    onSuccess: (data) => {
      toast.success("Event berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
      router.push("/dashboard/my-events");
    },
    onError: (error) => {
      toast.error("Gagal memperbarui event.", {
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
    if (isEditMode) {
      performUpdate({ eventId: initialData.id, data: tranformedValues });
    } else {
      perfomeCreate(tranformedValues);
    }
  }

  const isPending = isCreating || isUpdating;

  return (
    <FormProvider {...form}>
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
          {isPending
            ? isEditMode
              ? "Memperbarui..."
              : "Membuat..."
            : isEditMode
              ? "Simpan perubahan"
              : "Buat Event"}
        </Button>
      </form>
    </FormProvider>
  );
};
