'use client';

import { useEffect, useState } from 'react';
import { PostInfo } from '../PostOverview';
import PostStream from '../PostStream';

export default function Feed() {
  const [posts,setPosts] = useState<PostInfo[]>([])
  const getPosts = async () => {
    fetch("/api/posts/feed", {
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


  useEffect(() => {
    getPosts()
  },[])
  return (
      <div>
      <PostStream posts={posts}/>
      </div>
  );

}