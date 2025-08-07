"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type Attendee = {
  id: number;
  ticketQuantity: number;
  totalPricePaid: number;
  status: string;
  user: {
    id: number;
    fullName: string;
    email: string;
    profilePicture: string;
  };
};

const statusOptions = ["REGISTERED", "ATTENDED", "NO_SHOW", "CANCELLED"] as const;

const AttendeesPage = () => {
  const { id } = useParams() as { id: string };
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendees = async () => {
    try {
      const res = await api.get(`/organizers/events/${id}/attendees`);
      setAttendees(res.data.data);
    } catch (error: unknown) {
      toast.error("Failed to load attendees");
      console.error(error instanceof Error ? error.message : "Failed to load attendees");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (attendeeId: number, newStatus: string) => {
    try {
      await api.patch(`/organizers/events/${id}/attendees/${attendeeId}`, {
        status: newStatus,
      });
      toast.success("Status updated");
      await fetchAttendees(); // ✅ Refresh state after patch
    } catch (error: unknown) {
      toast.error("Failed to update status");
      console.error(error instanceof Error ? error.message : "Error updating status");
    }
  };

  useEffect(() => {
    if (id) fetchAttendees();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4 mt-6">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-24 w-full max-w-2xl" />
        <Skeleton className="h-24 w-full max-w-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      <h2 className="text-2xl font-semibold">👥 Attendees</h2>

      {attendees.length === 0 ? (
        <p className="text-gray-500">No attendees found.</p>
      ) : (
        <div className="space-y-4">
          {attendees.map((att) => (
            <Card
              key={att.id}
              className="p-4 flex items-center justify-between max-w-2xl"
            >
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={att.user.profilePicture} />
                  <AvatarFallback>
                    {att.user.fullName?.[0] ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{att.user.fullName}</p>
                  <p className="text-sm text-gray-500">{att.user.email}</p>
                  <p className="text-sm text-muted-foreground">
                    {att.ticketQuantity} Tickets • Rp{att.totalPricePaid.toLocaleString()}
                  </p>
                  <p className="text-sm font-medium text-blue-600 mt-1">
                    Status: {att.status}
                  </p>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Update Status
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {statusOptions.map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => handleStatusUpdate(att.id, status)}
                    >
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendeesPage;