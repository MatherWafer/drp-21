'use client';
import { useRouter } from 'next/navigation';
import { SetStateAction, useEffect, useState, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import LocationPicker, { LocationCoordinates } from '../map/LocPicker';
import { createClient } from '../../utils/supabase/client';

export default function Ask() {
  const supabase = useMemo(() => {
    if (typeof window === 'undefined') return null; // during SSR/build
    return createClient();
  }, []);

  const [description, setDescription] = useState('');
  const [postSuccess, setPostSuccess] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [namespace, setNamespace] = useState('');
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();
  const GOOGLE_MAPS_API_KEY = 'AIzaSyCGTpExS27yGMpb0fccyQltC1xQe9R6NVY';

  useEffect(() => {
    (async () => {
      if (!supabase) return; // Ensure supabase is initialized
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) await supabase.auth.signInAnonymously();
    })();
  }, [supabase]);

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
    if (!file || !supabase) return null;
    const path = `posts/${uuid()}-${file.name}`;
    const { error } = await supabase
      .storage
      .from('post-images')
      .upload(path, file, { cacheControl: '3600', upsert: false });

    if (error) {
      console.log(error);
      throw error;
    }

    const { data } = supabase
      .storage
      .from('post-images')
      .getPublicUrl(path);

    return data.publicUrl ?? null;
  }

  const makePost = async () => {
    if (!(title && latitude && longitude)) {
      alert('Your post needs a title and location');
      return;
    }
    setUploading(true)
    let imageUrl: string | null = null;
    if (file) {
      try {
        setIsUploading(true);
        imageUrl = await uploadImages();
      } catch (err) {
        alert('Image upload failed');
        console.error(err);
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    setDescription('');
    const res = await fetch('/api/create', {
      method: 'POST',
      body: JSON.stringify({ title, latitude, longitude, category, description, imageUrl }),
    });
    if (res.ok) {
      setPostSuccess(true);
      setTimeout(() => router.push('/'), 1000); // Redirect after showing success
    } else {
      alert('Failed to create post');
      setUploading(false)
    }
  };

  const handleSelectChange = (event: { target: { value: SetStateAction<string> } }) => {
    setNamespace(event.target.value);
  };

  return (
    <main className="bg-gradient-to-b from-emerald-50 to-emerald-100 min-h-screen p-4 sm:p-6 flex items-center justify-center">
      <div className="w-full max-w-md md:max-w-2xl bg-white shadow-md rounded-lg p-6 sm:p-8 md:p-10 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-emerald-900 text-center">
          Create a Post
        </h1>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-emerald-800 mb-1">
              Post Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full p-3 border text-black border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              placeholder="What's happening?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-emerald-800 mb-1">
              Category
            </label>
            <select
              id="category"
              className="w-full p-3 border text-black border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled hidden>
                Select a category...
              </option>
              <option value="Cycling">Cycling</option>
              <option value="Roadworks">Roadworks</option>
              <option value="Parks">Parks</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-emerald-800 mb-1">
              Description
            </label>
            <textarea
              id="description"
              className="w-full p-3 border text-black border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              rows={4}
              placeholder="Tell us more..."
              value={description}
              onKeyDown={(ke) => {
                if (description.trim() && ke.key === 'Enter' && !ke.shiftKey) {
                  makePost();
                }
              }}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-emerald-800 mb-1">
              Location
            </label>
            <div className="w-full h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden border border-emerald-300">
              <LocationPicker
                apiKey={GOOGLE_MAPS_API_KEY}
                onLocationSelect={(loc) => {
                  setLatitude(loc.lat);
                  setLongitude(loc.lng);
                }}
                height="100%"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-emerald-800 mb-1">
              Photo <span className="text-emerald-600 opacity-60">(optional)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full p-3 border border-emerald-300 rounded-lg text-emerald-800 file:bg-emerald-100 file:border-0 file:rounded file:p-2 file:text-emerald-700 file:mr-2"
            />
            {preview && (
              <div className="mt-4 w-full max-w-sm md:max-w-md mx-auto">
                <img
                  src={preview}
                  alt={file?.name ?? 'preview'}
                  className="w-full h-40 object-cover rounded-lg border border-emerald-300 shadow-sm"
                />
              </div>
            )}
          </div>
          <button
            onClick={makePost}
            disabled={uploading}
            className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >n
            {isUploading ? 'Uploading...' : 'Submit Post'}
          </button>
        </div>
        {postSuccess && (
          <div className="bg-emerald-100 p-4 rounded-lg shadow border border-emerald-200 text-center">
            <h2 className="font-semibold text-emerald-800">Post created successfully!</h2>
          </div>
        )}
      </div>
    </main>
  );
}