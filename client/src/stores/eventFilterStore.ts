import { create } from "zustand";

interface EventFilterState {
  searchTerm: string;
  selectedCategory: string;
  locationFilter: string;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  setLocationFilter: (location: string) => void;
}

export const useEventFilterStore = create<EventFilterState>((set) => ({
  searchTerm: "",
  selectedCategory: "",
  locationFilter: "",
  setSearchTerm: (term: string) => set({ searchTerm: term }),
  setSelectedCategory: (category: string) =>
    set({ selectedCategory: category }),
  setLocationFilter: (location) => set({ locationFilter: location }),
}));
