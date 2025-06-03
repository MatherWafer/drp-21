import React, { useState, useCallback, useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import PostOverview, { PostInfo } from '../user/posts/PostOverview';
import PostMarker from './PostMarker';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

interface PostMapViewProps {
  onLocationSelect?: (coordinates: LocationCoordinates) => void;
  initialLocation?: LocationCoordinates;
  apiKey: string;
  posts: PostInfo[]
}

const PostMapView: React.FC<PostMapViewProps> = ({
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
          (error) => {
            console.error('Error getting user location:', error);
          }
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
        onLoad={() => console.log('APIProvider loaded')}
        onError={(error) => {
          console.error('APIProvider error:', error);
          setApiError(`Failed to load Google Maps API: ${error}`);
        }}
      >
        <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
          <label htmlFor="radius-select" style={{ marginRight: '8px' }}>Search Radius:</label>
          <select
            id="radius-select"
            value={radiusMiles}
            onChange={(e) => setRadiusMiles(Number(e.target.value))}
          >
            <option value={0}>-- Select Radius --</option>
            {[0.25, 0.5, 1, 1.5, 2, 3, 4].map((miles) => (
              <option key={miles} value={miles}>{miles} miles</option>
            ))}
          </select>
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
            {posts.map(post => <PostMarker setter={setFocusedPost} key={post.id} post={post}/>)}
                        
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

          {userLocation && (
            <RadiusCircle center={userLocation} radiusMiles={radiusMiles} />
          )}
          
          <PanToUserLocation userLocation={userLocation} radiusMiles={radiusMiles} />
          </Map>
        </div>
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
      const zoom = getZoomForRadius(radiusMiles);
      map.setZoom(zoom);
    }
  }, [map, userLocation, radiusMiles]);

  return null;
};

// Circle component to show the user's location radius
const RadiusCircle: React.FC<{
    center: LocationCoordinates;
    radiusMiles: number;
  }> = ({ center, radiusMiles }) => {
  const map = useMap();
  const circleRef = useRef<google.maps.Circle | null>(null);

  useEffect(() => {
    if (!map || !center || radiusMiles === 0) return;

    const radiusMeters = radiusMiles * 1609.34;

    if (circleRef.current) {
      circleRef.current.setMap(null);
    }

    circleRef.current = new google.maps.Circle({
      center,
      radius: radiusMeters,
      map,
      strokeColor: '#4285f4',
      strokeOpacity: 0.5,
      strokeWeight: 2,
      fillColor: '#4285f4',
      fillOpacity: 0.1,
    });

    return () => {
      if (circleRef.current) {
        circleRef.current.setMap(null);
      }
    };
  }, [map, center, radiusMiles]);

  return null;
};

export default PostMapView;