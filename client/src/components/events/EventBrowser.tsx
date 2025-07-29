"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/lib/api/events";
import { useEventFilterStore } from "@/stores/eventFilterStore";
import { useDebounce } from "@/hooks/useDebounce";
import { TEvent } from "@/types/event.type";
import { EventList } from "./EventList";
import { EventFilters } from "./EventFilters";

interface EventBrowserProps {
  initialEvents: TEvent[];
}

export const EventBrowser = ({ initialEvents }: EventBrowserProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const { searchTerm, selectedCategory, setSelectTerm, setSelectedCategory } =
    useEventFilterStore();

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
    initialData: initialEvents,
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
    <>
      <EventFilters
        initialSearch={searchTerm}
        initialCategory={selectedCategory}
        onSearchChange={setSelectTerm}
        onCategoryChange={setSelectedCategory}
      />

      {isLoading && <div className="text-center">Mencari event... ⌛</div>}
      {isError && (
        <div className="text-center text-red-500">Error {error.message}</div>
      )}

      <EventList events={events} />
    </>
  );
};
