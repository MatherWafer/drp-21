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
    <div className="flex w-full max-w-[200px] sm:max-w-[240px] rounded-full bg-teal-800/80 p-1 backdrop-blur-sm items-center">
      <label
        htmlFor="sort"
        className="flex items-center gap-1.5 text-xs font-medium text-teal-100 whitespace-nowrap pl-3"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 4h18v2l-6 6v5l-6 3v-8l-6-6V4z"
          />
        </svg>
        Sort
      </label>
      <select
        id="sort"
        className="flex-1 text-xs font-medium text-white bg-teal-600/50 rounded-full py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ease-out"
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