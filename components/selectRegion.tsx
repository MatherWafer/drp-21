'use client';

import React, { useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import SelectMapArea from '../app/map/SelectMapArea';
import { getRoiData, useUser } from '../app/context/userContext';

const SelectRoiPage = () => {
  const [poly, setPoly] = useState<google.maps.MVCArray<google.maps.LatLng>>();
  const router = useRouter();
  const GOOGLE_MAPS_API_KEY = "AIzaSyCGTpExS27yGMpb0fccyQltC1xQe9R6NVY";
  const { loadProfile, setInterestRegion } = useUser();

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
      loadProfile && (await loadProfile());
      setInterestRegion(getRoiData(poly.getArray().map(ll => ll.toJSON()) ))
      router.push("/");
    }
  };

  return (
    <div className="relative h-full">
      <SelectMapArea 
        apiKey={GOOGLE_MAPS_API_KEY} 
        onPolyComplete={handlePolyComplete} 
      />
      <button 
        onClick={submitPoly}
        className="absolute bottom-4 right-4 z-10 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
      >
        Save Region
      </button>
    </div>
  );
};

export default SelectRoiPage;