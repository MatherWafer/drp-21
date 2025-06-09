'use client';
export const dynamic = 'force-dynamic';
import useSWR from 'swr';
import { useFiltered } from '../app/user/posts/FilterContext';
import Selector from '../app/layout/Selector';
import PostStream from '../app/user/posts/PostStream';
import { PostInfo } from '../app/user/posts/PostOverview';
import CategoryDropdown from '../app/user/posts/CategoryDropdown';

const fetcher = (url: string, filtered: boolean) =>
  fetch(url, {
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
  const { data, error, isLoading } = useSWR(
    ['/api/posts/feed', filtered],
    ([url, filtered]) => fetcher(feedUrl, filtered)
  );

  return (
    <main className="min-h-screen px-8 py-4 flex flex-col items-center">
      <div className="w-full max-w-2xl sticky top-0 bg-white z-10 pt-2 pb-4">
        <h1 className="text-2xl mb-4 text-black text-center">{feedTitle}</h1>
        { showOnlyCategorySelector ?
           <CategoryDropdown/>
           :
          <Selector/>
        }
      </div>
      <div className="w-full max-w-2xl overflow-y-auto flex-1">
        {isLoading ? (
          <div className="flex justify-center items-center h-full flex-col">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-75 mb-4"></div>
            <p className="text-blue-500 font-semibold">Loading posts...</p>
          </div>
        ) : (
          error ? <p>Error loading posts...</p> :
          data && <PostStream posts={data.posts as PostInfo[]} />
        )}
      </div>
    </main>
  );

}
