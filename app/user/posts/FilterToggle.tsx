'use client';

import { useUser } from '../../context/userContext';
import { useFiltered } from './FilterContext';

export default function FilterToggle() {
  const multipleRegions = useUser().interestRegions.length > 1
  const { filtered, setFiltered } = useFiltered();
  const minimal = true
  return (
    <div className="flex min-w-0 rounded-full bg-teal-800/80 p-1 backdrop-blur-sm">
      <button
        className={`flex-1 rounded-full py-1 px-2 text-xs font-medium transition-all duration-200 ease-out whitespace-nowrap ${
          filtered
            ? 'bg-teal-600 text-white shadow-md'
            : 'bg-transparent text-teal-100 hover:bg-teal-700/50'
        }`}
        onClick={() => setFiltered(true)}
        aria-pressed={filtered}
        aria-label="Filter posts to my region"
      >
        <span className="flex items-center justify-center gap-1">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <rect x="4" y="4" width="16" height="16" rx="4" />
          </svg>
          {minimal? "My Region" : "Just my region"}{multipleRegions ? "s" : ""}
        </span>
      </button>
      <button
        className={`flex-1 rounded-full py-1 px-2 text-xs font-medium transition-all duration-200 ease-out whitespace-nowrap ${
          !filtered
            ? 'bg-teal-600 text-white shadow-md'
            : 'bg-transparent text-teal-100 hover:bg-teal-700/50'
        }`}
        onClick={() => setFiltered(false)}
        aria-pressed={!filtered}
        aria-label="Show all posts"
      >
        <span className="flex items-center justify-center gap-1">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 12h18M3 6h18M3 18h18"
            />
          </svg>
          {minimal? "All Posts" : "All posts"}
        </span>
      </button>
    </div>
  );
}