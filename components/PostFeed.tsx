'use client';
export const dynamic = 'force-dynamic';
import useSWR from 'swr';
import { useFiltered } from '../app/user/posts/FilterContext';
import Selector from '../app/layout/Selector';
import PostStream from '../app/user/posts/PostStream';
import PostModal from '../app/user/posts/PostModal';
import { PostInfo } from '../app/user/posts/PostOverview';
import FilterToggle from '../app/user/posts/FilterToggle';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import SortDropdown from './SortDropDown';
import CategoryDropdown from '../app/user/posts/CategoryDropdown';
import Link from 'next/link';

export function parsePostInfo(data: any): PostInfo {
  return {
    ...data,
    postedOn: new Date(data?.postedOn ?? Date.now()),
  };
}

export function parsePostsResponse(data: any): PostInfo[] {
  return (data?.posts || []).map(parsePostInfo);
}

const fetcher = (url: string, filtered: boolean, sort: string) =>
  fetch(`${url}`, {
    method: 'GET',
    headers: {
      'x-filter-roi': filtered.toString(),
      'x-sort-type': sort,
    },
  }).then((res) => res.json());

export type PostFeedProps = {
  feedUrl: string;
  showOnlyCategorySelector: boolean;
  feedTitle: string;
};

export const PostFeed: React.FC<PostFeedProps> = ({
  feedUrl,
  showOnlyCategorySelector,
  feedTitle,
}) => {
  const { filtered, category } = useFiltered();
  const [sortOption, setSortOption] = useState('most_recent');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const { data, error, isLoading } = useSWR(
    [feedUrl, filtered, sortOption],
    ([url, filtered, sort]) => fetcher(url, filtered, sort)
  );
  const pathname = usePathname();

  const [selectedPostInfo, setSelectedPostInfo] = useState<PostInfo | null>(null);
  const openModal = (post: PostInfo) => setSelectedPostInfo(post);
  const closeModal = () => setSelectedPostInfo(null);
  const sortOptions = [
    { value: 'most_recent', label: 'Most Recent' },
    { value: 'most_liked', label: 'Most Liked' },
    { value: 'most_comments', label: 'Most Comments' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <main className="min-h-screen px-4 py-4 flex flex-col items-center">
      <div className="w-full max-w-2xl sticky top-0 bg-white z-10 pt-2 pb-4 flex flex-col items-center">
        {!pathname.includes('profile') && (
          <div className="w-full flex justify-between items-center mb-3">
            <h1 className="text-2xl text-black font-semibold truncate max-w-[70%]">{feedTitle}</h1>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-800/80 text-white text-sm font-medium rounded-full hover:bg-teal-700/90 transition-all duration-200"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              aria-expanded={isFilterOpen}
              aria-controls="filter-options"
            >
              <svg
                className="w-4 h-4"
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
              Filter
            </button>
          </div>
        )}
        <div className="w-full relative" ref={filterRef}>
          {!pathname.includes('ownPosts') && (
            <div className="max-w-2xl mx-auto mb-3">

              <FilterToggle />
            </div>
          )}
          {isFilterOpen && (
            <div
              id="filter-options"
              className="absolute top-0 right-0 mt-2 w-64 bg-teal-900/95 backdrop-blur-sm rounded-lg shadow-lg p-4 flex flex-col gap-4 z-20"
            >
              {showOnlyCategorySelector ? (
                <div>
                  <label htmlFor="category" className="block text-xs font-semibold text-teal-100 mb-1">
                    Category
                  </label>
                  <CategoryDropdown />
                </div>
              ) : (
                <Selector />
              )}
              <div>
                <label htmlFor="sort" className="block text-xs font-semibold text-teal-100 mb-1">
                  Sort By
                </label>
                <SortDropdown
                  sortOptions={sortOptions}
                  sortOption={sortOption}
                  setSortOption={(value) => {
                    setSortOption(value);
                    setIsFilterOpen(false);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-full max-w-2xl overflow-y-auto flex-1 mt-2" aria-live="polite">
        {isLoading ? (
          <div className="flex justify-center items-center h-full flex-col">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-opacity-75 mb-3"></div>
            <p className="text-blue-500 font-semibold">Loading posts...</p>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center py-4">Error loading posts...</p>
        ) : data?.posts?.length === 0 ? (
          <div className="text-center py-4 text-gray-600">
            <p className="mb-2">
              {category !== 'None'
                ? 'No posts match your category. Try another or create one!'
                : filtered
                ? "Looks like nothing's going on around you... why not start it off?"
                : 'No posts... eerie'}
            </p>
            <Link
              href="/create"
              className="inline-block px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-full hover:bg-teal-500 transition-colors duration-200"
            >
              Start a post
            </Link>
          </div>
        ) : (
          <>
            <PostStream posts={parsePostsResponse(data)} onPostClick={openModal} />
            {selectedPostInfo && <PostModal info={selectedPostInfo} onClose={closeModal} />}
          </>
        )}
      </div>
    </main>
  );
};