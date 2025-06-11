'use client';

import React, { useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import SelectMapArea from '../app/map/SelectMapArea';
import { getRoiData, useUser } from '../app/context/userContext';

const SelectRoiPage = () => {
  const [poly, setPoly] = useState<google.maps.MVCArray<google.maps.LatLng>>();
  const [showModal, setShowModal] = useState(false);
  const [regionName, setRegionName] = useState('');
  const router = useRouter();
  const GOOGLE_MAPS_API_KEY = "AIzaSyCGTpExS27yGMpb0fccyQltC1xQe9R6NVY";
  const { loadProfile, setInterestRegions, interestRegions } = useUser();

  const handlePolyComplete = (p: google.maps.Polygon) => {
    setPoly(p.getPath());
  };

  const submitPoly = async () => {
    if (!poly) {
      alert("You need to select a region.");
      return;
    }
    setShowModal(true);
  };

  const confirmSave = async () => {
    if (!regionName.trim()) {
      alert("Please enter a name for the region.");
      return;
    }

    const res = await fetch("/api/select-roi", {
      method: "POST",
      body: JSON.stringify({
        region: poly!.getArray(),
        name: regionName
      }),
    });

    if (res.ok) {
      loadProfile && (await loadProfile());
      router.push("/");
    } else {
      alert("Failed to save region.");
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
      {showModal && (
        <div className="absolute inset-0 bg-teal-800 bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-teal-700 rounded-lg p-6 w-80 shadow-lg">
            <h2 className="text-white text-lg font-semibold mb-4">Name this region</h2>
            <input
              type="text"
              value={regionName}
              onChange={(e) => setRegionName(e.target.value)}
              className="text-white w-full px-3 py-2 border border-gray-300 rounded mb-4"
              placeholder="e.g. Home Area"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                onClick={confirmSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectRoiPage;