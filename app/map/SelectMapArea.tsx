import React, { useState, useCallback, useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import PostOverview, { PostInfo } from '../user/posts/PostOverview';
import PostMarker from './PostMarker';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

interface SelectMapAreaProps {
  onLocationSelect?: (coordinates: LocationCoordinates) => void;
  initialLocation?: LocationCoordinates;
  apiKey: string;
  posts: PostInfo[]
}

const SelectMapArea: React.FC<SelectMapAreaProps> = ({
  onLocationSelect,
  initialLocation = { lat: 51.512409, lng: -0.125146 },
  apiKey,
  posts
}) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationCoordinates>(initialLocation);
  const [locationName, setLocationName] = useState<string>('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const [focusedPost,setFocusedPost] = useState<PostInfo>()
  const [userLocation, setUserLocation] = useState<LocationCoordinates | null>(null); // For live location
  const [radiusMiles, setRadiusMiles] = useState(0); // Radius Circle
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

  // Function to perform geocoding via HTTP API
  const geocodeViaHttp = async (location: LocationCoordinates) => {
    try {
      setIsGeocoding(true);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${apiKey}`
      );
      const data = await response.json();
      setIsGeocoding(false);
      if (data.status === 'OK' && data.results?.[0]) {
        setLocationName(data.results[0].formatted_address.split(',')[0]);
        setApiError(null);
      } else {
        setLocationName('Unknown location');
        setApiError(`Geocoding failed: ${data.status}`);
        console.error('Geocoding error:', data.status, data.error_message);
      }
    } catch (error) {
      setIsGeocoding(false);
      setLocationName('Unknown location');
      setApiError('Geocoding API request failed');
      console.error('Geocoding API error:', error);
    }
  };

  const handleMapClick = useCallback((event: any) => {
    if (event.detail?.latLng) {
      const newLocation = {
        lat: event.detail.latLng.lat,
        lng: event.detail.latLng.lng,
      };
      setSelectedLocation(newLocation);
      onLocationSelect?.(newLocation);
    }
  }, [onLocationSelect]);


  return (
      <APIProvider
        apiKey={apiKey}
        libraries={['drawing']}
        onLoad={() => console.log('APIProvider loaded')}
        onError={(error) => {
          console.error('APIProvider error:', error);
          setApiError(`Failed to load Google Maps API: ${error}`);
        }}
      >
        <div style={{ marginBottom: '1rem' }}>
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
            onClick={handleMapClick}
          >
            {userLocation && (
            <AdvancedMarker position={userLocation}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: '#4285f4',
                  border: '2px solid white',
                  boxShadow: '0 0 6px rgba(0,0,0,0.5)',
                }}
                title="Your Location"
              />
            </AdvancedMarker>
          )}
          
          <PanToUserLocation userLocation={userLocation} radiusMiles={radiusMiles} />
          </Map>
        </div>

        <PolygonDrawer
          isDrawing={isDrawing}
          onPolygonComplete={(poly) => {
            if (polygon) {
              // remove old
              polygon.setMap(null); 
            }
            setPolygon(poly);
            setIsDrawing(false);

            //This is all DEBUG
            const path = poly.getPath().getArray();
            const coords = path.map(latlng => ({
              lat: latlng.lat(),
              lng: latlng.lng(),
            }));
            console.log('Polygon coordinates:', coords);
          }}
        />


        {focusedPost && <PostOverview post={focusedPost as PostInfo}/>}
      </APIProvider>
  );
};

// Component to pan the map to the user's current location
const PanToUserLocation: React.FC<{ userLocation: LocationCoordinates | null, radiusMiles: number }> = ({ userLocation, radiusMiles }) => {
  const map = useMap();
  const hasPannedRef = useRef(false);

  // Determine zoom level based on radius
  const getZoomForRadius = (miles: number): number => {
    if (miles <= 0.25) return 16.5;
    if (miles <= 0.5) return 15.5;
    if (miles <= 1) return 14;
    if (miles <= 1.5) return 13;
    if (miles <= 2) return 12.5; 
    if (miles <= 3) return 12;
    if (miles <= 4) return 11.5;
    return 14;
  };

  useEffect(() => {
    if (!map || !userLocation) return;

    // Pan to location (once)
    if (!hasPannedRef.current) {
      map.panTo(userLocation);
      hasPannedRef.current = true;
    }

    if (radiusMiles > 0) {
      map.panTo(userLocation);
      const zoom = getZoomForRadius(radiusMiles);
      map.setZoom(zoom);
    }
  }, [map, userLocation, radiusMiles]);

  return null;
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
        fillOpacity: 0.2,
        strokeColor: '#00acc1',
        strokeWeight: 2,
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
          drawingManager.setDrawingMode(null); // stop drawing
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