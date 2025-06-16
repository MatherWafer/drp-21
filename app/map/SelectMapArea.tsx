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
  containerStyle = { height: '100%', width: '100%' }
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
      <div style={{ ...containerStyle, position: 'relative' }}>
        {/* Improved Hint Box */}
        {isDrawing && showHint && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
            textAlign: 'center',
            maxWidth: '90%',
            fontSize: '14px',
            backdropFilter: 'blur(2px)'
          }}>
            <p style={{ margin: 0 }}>
              Press to place points outlining your region. Join it up to complete.
            </p>
          </div>
        )}

        {/* Control Button */}
        <div style={{ 
          position: 'absolute',
          top: '90px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => { 
              setIsDrawing((prev) => !prev);
              setShowHint(true);
              if (polygon) {
                polygon.setMap(null); 
                setPolygon(null);
              }
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: isDrawing ? '#00c853' : '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease',
            }}
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
        </Map>

        <PolygonDrawer
          isDrawing={isDrawing}
          onPolygonComplete={(poly) => {
            if (polygon) {
              polygon.setMap(null); 
            }
            onPolyComplete(poly)
            setPolygon(poly);
            setIsDrawing(false);
            setShowHint(false);
          }}
          onPointAdded={() => setShowHint(false)}
        />
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
        editable: true, // Ensure editable for path listening
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