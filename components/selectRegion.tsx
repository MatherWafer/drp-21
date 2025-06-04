'use client';

import React, { useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import SelectMapArea from '../app/map/SelectMapArea';
import { useUser } from '../app/context/userContext';
const SelectRoiPage = () => {
  const [poly, setPoly] = useState<google.maps.MVCArray<google.maps.LatLng>>();
  const router = useRouter();
  const GOOGLE_MAPS_API_KEY = "AIzaSyCGTpExS27yGMpb0fccyQltC1xQe9R6NVY";
  const {loadProfile} = useUser()
  const handlePolyComplete = (p: google.maps.Polygon) => {
    setPoly(p.getPath());
  };

  const submitPoly = async () => {
    if (!poly) {
      alert("You need to select a region.");
      return;
    }
    const res = await fetch("/api/select-roi", {
      method: "POST",
      body: JSON.stringify({ region: poly.Eg }),
    });
    if (res.ok) {
      loadProfile && (await loadProfile())
      router.push("/")
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 text-white p-8 space-y-6">
      <h1 className="text-3xl font-bold">Select the areas you care about</h1>
      <p className="text-gray-400 mb-4 max-w-xl text-center">
        Use the map below to select a region. Once done, click "Submit Region" to save your selection.
      </p>
      <div className="w-full max-w-screen-lg h-[400px] border-2 border-zinc-700 rounded-2xl overflow-hidden shadow-lg">
        <SelectMapArea apiKey={GOOGLE_MAPS_API_KEY} onPolyComplete={handlePolyComplete} />
      </div>
      <div className="flex space-x-4 mt-6">
        <button
          onClick={submitPoly}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-semibold shadow-lg"
        >
          Submit Region
        </button>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-xl font-semibold shadow-lg"
        >
          Later
        </button>
      </div>
    </main>
  );
};

export default SelectRoiPage;
