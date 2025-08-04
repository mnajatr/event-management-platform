"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/lib/api/events";
import { useEventFilterStore } from "@/stores/eventFilterStore";
import { useDebounce } from "@/hooks/useDebounce";
import { TEvent } from "@/types/event.type";
import { EventList } from "./EventList";
import { EventFilters } from "./EventFilters";
import { useSearchParams } from "next/navigation";
import { fa } from "zod/v4/locales";

interface EventBrowserProps {
  initialEvents: TEvent[];
}

export const EventBrowser = ({ initialEvents }: EventBrowserProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    searchTerm,
    selectedCategory,
    locationFilter,
    setSearchTerm,
    setSelectedCategory,
    setLocationFilter,
  } = useEventFilterStore();

  const isInitialized = useRef(false);
  useEffect(() => {
    if (!isInitialized.current) {
      setSearchTerm(searchParams.get("search") || "");
      setSelectedCategory(searchParams.get("category") || "");
      setLocationFilter(searchParams.get("location") || "");
      isInitialized.current = true;
    }
  }, [searchParams, setSearchTerm, setSelectedCategory, setLocationFilter]);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const debouncedLocationFilter = useDebounce(locationFilter, 500);

  const {
    data: events,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["events", debouncedSearchTerm, selectedCategory],
    queryFn: () =>
      getEvents({
        search: debouncedSearchTerm,
        category: selectedCategory,
        location: debouncedLocationFilter,
      }),
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
    if (debouncedLocationFilter) {
      params.set("location", debouncedLocationFilter);
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, [debouncedSearchTerm, selectedCategory, pathname, router]);

  return (
    <>
      <EventFilters
        initialSearch={searchTerm}
        initialCategory={selectedCategory}
        initialLocation={locationFilter}
        onSearchChange={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        onLocationChange={setLocationFilter}
      />

      {isLoading && <div className="text-center">Mencari event... ⌛</div>}
      {isError && (
        <div className="text-center text-red-500">Error {error.message}</div>
      )}

      <EventList events={events} />
    </>
  );
};
