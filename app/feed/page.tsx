'use client';
export const dynamic = 'force-dynamic'	
import { RedirectType, redirect, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { parseCookies, setCookie } from 'nookies';
import PostStream from '../user/posts/PostStream';
import { PostInfo } from '../user/posts/PostOverview';
import PostMapView from '../map/PostMapView';
import { useUser } from '../context/userContext';
import Selector from '../layout/Selector';
import { useFiltered } from '../user/posts/FilterContext';

export default function Feed() {
  const [posts, setPosts] = useState<PostInfo[]>([]);
  const {filtered} = useFiltered()
  const getPosts = async () => {
    const cookies = parseCookies();
    fetch("/api/posts/feed", {
      method: "GET",
      headers:{
        "x-filter-roi":filtered.toString()
      }
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
  }, [filtered]);


  return (
        <main className="min-h-screen px-8 py-4 flex flex-col items-center">
      <div className="w-full max-w-2xl sticky top-0 bg-white z-10 pt-2 pb-4">
        <h1 className="text-2xl mb-4 text-black text-center">Latest Posts:</h1>
        <Selector />
      </div>
        <div className="w-full max-w-2xl overflow-y-auto flex-1">
        <PostStream posts={posts} />
      </div>
        
        </main>
  );
}
