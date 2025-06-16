'use client';

import React, { useEffect, useRef } from 'react';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import { LatLng } from '../../../api/util/geoHelpers';
import { RoiData } from '../../../context/userContext';

// Helper function to calculate zoom level from radius (in miles)
const calculateZoomFromRadius = (radiusMiles: number, mapHeightPx: number) => {
  const MILES_TO_DEGREES = 0.0145; // 1 mile ≈ 0.0145 degrees at mid-latitudes
  const diameterDegrees = radiusMiles * 2 * MILES_TO_DEGREES;
  const zoomScale = Math.log2(360 / diameterDegrees);
  const pxAdjustment = Math.log2(mapHeightPx / 256); // 256 = standard tile size
  return Math.min(18, Math.max(5, Math.floor(zoomScale - pxAdjustment + 1)));
};

interface RegionPolygonProps {
  region: LatLng[];
  color?: string;
}

const RegionPolygon: React.FC<RegionPolygonProps> = ({ region, color = '#3B82F6' }) => {
  const polygonRef = useRef<google.maps.Polygon | null>(null);
  const map = useMap();

  useEffect(() => {
    if (!map || !region || region.length === 0) return;

    polygonRef.current = new window.google.maps.Polygon({
      paths: region,
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: color,
      fillOpacity: 0.1,
      map: map
    });

    return () => {
      if (polygonRef.current) {
        polygonRef.current.setMap(null);
      }
    };
  }, [map, region, color]);

  return null;
};

interface RoiDisplayProps {
  apiKey: string;
  interestRegion: RoiData & { radiusMiles?: number };
  onDelete?: () => void;
  compact?: boolean;
}

const RoiDisplay: React.FC<RoiDisplayProps> = ({ 
  apiKey, 
  interestRegion, 
  onDelete,
  compact = true 
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [calculatedZoom, setCalculatedZoom] = React.useState(11);

  const containerStyle = {
    width: '100%',
    height: compact ? '200px' : '400px',
    minHeight: compact ? '150px' : '300px'
  };

  useEffect(() => {
    if (interestRegion.radiusMiles) {
      const zoom = calculateZoomFromRadius(
        interestRegion.radiusMiles,
        compact ? 200 : 400
      );
      setCalculatedZoom(zoom);
    }
  }, [interestRegion.radiusMiles, compact]);

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    
    setTimeout(() => {
      if (interestRegion.center) {
        map.panTo(interestRegion.center);
      }
      if (interestRegion.perimeter?.length > 0) {
        if (interestRegion.radiusMiles) {
          map.setZoom(calculatedZoom);
        } else {
          const bounds = new window.google.maps.LatLngBounds();
          interestRegion.perimeter.forEach(point => bounds.extend(point));
          map.fitBounds(bounds, compact ? 30 : 50);
        }
      }
    }, 100);
  };

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden shadow-sm ${compact ? 'w-full' : ''}`}>
      <div className="flex items-center justify-between bg-gray-50 p-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-800 text-sm truncate">
            {interestRegion.name || 'Unnamed Region'}
          </h3>
          {interestRegion.radiusMiles && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {interestRegion.radiusMiles <= 1 
                ? `${(interestRegion.radiusMiles * 5280).toFixed(0)} ft` 
                : `${interestRegion.radiusMiles.toFixed(1)} mi`}
            </span>
          )}
        </div>
        {onDelete && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              console.log("AFOIm")
              onDelete();
            }}
            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
            title="Delete region"
            aria-label="Delete region"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      <div style={containerStyle}>
        <APIProvider apiKey={apiKey}>
          <Map
            mapId={compact ? "compact-roi-map" : "detailed-roi-map"}
            style={containerStyle}
            center={interestRegion.center}
            zoom={calculatedZoom }
            gestureHandling="none"
            disableDefaultUI
            keyboardShortcuts={false}
            zoomControl={false}
            mapTypeControl={false}
            scaleControl={false}
            streetViewControl={false}
            fullscreenControl={false}
            rotateControl={false}
            clickableIcons={false}
            draggable={false}
          >
            <RegionPolygon region={interestRegion.perimeter} />
          </Map>
        </APIProvider>
      </div>
    </div>
  );
};

export default RoiDisplay;