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
      body: JSON.stringify({ region: poly.getArray() }),
    });
    if (res.ok) {
      loadProfile && (await loadProfile())
      router.push("/")
    }
  };

  return (
    <main className="text-center bg-white text-teal m-0">
      <div className='bg-black'>
        <button onClick={submitPoly}>oiewgN</button>
      </div>
        <SelectMapArea apiKey={GOOGLE_MAPS_API_KEY} onPolyComplete={handlePolyComplete} />
    </main>
  );
};

export default SelectRoiPage;
