'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import{ PostInfo } from '../PostOverview';
import PostStream from '../PostStream';
import Selector from '../../../layout/Selector';

export default function Home() {
  const [posts,setPosts] = useState<PostInfo[]>([])
  const getPosts = async () => {
    fetch("/api/posts/bookmarked", {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch posts");
        return res.json();
      })
      .then((data) => {
      setPosts(data.posts)
      console.log(data.posts)
      })
      .catch((err) => {
        console.error("Error Fetching posts:", err);
      });
  };

  const router = useRouter()
  useEffect(() => {
    getPosts()
  },[])
  return (
    <main className="min-h-screen px-8 py-4 flex flex-col items-center">
  <div className="w-full max-w-2xl sticky top-0 bg-white z-10 pt-2 pb-4">
    <h1 className="text-2xl mb-4 text-black text-center">Your Bookmarked Posts:</h1>
    <Selector />
  </div>
    <div className="w-full max-w-2xl overflow-y-auto flex-1">
    <PostStream posts={posts} />
  </div>
    
    </main>
  );

}