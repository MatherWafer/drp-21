'use client';

import Link from 'next/link';
import { RedirectType, redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import PostOverview, { PostInfo } from '../PostOverview';
import PostStream from '../PostStream';
import Selector from '../../../layout/Selector';

export default function Home() {
  const [posts,setPosts] = useState<PostInfo[]>([])
  const uuid = parseCookies().uuid
  const getPosts = async () => {
    fetch("/api/posts/ownPosts", {
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
    <main className="min-h-screen px-8 py-4 flex flex-col items-center">
        {
          posts.length != 0 ? 
        <>
        <div className="w-full max-w-2xl sticky top-0 bg-white z-10 pb-4">
          <h1 className="text-2xl mb-3 text-black text-center justify-center flex">Your Posts:</h1>
          <Selector />
        </div>
          <div className="w-full max-w-2xl overflow-y-auto flex-1">
          <PostStream posts={posts} />
        </div>
        </>
        : 
        <div className="flex flex-col items-center justify-center text-center h-full">
          <a className="text-black">You don't have any posts yet. </a>
          <br></br>
          <a className="text-black">Get your voice out!</a>
        </div>
        }
    </main>
  );
}