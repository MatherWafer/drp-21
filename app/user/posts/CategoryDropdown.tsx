'use client';

import { useState } from 'react';
import { useFiltered } from './FilterContext';

export default function CategoryDropdown() {
  const { category, setCategory } = useFiltered();
  const [hasSelected, setHasSelected] = useState(false)
  return (
    <div className="flex min-w-0 rounded-full bg-teal-800/80 p-1 backdrop-blur-sm items-center">
      <select
        id="category"
        className="flex-1 text-xs font-medium text-white bg-teal-600/50 rounded-full py-1 px-2 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ease-out"
        value={category}
        onChange={(e) => {setHasSelected(true);setCategory(e.target.value)}}
      >
        {['None', 'Cycling', 'Roadworks', 'Parks', 'Other'].map((option) => (
          <option key={option} value={option} className="text-white bg-teal-700">
            {option === 'None' && !hasSelected? "Pick a category" : option}
          </option>
        ))}
      </select>
    </div>
  );
}