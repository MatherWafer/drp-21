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
}

const SelectMapArea: React.FC<SelectMapAreaProps> = ({
  onPolyComplete,
  initialLocation = { lat: 51.512409, lng: -0.125146 },
  apiKey,
}) => {
  const [userLocation, setUserLocation] = useState<LocationCoordinates | null>(null); // For live location
  const [polygon, setPolygon] = useState<google.maps.Polygon | null>(null); // For Selected Area
  const [isDrawing, setIsDrawing] = useState(false); // For Polygon Drawing  
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
        <div style={{ marginBottom: '1rem', justifyContent: 'center' }}>
          <button
            onClick={() => { setIsDrawing((prev) => !prev);
                             // remove old polygon if exists
                             if (polygon) {
                               polygon.setMap(null); 
                               setPolygon(null);
                             }
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: isDrawing ? '#00c853' : '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {isDrawing ? 'Reset Area' : 'Draw Area'}
          </button>
        </div>

        
        <div style={{ height: '400px', width: '100%', marginBottom: '20px' }}>
          <Map
            zoomControl={true}
            scrollwheel={true}
            defaultZoom={13}
            gestureHandling="cooperative"
            defaultCenter={initialLocation}
            mapId="a2bc871f26d67c06e4448720"
            style={{ width: '100%', height: '100%' }}
          >
          
          </Map>
        </div>

        <PolygonDrawer
          isDrawing={isDrawing}
          onPolygonComplete={(poly) => {
            if (polygon) {
              // remove old
              polygon.setMap(null); 
            }
            onPolyComplete(poly)
            setPolygon(poly);
            setIsDrawing(false);
          }}
        />
      </APIProvider>
  );
};


// Map out area
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

          console.log("Logging from polyogn drawer")
          console.log(polygon)
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