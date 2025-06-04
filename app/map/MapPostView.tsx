import React, { useState, useCallback, useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import PostOverview, { PostInfo } from '../user/posts/PostOverview';
import PostMarker from './PostMarker';
import CategoryDropdown from '../user/posts/CategoryDropdown';
import { useCategory } from '../user/posts/CategoryContext';
import { LatLng } from '../api/util/geoHelpers';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}


const RegionPolygon: React.FC<{ region: LatLng[] }> = ({ region }) => {
  const polygonRef = useRef<google.maps.Polygon | null>(null);
  const map = useMap();
  
  useEffect(() => {
    if (!map || !window.google || !window.google.maps || region.length === 0) return;

    // Remove existing polygon if any
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
    }

    // Create the polygon
    polygonRef.current = new window.google.maps.Polygon({
      paths: region,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.1,
    });

    polygonRef.current.setMap(map);

    // Cleanup on unmount or region/map change
    return () => {
      if (polygonRef.current) {
        polygonRef.current.setMap(null);
      }
    };
  }, [region, map]);

  return null;
};


interface PostMapViewProps {
  onLocationSelect?: (coordinates: LocationCoordinates) => void;
  initialLocation?: LocationCoordinates;
  apiKey: string;
  posts: PostInfo[]
  interestRegion: LatLng[]
}

const PostMapView: React.FC<PostMapViewProps> = ({
  onLocationSelect,
  initialLocation = { lat: 51.512409, lng: -0.125146 },
  apiKey,
  posts,
  interestRegion
}) => {
  const { category } = useCategory();
  const [focusedPost,setFocusedPost] = useState<PostInfo>()
  const [userLocation, setUserLocation] = useState<LocationCoordinates | null>(null); // For live location
  initialLocation = interestRegion ? 
  averageLoc(interestRegion)
  : initialLocation
  
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


  const handleMapClick = useCallback((event: any) => {
    if (event.detail?.latLng) {
      const newLocation = {
        lat: event.detail.latLng.lat,
        lng: event.detail.latLng.lng,
      };
      onLocationSelect?.(newLocation);
    }
  }, [onLocationSelect]);


  return (
      <APIProvider
        apiKey={apiKey}
        onLoad={() => console.log('APIProvider loaded')}
        onError={(error) => {
          console.error('APIProvider error:', error);
        }}
      >
        <CategoryDropdown/>




        <div style={{ height: '400px', width: '100%', marginBottom: '20px' }}>
          <Map
            zoomControl={true}
            scrollwheel={true}
            defaultZoom={13}
            gestureHandling="cooperative"
            defaultCenter={userLocation || initialLocation}
            mapId="a2bc871f26d67c06e4448720"
            style={{ width: '100%', height: '100%' }}
            onClick={handleMapClick}
          >
            {posts.filter(post => category == 'None' || category == post.category).
              map(post => <PostMarker setter={setFocusedPost} key={post.id} post={post}/>)}
          </Map>
        </div>
        
        <RegionPolygon region={interestRegion}/>
  

        {focusedPost && <PostOverview post={focusedPost as PostInfo}/>}
      </APIProvider>
  );
};

// Component to pan the map to the user's current location

// Circle component to show the user's location radius


export default PostMapView;
function averageLoc(interestRegion: LatLng[]): LocationCoordinates {
  
  const { lat, lng } = interestRegion.reduce(
    (acc, { lat, lng }) => ({
      lat: acc.lat + lat,
      lng: acc.lng + lng
    }),
    { lat: 0, lng: 0 }
  );

  return {
    lat: lat / interestRegion.length,
    lng: lng / interestRegion.length
  };
}