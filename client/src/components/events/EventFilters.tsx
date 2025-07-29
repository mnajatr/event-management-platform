"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  "MUSIC",
  "SPORTS",
  "TECHNOLOGY",
  "BUSINESS",
  "EDUCATION",
  "ENTERTAINMENT",
  "FOOD",
  "HEALTH",
  "ART",
  "OTHER",
];

interface EventFiltersProps {
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
}

export const EventFilters = ({
  setSearchTerm,
  setSelectedCategory,
}: EventFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <Input
        placeholder="Cari nama event..."
        onChange={(e) => setSearchTerm(e.target.value)}
        className="md:w-1/2"
      />
      <Select
        onValueChange={(value) =>
          setSelectedCategory(value === "all" ? "" : value)
        }
      >
        <SelectTrigger className="md:w-1/2">
          <SelectValue placeholder="Semua Kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Kategori</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category.charAt(0).toUpperCase() +
                category.slice(1).toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
