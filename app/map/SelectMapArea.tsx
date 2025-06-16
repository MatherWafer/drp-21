
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

interface SelectMapAreaProps {
  onPolyComplete: (poly: google.maps.Polygon) => void;
  initialLocation?: LocationCoordinates;
  apiKey: string;
  containerStyle?: React.CSSProperties;
}

const SelectMapArea: React.FC<SelectMapAreaProps> = ({
  onPolyComplete,
  initialLocation = { lat: 51.512409, lng: -0.125146 },
  apiKey,
  containerStyle = { height: '100%', width: '100%' },
}) => {
  const [userLocation, setUserLocation] = useState<LocationCoordinates | null>(null);
  const [polygon, setPolygon] = useState<google.maps.Polygon | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => console.warn('Geolocation permission denied')
      );
    }
  }, []);

  return (
    <APIProvider
      apiKey={apiKey}
      libraries={['drawing']}
      onLoad={() => setIsDrawing(true)}
    >
      <div className="flex flex-col w-full h-full">
        {isDrawing && showHint && (
          <div    className="z-10 px-4 py-4 bg-teal-600 text-white rounded  text-center">
            <p className="text-sm sm:text-base m-0">
              Press to place points outlining your region. Join it up to complete.
            </p>
          </div>
        )}

        {/* Map Container */}
        <div style={{ ...containerStyle, position: 'relative' }}>
          {/* Control Button */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex justify-center">
            <button
              onClick={() => {
                setIsDrawing((prev) => !prev);
                setShowHint(true);
                if (polygon) {
                  polygon.setMap(null);
                  setPolygon(null);
                }
              }}
              className={`px-5 py-2 text-white rounded-lg shadow-md text-sm font-medium transition-all duration-300 ${
                isDrawing ? 'bg-green-500 hover:bg-green-400' : 'bg-blue-500 hover:bg-blue-400'
              }`}
            >
              {isDrawing ? 'Reset Area' : 'Redraw Area'}
            </button>
          </div>

          <Map
            zoomControl={true}
            scrollwheel={true}
            defaultZoom={13}
            gestureHandling="greedy"
            defaultCenter={initialLocation}
            mapId="a2bc871f26d67c06e4448720"
            style={{ width: '100%', height: '100%' }}
            mapTypeControl={false}
          >
            <PolygonDrawer
              isDrawing={isDrawing}
              onPolygonComplete={(poly) => {
                if (polygon) {
                  polygon.setMap(null);
                }
                onPolyComplete(poly);
                setPolygon(poly);
                setIsDrawing(false);
                setShowHint(false);
              }}
              onPointAdded={() => setShowHint(false)}
            />
          </Map>
        </div>
      </div>
    </APIProvider>
  );
};

const PolygonDrawer: React.FC<{
  isDrawing: boolean;
  onPolygonComplete: (polygon: google.maps.Polygon) => void;
  onPointAdded: () => void;
}> = ({ isDrawing, onPolygonComplete, onPointAdded }) => {
  const map = useMap();
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const pathListenerRef = useRef<google.maps.MapsEventListener | null>(null);

  useEffect(() => {
    if (!map || !isDrawing) {
      // Clear existing markers when not drawing
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      if (pathListenerRef.current) {
        google.maps.event.removeListener(pathListenerRef.current);
        pathListenerRef.current = null;
      }
      return;
    }

    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: false,
      polygonOptions: {
        fillColor: '#00bcd4',
        fillOpacity: 0.3,
        strokeColor: '#00acc1',
        strokeWeight: 4,
        clickable: false,
        editable: true,
        zIndex: 1,
      },
    });

    drawingManager.setMap(map);
    drawingManagerRef.current = drawingManager;

    const completeListener = google.maps.event.addListener(
      drawingManager,
      'overlaycomplete',
      (event: google.maps.drawing.OverlayCompleteEvent) => {
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          const polygon = event.overlay as google.maps.Polygon;
          drawingManager.setDrawingMode(null);
          onPolygonComplete(polygon);
          // Clear all markers when polygon is complete
          markersRef.current.forEach((marker) => marker.setMap(null));
          markersRef.current = [];
          if (pathListenerRef.current) {
            google.maps.event.removeListener(pathListenerRef.current);
            pathListenerRef.current = null;
          }
        }
      }
    );

    // Listen for new vertices added to the polygon
    google.maps.event.addListener(
      drawingManager,
      'polygoncomplete',
      (polygon: google.maps.Polygon) => {
        const path = polygon.getPath();
        pathListenerRef.current = google.maps.event.addListener(
          path,
          'insert_at',
          (index: number) => {
            const position = path.getAt(index);
            // Add marker at the new vertex
            const marker = new google.maps.Marker({
              position,
              map: map,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 6,
                fillColor: '#00acc1',
                fillOpacity: 0.8,
                strokeColor: '#ffffff',
                strokeWeight: 2,
              },
            });
            markersRef.current.push(marker);
            onPointAdded();
          }
        );
      }
    );

    return () => {
      if (completeListener) {
        google.maps.event.removeListener(completeListener);
      }
      if (pathListenerRef.current) {
        google.maps.event.removeListener(pathListenerRef.current);
      }
      if (drawingManagerRef.current) {
        drawingManagerRef.current.setMap(null);
      }
      // Clear markers on cleanup
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, [map, isDrawing, onPolygonComplete, onPointAdded]);

  return null;
};

export default SelectMapArea;
