'use client';
export const dynamic = 'force-dynamic'	
import { useEffect, useState } from 'react';
import { PostInfo } from './user/posts/PostOverview';
import PostMapView from './map/PostMapView';
import { useUser } from './context/userContext';
import Selector from './layout/Selector';

export default function Home() {
  const { displayName, interestRegion, loadProfile } = useUser();
  const [posts, setPosts] = useState<PostInfo[]>([]);
  const GOOGLE_MAPS_API_KEY = "AIzaSyCGTpExS27yGMpb0fccyQltC1xQe9R6NVY";
  const getPosts = async () => {
    fetch("/api/posts/feed", {
      method: "GET",
      headers: {
        "x-filter-roi": "true"
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch posts");
        return res.json();
      })
      .then((data) => { 
        setPosts(data.posts);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
      });
  };


  useEffect(() => {
    getPosts();
    if(!displayName){loadProfile &&  loadProfile()};
    console.log(interestRegion)
  }, []);


  return (
    <>
      <main className="text-center bg-white text-teal m-0">
          <PostMapView apiKey={GOOGLE_MAPS_API_KEY} interestRegion={interestRegion} posts={posts} />
      </main>
    </>
  );
}
