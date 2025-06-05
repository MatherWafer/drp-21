'use client';

import { createContext, useContext, useState } from "react";

type FilterContextType = {
  category: string;
  setCategory: (value: string) => void;
  filtered: boolean;
  setFiltered: (value: boolean) => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [category, setCategory] = useState<string>("None");
  const [filtered, setFiltered] = useState<boolean>(true);

  return (
    <FilterContext.Provider value={{ category, setCategory, filtered, setFiltered }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFiltered = () => {
  const context = useContext(FilterContext);
  if (!context) throw new Error("useFiltered must be used within a FilterProvider");
  return context;
};