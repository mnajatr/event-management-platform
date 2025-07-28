import { EventList } from "@/components/event/EventList";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-center mb-12">
        Temukan Event Menarik
      </h1>
      <EventList />
    </main>
  );
}
