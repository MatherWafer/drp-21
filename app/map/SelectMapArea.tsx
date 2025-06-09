import React, { useState, useCallback, useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import PostOverview, { PostInfo } from '../user/posts/PostOverview';
import PostMarker from './PostMarker';

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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(coords);
        },
      );
    } else {
      console.warn('Geolocation not supported by this browser.');
    }
  }, []);

  return (
    <APIProvider
      apiKey={apiKey}
      libraries={['drawing']}
      onLoad={() => console.log('APIProvider loaded')}
      onError={(error) => {
        console.error('APIProvider error:', error);
      }}
    >
      <div style={{ ...containerStyle, position: 'relative' }}>
        {/* Centered button positioned absolutely over the map */}
        <div style={{ 
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => { 
              setIsDrawing((prev) => !prev);
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
            {isDrawing ? 'Reset Area' : 'Draw Area'}
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
          }}
        />
      </div>
    </APIProvider>
  );
};

const PolygonDrawer: React.FC<{
  isDrawing: boolean;
  onPolygonComplete: (polygon: google.maps.Polygon) => void;
}> = ({ isDrawing, onPolygonComplete }) => {
  const map = useMap();
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);

  useEffect(() => {
    if (!map || !isDrawing) return;
    
    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: false,
      polygonOptions: {
        fillColor: '#00bcd4',
        fillOpacity: 0.3,
        strokeColor: '#00acc1',
        strokeWeight: 4,
        clickable: false,
        editable: false,
        zIndex: 1,
      }
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
        }
      }
    );

    return () => {
      google.maps.event.removeListener(completeListener);
      drawingManager.setMap(null);
    };
  }, [map, isDrawing, onPolygonComplete]);

  return null;
};

export default SelectMapArea;