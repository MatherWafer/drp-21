'use client';

import Link from 'next/link';
import { RedirectType, redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies';



export default function Home() {
  const getName = (uid: string) => {
    fetch("/api/home", {
      method: "POST",
      body: JSON.stringify({ uuid: uid }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to get name");
        return res.json();
      })
      .then((data) => {
        setName(data.name)
        setCookie(null,"name",name,)
      })
      .catch((err) => {
        console.error("Error submitting name:", err);
      });
  };

  function UserOptionTab(props: {uo:UserOption}) {
    return(
    <div>
      <Link href={{pathname:props.uo.url}}> {props.uo.description}</Link>
    </div>
    )
  }

  const [name, setName] = useState<string>("")
  const [uuid, setUuid] = useState<string>("")
  const router = useRouter()
  useEffect(() => {
    const cookies = parseCookies()
    if(!cookies.uuid){
      redirect("/register",RedirectType.replace)
   };
    setUuid(cookies.uuid)
    if(!cookies.name){(getName(uuid))} else {setName(cookies.name)}
  })

  type UserOption = {
    url: string,
    description: String
  }

  const userOptions: UserOption[] = [
    {
      url: "user/posts/feed",
      description: "View Feed"
    },
    {
      url: "/create",
      description: "Make a post"
    },
    {
      url: "user/posts/ownPosts",
      description: "View my posts"
    },
    {
      url: "user/posts/bookmarked",
      description: "View my bookmarked posts"
    }
  ]

  return (
    <main className="p-8 text-center">
    <h1 className="text-3xl mb-4">Hi {name}</h1>
    <div className="flex justify-center items-stretch space-x-2">
      {userOptions.map(uo => <UserOptionTab uo={uo} key={uo.url}  />)}
    </div>
  </main>
);
  
}