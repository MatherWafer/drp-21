'use client';

import { useFiltered } from './FilterContext';

export default function FilterToggle() {
  const { filtered, setFiltered } = useFiltered();

  return (
    <div className="flex w-full max-w-[200px] sm:max-w-[240px] rounded-full bg-teal-800/80 p-1 backdrop-blur-sm">
      <button
        className={`flex-1 rounded-full py-1.5 px-3 text-xs font-medium transition-all duration-200 ease-out whitespace-nowrap ${
          filtered
            ? 'bg-teal-600 text-white shadow-md'
            : 'bg-transparent text-teal-100 hover:bg-teal-700/50'
        }`}
        onClick={() => setFiltered(true)}
        aria-pressed={filtered}
        aria-label="Filter posts to my region"
      >
        <span className="flex items-center justify-center gap-1.5">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <rect x="4" y="4" width="16" height="16" rx="4" />
          </svg>
          My Region
        </span>
      </button>
      <button
        className={`flex-1 rounded-full py-1.5 px-3 text-xs font-medium transition-all duration-200 ease-out whitespace-nowrap ${
          !filtered
            ? 'bg-teal-600 text-white shadow-md'
            : 'bg-transparent text-teal-100 hover:bg-teal-700/50'
        }`}
        onClick={() => setFiltered(false)}
        aria-pressed={!filtered}
        aria-label="Show all posts"
      >
        <span className="flex items-center justify-center gap-1.5">
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
              d="M3 12h18M3 6h18M3 18h18"
            />
          </svg>
          All Posts
        </span>
      </button>
    </div>
  );
}