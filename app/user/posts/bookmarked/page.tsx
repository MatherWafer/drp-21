'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import{ PostInfo } from '../PostOverview';
import PostStream from '../PostStream';

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
    <main className="mt-2 min-h-screen p-8 flex flex-col items-center">
      <h1 className="text-2xl mb-8 text-black">Your Bookmarked Posts:</h1>
        <PostStream posts={posts}/>
    </main>
  );

}