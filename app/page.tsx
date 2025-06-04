'use client';
export const dynamic = 'force-dynamic'	
import { RedirectType, redirect, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import PostStream from './user/posts/PostStream';
import { PostInfo } from './user/posts/PostOverview';
import PostMapView from './map/MapPostView';
import { useUser } from './context/userContext';

export default function Home() {
  const { displayName, loadProfile } = useUser();
  const [posts, setPosts] = useState<PostInfo[]>([]);
  const [showMap, setShowMap] = useState<boolean>(false);
  const GOOGLE_MAPS_API_KEY = "AIzaSyCGTpExS27yGMpb0fccyQltC1xQe9R6NVY";
  const getPosts = async () => {
    fetch("/api/posts/feed", {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch posts");
        return res.json();
      })
      .then((data) => { 
        setPosts(data.posts);
        console.log(data.posts);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
      });
  };


  useEffect(() => {
    getPosts();
    if(!displayName){loadProfile &&  loadProfile()};
  }, []);


  return (
    <main className="text-center min-h-screen bg-white text-teal">
      <div className="flex flex-col">
        {/* Conditional Content */}
        <div className="w-full max-w-screen-lg mx-auto">
            <>
              <h1 className="text-3xl text-teal mb-8">Where people have ideas:</h1>
              <div className="w-full h-full">
                <PostMapView apiKey={GOOGLE_MAPS_API_KEY} posts={posts} height={400} />
              </div>
            </>
        </div>

      </div>
    </main>
  );
}
