"use client";

import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type AttendeeCardProps = {
  attendee: {
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
  eventId: string;
};

export const AttendeeCard = ({ attendee, eventId }: AttendeeCardProps) => {
  const [status, setStatus] = useState(attendee.status);
  const [loading, setLoading] = useState(false);

  const handleUpdateStatus = async () => {
    try {
      setLoading(true);
      const res = await api.patch(
        `/organizers/events/${eventId}/attendees/${attendee.id}`,
        { status }
      );
      toast.success("Status updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 flex items-center gap-4 max-w-2xl">
      <Avatar className="w-12 h-12">
        <AvatarImage src={attendee.user.profilePicture} />
        <AvatarFallback>{attendee.user.fullName?.[0] ?? "?"}</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <p className="font-medium">{attendee.user.fullName}</p>
        <p className="text-sm text-muted-foreground">{attendee.user.email}</p>
      </div>

      <div className="text-sm text-right mr-4">
        <p>{attendee.ticketQuantity} Tickets</p>
        <p className="text-muted-foreground">
          Rp{attendee.totalPricePaid.toLocaleString()}
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="REGISTERED">REGISTERED</SelectItem>
            <SelectItem value="ATTENDED">ATTENDED</SelectItem>
            <SelectItem value="NO_SHOW">NO_SHOW</SelectItem>
            <SelectItem value="CANCELLED">CANCELLED</SelectItem>
          </SelectContent>
        </Select>
        <Button
          size="sm"
          onClick={handleUpdateStatus}
          disabled={loading}
        >
          {loading ? "Saving..." : "Update"}
        </Button>
      </div>
    </Card>
  );
};