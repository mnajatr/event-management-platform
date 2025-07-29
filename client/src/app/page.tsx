"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/lib/api/events";
import { EventList } from "@/components/events/EventList";
import { EventFilters } from "@/components/events/EventFilters";
import { useDebounce } from "@/hooks/useDebounce";

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: events,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["events", debouncedSearchTerm, selectedCategory],
    queryFn: () =>
      getEvents({ search: debouncedSearchTerm, category: selectedCategory }),
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchTerm) {
      params.set("search", debouncedSearchTerm);
    }

    if (selectedCategory) {
      params.set("category", selectedCategory);
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, [debouncedSearchTerm, selectedCategory, pathname, router]);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-center mb-4">
        Temukan Event Menarik
      </h1>
      <p className="text-center text-gray-500 mb-12">
        Jelajahi berbagai event seru di sekitar Anda.
      </p>

      <EventFilters
        setSearchTerm={setSearchTerm}
        setSelectedCategory={setSelectedCategory}
      />

      {isLoading && <div className="text-center">Mencari event... ⏳</div>}
      {isError && (
        <div className="text-center text-red-500">Error: {error.message}</div>
      )}
      {!isLoading && !isError && <EventList events={events} />}
    </main>
  );
}
