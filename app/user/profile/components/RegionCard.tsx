"use client"
import React from 'react';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import { RoiData, useUser } from '../../../context/userContext';
import { LatLng } from '../../../api/util/geoHelpers';

interface RegionGridProps {
  apiKey: string;
  onRedraw?: (regionId: string) => void;
  onDelete?: (regionId: string) => void;
}

const RegionPolygon = ({ region }: { region: LatLng[] }) => {
  const polygonRef = React.useRef<google.maps.Polygon | null>(null);
  const map = useMap();

  React.useEffect(() => {
    if (!map || !region || region.length === 0) return;

    polygonRef.current = new window.google.maps.Polygon({
      paths: region,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.1,
      map: map
    });

    const bounds = new window.google.maps.LatLngBounds();
    region.forEach(point => bounds.extend(point));
    map.fitBounds(bounds);

    return () => {
      if (polygonRef.current) {
        polygonRef.current.setMap(null);
      }
    };
  }, [map, region]);

  return null;
};

const RegionMapCard = ({ 
  region, 
  onRedraw, 
  onDelete, 
  apiKey 
}: {
  region: RoiData;
  onRedraw: () => void;
  onDelete: () => void;
  apiKey: string;
}) => {
  const handleMapLoad = (map: google.maps.Map) => {
    setTimeout(() => {
      if (region.center) {
        map.panTo(region.center);
      }
      window.dispatchEvent(new Event('resize'));
    }, 100);
  };

  return (
    <div className="flex flex-col border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-800">{region.name || "Your region"}</h3>
      </div>
      
      <div className="w-full h-48 relative">
        <APIProvider apiKey={apiKey}>
          <Map
            mapId={`map-${region.id}`}
            className="w-full h-full"
            center={region.center}
            zoom={13}
            gestureHandling="none"
            disableDefaultUI
            draggable={false}
          >
            <RegionPolygon region={region.perimeter} />
          </Map>
        </APIProvider>
      </div>
      
      <div className="flex justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
        <button
          onClick={onDelete}
          className="px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export const RegionsGrid = ({
  apiKey = "AIzaSyCGTpExS27yGMpb0fccyQltC1xQe9R6NVY",
  onDelete = () => {},
  onRedraw = () => {}
}: RegionGridProps) => {
  const {interestRegions} = useUser()
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {interestRegions.map(region => (
        <RegionMapCard
          key={region.id}
          region={region}
          apiKey={apiKey}
          onRedraw={() => onRedraw(region.id)}
          onDelete={() => onDelete(region.id)}
        />
      ))}
    </div>
  );
};

export default RegionsGrid