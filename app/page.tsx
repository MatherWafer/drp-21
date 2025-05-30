'use client';

import Link from 'next/link';
import { RedirectType, redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { parseCookies, setCookie } from 'nookies';
import PostStream from './user/posts/PostStream';
import { PostInfo } from './user/posts/PostOverview';
import PostMapView from './map/MapPostView';
import { GOOGLE_MAPS_API_KEY } from './create/page';

export default function Home() {
  const [name, setName] = useState<string>('');
  const [uuid, setUuid] = useState<string>('');
  const [posts, setPosts] = useState<PostInfo[]>([]);
  const [showMap, setShowMap] = useState<boolean>(false);
  const router = useRouter();

  const getPosts = async () => {
    const cookies = parseCookies();
    fetch("/api/posts/feed", {
      method: "GET",
      headers: {
        "x-user-id": cookies.uuid
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

  const getName = (uid: string) => {
    fetch('/api/home', {
      method: 'POST',
      body: JSON.stringify({ uuid: uid }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to get name');
        return res.json();
      })
      .then((data) => {
        setName(data.name);
        setCookie(null, 'name', data.name);
      })
      .catch((err) => {
        console.error('Error submitting name:', err);
      });
  };

  useEffect(() => {
    const cookies = parseCookies();
    if (!cookies.uuid) {
      redirect('/register', RedirectType.replace);
    }
    setUuid(cookies.uuid);
    if (!cookies.name) {
      getName(cookies.uuid);
    } else {
      setName(cookies.name);
    }
    getPosts();
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
      <h1 className="text-4xl font-bold mb-8">Hi, {name}</h1>
      <div className="flex flex-col">
        {/* User Options Bar */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {userOptions.map((uo) => (
            <UserOptionTab uo={uo} key={uo.url} />
          ))}
        </div>

        {/* Toggle Button */}
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
                <PostMapView apiKey={GOOGLE_MAPS_API_KEY} posts={posts} />
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl mb-8">Latest posts:</h1>
              <PostStream posts={posts} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
