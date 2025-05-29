'use client';

import Link from 'next/link';
import { RedirectType, redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { parseCookies, setCookie } from 'nookies';
import PostStream from './user/posts/PostStream';
import Feed from './user/posts/feed/page';

export default function Home() {
  const [name, setName] = useState<string>('');
  const [uuid, setUuid] = useState<string>('');
  
  const router = useRouter();

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
      <h1 className="text-4xl font-bold mb-8">Hi, {name} </h1>
      <div className="flex flex-col">
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {userOptions.map((uo) => (
              <UserOptionTab uo={uo} key={uo.url} />
            ))}
          </div>  
          <div>
            <h1 className="text-3xl mb-8">Latest posts:</h1>
            <Feed/>
          </div>
      </div>
    </main>
  );
}
