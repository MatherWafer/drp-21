import React, { useState, useCallback, useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import PostOverview, { PostInfo } from '../user/posts/PostOverview';
import PostMarker from './PostMarker';
import { useCategory } from '../user/posts/CategoryContext';

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
  const { category } = useCategory();
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const [focsedPost,setFocusedPost] = useState<PostInfo>()
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
            {posts.filter(post => category == 'None' || category == post.category).
              map(post => <PostMarker setter={setFocusedPost} key={post.id} post={post}/>)}
          </Map>
        </div>
        {focsedPost && <PostOverview post={focsedPost as PostInfo}/>}
      </APIProvider>
  );
};

export default PostMapView;