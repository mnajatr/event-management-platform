"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { getOrganizerEventById, updateEvent } from "@/services/event.service";
import { TEvent } from "@/types/event.type";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const EditEventPage = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Partial<TEvent>>();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getOrganizerEventById(id);
        reset(data); // prefill form
      } catch (err) {
        toast.error("Failed to load event data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, reset]);

  const onSubmit = async (formData: Partial<TEvent>) => {
    try {
      await updateEvent(id, formData);
      toast.success("Event updated successfully!");
      router.push(`/dashboard/organizer/events/${id}`);
    } catch (err) {
      toast.error("Failed to update event.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6 mt-6">
      <h2 className="text-2xl font-semibold">✏️ Edit Event</h2>

      <Card className="p-6 max-w-2xl space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>Event Name</label>
            <Input {...register("name", { required: true })} />
            {errors.name && <p className="text-red-500 text-sm">Required</p>}
          </div>

          <div>
            <label>Description</label>
            <Textarea {...register("description", { required: true })} rows={5} />
            {errors.description && (
              <p className="text-red-500 text-sm">Required</p>
            )}
          </div>

          <div>
            <label>Location</label>
            <Input {...register("location", { required: true })} />
            {errors.location && (
              <p className="text-red-500 text-sm">Required</p>
            )}
          </div>

          <div>
            <label>Start Date</label>
            <Input
              type="datetime-local"
              {...register("startDate", { required: true })}
            />
          </div>

          <div>
            <label>End Date</label>
            <Input
              type="datetime-local"
              {...register("endDate", { required: true })}
            />
          </div>

          <div>
            <label>Base Price (Rp)</label>
            <Input
              type="number"
              {...register("basePrice", { required: true, min: 0 })}
            />
          </div>

          <div>
            <label>Available Seats</label>
            <Input
              type="number"
              {...register("availableSeats", { required: true, min: 1 })}
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default EditEventPage;