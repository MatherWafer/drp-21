"use client";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { SetStateAction, useEffect, useState } from "react";
import { cursorTo } from "readline";
import LocationPicker, { LocationCoordinates } from "../map/LocPicker";
export default function Ask() {
  const [description, setDescription] = useState("");
  const [postSuccess, setPostSuccess] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const [namespace, setNamespace] = useState("");
  const [blobs,setBlobs] = useState<string[]>([])    
  const router = useRouter()
  const GOOGLE_MAPS_API_KEY = "AIzaSyCGTpExS27yGMpb0fccyQltC1xQe9R6NVY";
  const makePost = async () => {
    console.log(title)
    console.log(latitude)
    console.log(longitude)

    if(!(title && latitude && longitude)){
      alert("Your post needs a title and location")
      return
    }
    setDescription("")
    const res = await fetch("/api/create", {
      method: "POST",
      body: JSON.stringify({title,latitude,longitude,category,description}),
    });
    if(res.ok){
      alert("Post success!")
      router.push("/")
    }
  };
  const handleSelectChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setNamespace(event.target.value);
  };

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Make a Post</h1>
        <div className="space-y-2 items-center">
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
          <label htmlFor="category" className="block text-sm font-medium text-[#cccccc]-700">
            Category
          </label>
          <select id="category"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled hidden>
              Select a category...
            </option>
            <option style={{backgroundColor: 'black', color: 'white'}} value="Cycling">Cycling</option>
            <option style={{backgroundColor: 'black', color: 'white'}} value="Roadworks">Roadworks</option>
            <option style={{backgroundColor: 'black', color: 'white'}} value="Parks">Parks</option>
            <option style={{backgroundColor: 'black', color: 'white'}} value="Other">Other</option>
          </select>
          <label htmlFor="description" className="block text-sm font-medium text-[#cccccc]-700">
            Description
          </label>
          <textarea
            id="description"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={description}
            onKeyDown={(ke) => {if(description.trim() && ke.key == "Enter" && !ke.shiftKey){makePost();}}}
            onChange={(e) => setDescription(e.target.value)}
          />
         <label htmlFor="title" className="block text-sm font-medium text-[#cccccc]-700">
            Location
          </label>
          <div>

        <LocationPicker
          apiKey={GOOGLE_MAPS_API_KEY}
          onLocationSelect={(loc) => {setLatitude(loc.lat);setLongitude(loc.lng)}}
        />
          </div>
          <button
            onClick={makePost}
            className="px-4 py-2 bg-blue-600 text-[#cccccc] rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
        {postSuccess && (
          <div className="bg-[#111111] p-4 rounded-lg shadow border border-gray-200">
            <h2 className="font-semibold text-[#cccccc] mb-2">Post created</h2>
          </div>
        )}
      </div>
    </main>
  );
}