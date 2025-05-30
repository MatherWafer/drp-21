"use client"
import { parseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { RedirectType, redirect, useRouter } from 'next/navigation';
import { parseCookies, setCookie } from 'nookies';
import { useEffect, useState } from 'react';

const redirWrapper = (url: string) =>{
  console.log(`redirecting to ${url}`)
  redirect(url,RedirectType.replace)
}

export default function Home() {
  const [name,setName] = useState<string>("")
  const router = useRouter();
  const submitName = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setName("");
    fetch("/api/submitName", {
      method: "POST",
      body: JSON.stringify({ name: trimmed }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to submit name");
        router.push("/")
      })
    }

  useEffect(() => {
    const cookies = parseCookies()
    if(cookies.uuid){
      router.push("/")
    }
  })
  return (
    <main className="p-8 text-center">
      <h1 className="text-3xl mb-4">Oi, What's your name?</h1>
      <div className="flex justify-center items-stretch space-x-2">
        <textarea
              id="question"
              className="w-2xs h-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 resize-none focus:ring-blue-500"
              onKeyDown={(ke) => {if(name.trim() && ke.key == "Enter" ){ke.preventDefault();submitName();}}}
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder='Enter name..'
              rows={1}
            />
          <button
            className="px-4  py-2 bg-blue-600 text-white rounded"
            onClick={submitName}
          >
            Submit
          </button>
      </div>
    </main>
  );
  }