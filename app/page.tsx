'use client';

import Link from 'next/link';
import { RedirectType, redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';




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
    console.log(localStorage.getItem("uuid"))
    if(!localStorage?.getItem("uuid")){
      redirect("/register",RedirectType.replace)
   };
    const uuid = localStorage.getItem("uuid") as string
    getName(uuid)
    setUuid(uuid)
  })

  type UserOption = {
    url: string,
    description: String
  }

  const userOptions: UserOption[] = [
    {
      url: "/feed",
      description: "View Feed"
    },
    {
      url: "/create",
      description: "Make a post"
    },
    {
      url: "/posts",
      description: "View my posts"
    },
    {
      url: "/bookmarked",
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