'use client';
export const dynamic = 'force-dynamic'	
import { RedirectType, redirect, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { parseCookies, setCookie } from 'nookies';
import PostStream from '../user/posts/PostStream';
import { PostInfo } from '../user/posts/PostOverview';
import PostMapView from '../map/MapPostView';
import { useUser } from '../context/userContext';

export default function Feed() {
  const { displayName, loadProfile } = useUser();
  const [uuid, setUuid] = useState<string>('');
  const [posts, setPosts] = useState<PostInfo[]>([]);
  const [showMap, setShowMap] = useState<boolean>(false);
  const GOOGLE_MAPS_API_KEY = "AIzaSyCGTpExS27yGMpb0fccyQltC1xQe9R6NVY";
  const getPosts = async () => {
    const cookies = parseCookies();
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
    // if(!displayName){loadProfile &&  loadProfile()};
  }, []);


  return (
    <main className="p-8 text-center min-h-screen bg-teal-900 rounded-lg text-white">
      <div className="flex flex-col">
        {/* Conditional Content */}
        <div className="w-full max-w-screen-lg mx-auto">
            <>
              <h1 className="text-3xl mb-8">Latest posts:</h1>
              <PostStream posts={posts}/>
            </>
        </div>

      </div>
    </main>
  );
}
