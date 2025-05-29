'use client';

import Link from 'next/link';
import { RedirectType, redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import PostOverview, { PostInfo } from '../PostOverview';



export default function Home() {
  const [posts,setPosts] = useState<PostInfo[]>([])
  const uuid = parseCookies().uuid
  const getPosts = async () => {
    fetch("/api/posts/feed", {
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
      <h1 className="text-3xl mb-8">Feed</h1>
      <div className="flex flex-col items-center w-full">
        <div className="max-w-2xl w-full">
          {posts && posts.map((pi) => (
            <PostOverview key={pi.id as string} post={pi} />
          ))}
        </div>
      </div>
    </main>
  );
}