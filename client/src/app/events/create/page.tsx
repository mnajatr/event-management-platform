import { CreateEventForm } from "@/components/events/CreateEventForm";

export default function CreateEventPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold">Buat Event Baru</h1>
        <p className="text-muted-foreground">
          Isi detail di bawah ini untuk mempublikasikan event Anda.
        </p>
      </div>
      <CreateEventForm />
    </div>
  );
}
