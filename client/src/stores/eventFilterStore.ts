import { create } from "zustand";

interface EventFilterState {
  searchTerm: string;
  selectedCategory: string;
  setSelectTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
}

export const useEventFilterStore = create<EventFilterState>((set) => ({
  searchTerm: "",
  selectedCategory: "",
  setSelectTerm: (term: string) => set({ searchTerm: term }),
  setSelectedCategory: (category: string) =>
    set({ selectedCategory: category }),
}));
