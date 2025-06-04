'use client';
export const dynamic = 'force-dynamic'	
import Link from 'next/link';
import { RedirectType, redirect, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import PostStream from './user/posts/PostStream';
import { PostInfo } from './user/posts/PostOverview';
import PostMapView from './map/MapPostView';
import CategoryDropdown from './user/posts/CategoryDropdown';
import { useUser } from './context/userContext';

export default function Home() {
  // const { displayName, loadProfile } = useUser();
  // const [uuid, setUuid] = useState<string>('');
  const [posts, setPosts] = useState<PostInfo[]>([]);
  const [showMap, setShowMap] = useState<boolean>(false);
  // const router = useRouter();
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
    // if(!displayName){loadProfile &&  loadProfile()};
  }, []);

  type UserOption = {
    url: string;
    description: string;
  };

  const userOptions: UserOption[] = [
    { url: '/create', description: 'Make a Post' },
    { url: 'user/posts/ownPosts', description: 'My Posts' },
    { url: 'user/posts/bookmarked', description: 'Bookmarked' },
  ];

  function UserOptionTab({ uo }: { uo: UserOption }) {
    return (
      <Link
        href={uo.url}
        className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-4 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-lg font-semibold w-48 text-center border border-zinc-700"
      >
        {uo.description}
      </Link>
    );
  }



  return (
    <main className="p-8 text-center min-h-screen bg-zinc-900 text-white">
      {/* <h1 className="text-4xl font-bold mb-8">Hi, {displayName}</h1> */}
      <div className="flex flex-col">
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {userOptions.map((uo) => (
            <UserOptionTab uo={uo} key={uo.url} />
          ))}
        </div>

        <div className="mb-8">
          <button
            onClick={() => setShowMap((prev) => !prev)}
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl shadow-md transition-all duration-300"
          >
            {showMap ? 'Show Feed' : 'Show Map'}
          </button>
        </div>


        {/* Conditional Content */}
        <div className="w-full max-w-screen-lg mx-auto">
          {showMap ? (
            <>
              <h1 className="text-3xl mb-8">Where people have ideas:</h1>
              <div className="w-full h-[400px]">
                <PostMapView apiKey={GOOGLE_MAPS_API_KEY} posts={[]} />
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl mb-8">Latest posts:</h1>
              <CategoryDropdown/>
              {/* <PostStream posts={posts}/> */}
            </>
          )}
        </div>

      </div>
    </main>
  );
}
