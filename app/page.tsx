'use client';
export const dynamic = 'force-dynamic'	
import PostMapView from './map/PostMapView';
import { defaultRoiData, useUser } from './context/userContext';
import useSWR from 'swr';
import { useFiltered } from './user/posts/FilterContext';

const fetcher = (url: string, filtered: boolean) =>
  fetch(url, {
    method: "GET",
    headers: {
      "x-filter-roi": filtered.toString()
    }
  }).then(res => res.json());


export default function Home() {
  const { displayName, interestRegion, userLoaded } = useUser();
  const {filtered} = useFiltered()
  const GOOGLE_MAPS_API_KEY = "AIzaSyCGTpExS27yGMpb0fccyQltC1xQe9R6NVY";
    const { data, error, isLoading } = useSWR(
      ["/api/posts/feed", filtered, userLoaded],
      ([url, filtered,loaded]) => fetcher(url, filtered)
    );


  return (
    <>
      <main className="text-center bg-white text-teal m-0">
          <PostMapView apiKey={GOOGLE_MAPS_API_KEY} interestRegion={userLoaded ? interestRegion : defaultRoiData} posts={isLoading ? [] : data.posts} />
      </main>
    </>
  );
}
