"use client";
import { SetStateAction, useEffect, useState } from "react";
import { cursorTo } from "readline";

export default async function Ask() {
  const [description, setDescription] = useState("");
  const [postSuccess, setPostSuccess] = useState(false);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [namespace, setNamespace] = useState("");
  const [blobs,setBlobs] = useState<string[]>([])
  const getBlobs = async () => {
    const res = await fetch("/api/ask", {
      method: "GET"
    })
    const data = await res.json();
    setBlobs(data.blobs)
  }

  const handleAsk = async () => {
    setDescription("")
    const res = await fetch("/api/ask", {
      method: "POST",
      body: JSON.stringify({ description, namespace }),
    });
    const data = await res.json();
    setPostSuccess(data.answer);
  };
  const handleSelectChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setNamespace(event.target.value);
  };

  useEffect(() => {getBlobs()},[])
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Make a Post</h1>
        {/* Question Input */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-[#cccccc]-700">
            Post title
          </label>
          <textarea
            id="title"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="description" className="block text-sm font-medium text-[#cccccc]-700">
            Description
          </label>
          <textarea
            id="description"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={description}
            onKeyDown={(ke) => {if(description.trim() && ke.key == "Enter" && !ke.shiftKey){handleAsk();}}}
            onChange={(e) => setDescription(e.target.value)}
          />
         <label htmlFor="title" className="block text-sm font-medium text-[#cccccc]-700">
            Location
          </label>
          <textarea
            id="location"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button
            onClick={handleAsk}
            className="px-4 py-2 bg-blue-600 text-[#cccccc] rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
        {/* Response Display */}
        {postSuccess && (
          <div className="bg-[#111111] p-4 rounded-lg shadow border border-gray-200">
            <h2 className="font-semibold text-[#cccccc] mb-2">Post created</h2>
          </div>
        )}
      </div>
    </main>
  );
}