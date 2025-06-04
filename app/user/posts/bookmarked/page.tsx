'use client';

import Link from 'next/link';
import { RedirectType, redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import PostOverview, { PostInfo } from '../PostOverview';
import CategoryDropdown from '../CategoryDropdown';
import PostStream from '../PostStream';

export default function Home() {
  const [posts,setPosts] = useState<PostInfo[]>([])
  const uuid = parseCookies().uuid
  const getPosts = async () => {
    fetch("/api/posts/bookmarked", {
      method: "GET",
      headers: {
        "x-user-id": uuid
      }
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
    <main className="min-h-screen p-8 flex flex-col items-center">
      <h1 className="text-3xl mb-8">Your Bookmarked Posts:</h1>
      
        <CategoryDropdown />
        <PostStream posts={posts}/>
    </main>
  );

}