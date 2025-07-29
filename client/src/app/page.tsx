import { getEvents } from "@/lib/api/events";
import { EventBrowser } from "@/components/events/EventBrowser";

// TAMBAHKAN BARIS INI
export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;

  const search = typeof params.search === "string" ? params.search : "";
  const category = typeof params.category === "string" ? params.category : "";

  const initialEvents = await getEvents({ search, category });

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-center mb-4">
        Temukan Event Menarik
      </h1>
      <p className="text-center text-gray-500 mb-12">
        Jelajahi berbagai event seru di sekitar Anda.
      </p>

      <EventBrowser initialEvents={initialEvents} />
    </main>
  );
}
