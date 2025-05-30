'use client';

import Link from 'next/link';
import { RedirectType, redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import PostOverview, { PostInfo } from '../PostOverview';
import PostStream from '../PostStream';



export default function Feed() {
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
      <PostStream posts={posts}/>
  );

}