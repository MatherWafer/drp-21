'use client';

import React from 'react';

type SortOption = {
  value: string;
  label: string;
};

type SortDropdownProps = {
  sortOptions: SortOption[];
  sortOption: string;
  setSortOption: (value: string) => void;
};

export default function SortDropdown({ sortOptions, sortOption, setSortOption }: SortDropdownProps) {
  return (
    <div className="flex min-w-0 rounded-full bg-teal-800/80 p-1 backdrop-blur-sm items-center">
      <select
        id="sort"
        className="flex-1 text-xs font-medium text-white bg-teal-600/50 rounded-full py-1 px-2 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ease-out"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value} className="text-white bg-teal-700">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}