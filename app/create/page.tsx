"use client";
import { useRouter } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react";
import { v4 as uuid } from "uuid"; 
import LocationPicker, { LocationCoordinates } from "../map/LocPicker";
import { createClient } from '../../utils/supabase/client';

const supabase = createClient(); 


export default function Ask() {
  const [description, setDescription] = useState("");
  const [postSuccess, setPostSuccess] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const [namespace, setNamespace] = useState("");
  const [file, setFile] = useState<File | null>(null); 
  const [isUploading, setUploading] = useState(false);  
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter()
  const GOOGLE_MAPS_API_KEY = "AIzaSyCGTpExS27yGMpb0fccyQltC1xQe9R6NVY";

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) await supabase.auth.signInAnonymously();
    })();
  }, []);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function uploadImages() {
    console.log("Uploading image:", file);
    if (!file) return null;
    const path = `posts/${uuid()}-${file.name}`;
    console.log("Uploading image to:", path);
    const { error } = await supabase
      .storage
      .from("post-images")
      .upload(path, file, { cacheControl: "3600", upsert: false });
    
    if (error) {console.log(error); throw error};

    const { data } = supabase
      .storage
      .from("post-images")
      .getPublicUrl(path);
    console.log("Image uploaded to:", data);

    return data.publicUrl ?? null;
  }

  const makePost = async () => {
    if(!(title && latitude && longitude)){
      alert("Your post needs a title and location")
      return
    }
    console.log("file:", file);
    let imageUrl: string | null = null;
    if (file) {
      try {
        console.log("Starting image upload...");
        setUploading(true);
        imageUrl = await uploadImages();
      } catch (err) {
        alert("Image upload failed");
        console.error(err);
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    setDescription("")
    const res = await fetch("/api/create", {
      method: "POST",
      body: JSON.stringify({title,latitude,longitude,category,description, imageUrl}),
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
    <main className="bg-teal-700 min-h-screen p-6 flex items-center justify-center">
      <div className="max-w-2xl space-y-6 w-full">
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
            <option className="bg-teal-800 text-white" value="Cycling">Cycling</option>
            <option className="bg-teal-800 text-white" value="Roadworks">Roadworks</option>
            <option className="bg-teal-800 text-white" value="Parks">Parks</option>
            <option className="bg-teal-800 text-white" value="Other">Other</option>
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
          height={'300px'}
        />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#cccccc]-700">
              Photo <span className="opacity-60">(optional)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setFile(e.target.files?.[0] ?? null)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            
            {preview && (
              <div className="w-24 h-24 my-2">
                <img
                  src={preview}
                  alt={file?.name ?? "preview"}
                  className="object-cover w-full h-full rounded"
                />
              </div>
            )}


          </div>
          <button
            onClick={makePost}
            // disabled={isUploading}
            className="block mx-auto px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            {isUploading ? "Uploading…" : "Submit"}
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