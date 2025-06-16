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
import SortDropdown from './SortDropDown';

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
  const { filtered } = useFiltered();
  const [sortOption, setSortOption] = useState('most_recent');
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

  return (
    <main className="min-h-screen px-8 py-4 flex flex-col items-center">
      <div className="w-full max-w-2xl sticky top-0 bg-white z-10 pt-2 pb-4 flex flex-col items-center">
        <div className="w-full">
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-2 p-2 bg-teal-900/50 rounded-lg">
            {showOnlyCategorySelector ? (
              <CategoryDropdown />
            ) : (
              <Selector />
            )}
            <SortDropdown
              sortOptions={sortOptions}
              sortOption={sortOption}
              setSortOption={setSortOption}
            />
          </div>
        </div>
      </div>
      <div className="w-full max-w-2xl overflow-y-auto flex-1 mt-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-full flex-col">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-75 mb-4"></div>
            <p className="text-blue-500 font-semibold">Loading posts...</p>
          </div>
        ) : error ? (
          <p>Error loading posts...</p>
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