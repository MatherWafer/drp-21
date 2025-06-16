'use client' 
export const dynamic = 'force-dynamic';
import PostMapView from './map/PostMapView';
import { useUser } from './context/userContext';
import useSWR from 'swr';
import { useFiltered } from './user/posts/FilterContext';
import { parsePostsResponse } from '../components/PostFeed';
import { useEffect } from 'react';

const fetcher = (url: string, filtered: boolean) =>
  fetch(url, {
    method: 'GET',
    headers: {
      'x-filter-roi': filtered.toString(),
    },
  }).then((res) => res.json());

export default function Home() {
  const {interestRegions, userLoaded } = useUser();
  const { filtered } = useFiltered();
  const GOOGLE_MAPS_API_KEY = 'AIzaSyCGTpExS27yGMpb0fccyQltC1xQe9R6NVY';
  const { data, isLoading } = useSWR(
    userLoaded ? ['/api/posts/feed', filtered, userLoaded] : null, // Only fetch when userLoaded is true
    ([url, filtered]) => fetcher(url, filtered)
  );

  useEffect( () => {
    console.log(parsePostsResponse(data))
  },[data])

  if (!userLoaded || isLoading) {
    return (
        <div className="flex justify-center items-center h-full flex-col">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-75 mb-4"></div>
            <p className="text-blue-500 font-semibold">Loading...</p>
          </div>     
    );
  }

  return (
  <main className="text-center bg-white text-teal m-0">
    <h1 className="fixed top-0 left-1/2 transform -translate-x-1/2 z-10 p-4 px-10 text-xl font-bold bg-white/70 rounded-xl text-black">
      Roadable
    </h1>
    <PostMapView
      apiKey={GOOGLE_MAPS_API_KEY}
      interestRegion={interestRegions}
      posts={parsePostsResponse(data)}
    />
  </main>
);
}