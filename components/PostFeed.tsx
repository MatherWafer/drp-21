'use client';
export const dynamic = 'force-dynamic';
import useSWR from 'swr';
import { useFiltered } from '../app/user/posts/FilterContext';
import Selector from '../app/layout/Selector';
import PostStream from '../app/user/posts/PostStream';
import PostModal from '../app/user/posts/PostModal';
import { PostInfo } from '../app/user/posts/PostOverview';
import CategoryDropdown from '../app/user/posts/CategoryDropdown';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function parsePostInfo(data: any): PostInfo {
  return {
    ...data,
    postedOn: new Date(data?.postedOn ?? Date.now()),
  };
}

export function parsePostsResponse(data: any): PostInfo[]{
  return (data?.posts || [] as any[]).map(parsePostInfo)
}

const fetcher = (url: string, filtered: boolean, sort: string) =>
  fetch(`${url}?sort=${sort}`, {
    method: "GET",
    headers: {
      "x-filter-roi": filtered.toString()
    }
  }).then(res => res.json());

export type PostFeedProps = {
    feedUrl: string, 
    showOnlyCategorySelector: boolean, 
    feedTitle: string
}

export const PostFeed: React.FC<PostFeedProps> =  ({
    feedUrl,
    showOnlyCategorySelector,
    feedTitle
}) => {
  const {filtered} = useFiltered()
  const [sortOption, setSortOption] = useState('most_recent');
  const { data, error, isLoading } = useSWR(
    [feedUrl, filtered, sortOption],
    ([url, filtered, sort]) => fetcher(url, filtered, sort)
  );
  const pathname = usePathname();

  const [selectedPostInfo, setSelectedPostInfo] = useState<PostInfo | null>(null);
  const openModal = (post: PostInfo) => setSelectedPostInfo(post);
  const closeModal = () => setSelectedPostInfo(null);
  
  return (
    <main className="min-h-screen px-8 py-4 flex flex-col items-center">
      <div className="w-full max-w-2xl sticky top-0 bg-white z-10 pt-2 pb-4 flex flex-col items-center">
        {!pathname.includes("profile") && <h1 className="text-2xl mb-4 text-black text-center">{feedTitle}</h1> }
        <div className="flex w-full justify-center gap-4">
          { showOnlyCategorySelector ? (
            <CategoryDropdown/>
          ) : (
            <Selector/>
          )}
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
              <option value="most_recent" className="text-white bg-teal-700">Most Recent</option>
              <option value="most_liked" className="text-white bg-teal-700">Most Liked</option>
              <option value="most_comments" className="text-white bg-teal-700">Most Comments</option>
            </select>
          </div>
        </div>
      </div>
      <div className="w-full max-w-2xl overflow-y-auto flex-1">
        {isLoading ? (
          <div className="flex justify-center items-center h-full flex-col">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-75 mb-4"></div>
            <p className="text-blue-500 font-semibold">Loading posts...</p>
          </div>
        ) : error ? (
          <p>Error loading posts...</p>
        ) : (
          <>
            <PostStream
              posts={parsePostsResponse(data)}
              onPostClick={openModal} />
            {selectedPostInfo && <PostModal info={selectedPostInfo} onClose={closeModal} />}
          </>
        )}
      </div>
    </main>
  );
}