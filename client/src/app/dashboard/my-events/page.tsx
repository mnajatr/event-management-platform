"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Pencil, Trash2 } from "lucide-react";
import { getMyEvents } from "@/lib/api/events";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TEvent } from "@/types/event.type";
import { vendored } from "next/dist/server/route-modules/app-page/module.compiled";

export default function MyEventsPage() {
  const {
    data: events,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["my-events"],
    queryFn: getMyEvents,
  });

  if (isLoading) {
    return <div className="container mx-auto py-8">Loading event Anda...</div>;
  }

  if (isError) {
    return <div className="container mx-auto py-8">Error: {error.message}</div>;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Event Saya</h1>
          <p className="text-muted-foreground">
            Kelola semua event yang telah Anda buat.
          </p>
        </div>
        <Button asChild>
          <Link href={"/events/create"}>Buat Event Baru</Link>
        </Button>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Event</TableHead>
              <TableHead>Tanggal Mulai</TableHead>
              <TableHead>Harga (Rp)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events && events.length > 0 ? (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>
                    {dayjs(event.startDate).format("DD MM YYYY")}
                  </TableCell>
                  <TableCell>
                    <Badge>{event.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant={"outline"} size={"icon"} asChild>
                      <Link href={`/dashboard/events/${event.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant={"destructive"} size={"icon"}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  Anda belum membuat event apapun
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
