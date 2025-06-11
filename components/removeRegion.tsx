'use client';

import { useUser } from '../app/context/userContext';
import React, { useEffect, useState } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { RegionPolygon } from '../app/map/PostMapView';

const GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY';

const RemoveRegion = () => {
  const { interestRegions, userLoaded, loadProfile } = useUser();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    const confirmed = (name == "")
            ? 
         window.confirm(`Are you sure you want to delete this region?`)
            :
        window.confirm(`Are you sure you want to delete the region: ${name}?`)
    if (!confirmed) return;
    
    const res = await fetch('/api/select-roi', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });

    if (res.ok && loadProfile) {
      await loadProfile(); // refresh regions
      setSelectedId(null);
    } else {
      alert("Failed to delete region.");
    }
  };

  if (!userLoaded || interestRegions.length === 0) return <div>Loading or no regions</div>;

  const center = interestRegions[0]?.center || { lat: 51.5, lng: -0.12 };
  console.log(interestRegions);
  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <Map
        zoomControl
        scrollwheel
        defaultZoom={13}
        gestureHandling="greedy"
        mapId="a2bc871f26d67c06e4448720"
        style={{ width: '100%', height: '100vh' }}
        mapTypeControl={false}
        defaultCenter={center}
      >
        {
        
        interestRegions.map(({ perimeter, id, name }, index) => (
          <RegionPolygon
            key={id}
            region={perimeter}
            onClick={() => handleDelete(id, name)}
            name={name}
          />
        ))}
      </Map>
    </APIProvider>
  );
};

export default RemoveRegion;
