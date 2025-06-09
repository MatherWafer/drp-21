import React, { useState, useCallback, useEffect, useRef } from 'react';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import PostOverview, { PostInfo } from '../user/posts/PostOverview';
import PostMarker from './PostMarker';
import { useFiltered } from '../user/posts/FilterContext';
import { LatLng } from '../api/util/geoHelpers';
import { RoiData, useUser } from '../context/userContext';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

const RegionPolygon: React.FC<{ region: LatLng[] }> = ({ region }) => {
  const polygonRef = useRef<google.maps.Polygon | null>(null);
  const map = useMap();

  useEffect(() => {
    if (!map || !window.google || !window.google.maps || region.length === 0) return;

    if (polygonRef.current) {
      polygonRef.current.setMap(null);
    }

    polygonRef.current = new window.google.maps.Polygon({
      paths: region,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.1,
    });

    polygonRef.current.setMap(map);

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
  posts: PostInfo[];
  interestRegion: RoiData;
}

const PostMapView: React.FC<PostMapViewProps> = ({
  onLocationSelect,
  apiKey,
  posts,
  interestRegion,
}) => {
  const { category, filtered } = useFiltered();
  const [focusedPost, setFocusedPost] = useState<PostInfo>();
  const [genericFeed, setGenericFeed] = useState<PostInfo[]>([]);
  const [userLocation, setUserLocation] = useState<LocationCoordinates | null>(null);
  const alertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.warn('Geolocation not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    if (filtered && genericFeed.length === 0) {
      getGenericFeed();
    }
  }, [filtered]);

  const getGenericFeed = async () => {
    try {
      const res = await fetch('/api/posts/feed', { method: 'GET', headers: { 'x-filter-roi': 'false' } });
      if (!res.ok) throw new Error('Failed to fetch posts');
      const data = await res.json();
      setGenericFeed(data.posts);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (!focusedPost) return; 

    if (alertRef.current && !alertRef.current.contains(event.target as Node)) {
      setFocusedPost(undefined);
    }
  }

  document.addEventListener('mousedown', handleClickOutside);

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [focusedPost]);

  const displayedPosts = filtered ? posts : genericFeed;

  const handleMapClick = useCallback(
    (event: any) => {
      if (event.detail?.latLng) {
        const newLocation = {
          lat: event.detail.latLng.lat,
          lng: event.detail.latLng.lng,
        };
        onLocationSelect?.(newLocation);
      }
    },
    [onLocationSelect]
  );

  return (
    <>
      {focusedPost && (
        <div
          ref={alertRef}
         className="fixed top-50 z-50 w-full px-3 py-2"

        >
          <button
          onClick={() => setFocusedPost(undefined)}
          className="absolute top-2 right-4 text-yellow-800 hover:text-yellow-600 font-bold text-xl leading-none"
          aria-label="Close"
        >
          &times;
        </button>
          <PostOverview key={focusedPost.id} post={focusedPost} />
        </div>
      )}

      <APIProvider
        apiKey={apiKey}
        onLoad={() => console.log('APIProvider loaded')}
        onError={(error) => {
          console.error('APIProvider error:', error);
        }}
      >
        <div style={{ height: '100vh', width: '100%' }}>
          <Map
            zoomControl={true}
            scrollwheel={true}
            defaultZoom={13}
            gestureHandling="greedy"
            mapId="a2bc871f26d67c06e4448720"
            style={{ width: '100%', height: '100vh' }}
            mapTypeControl={false}
            defaultCenter={interestRegion.center}
            onCenterChanged={(e) => {
              console.log(e.detail)
            }}
            onClick={handleMapClick}
          >
            {displayedPosts.length > 0 && displayedPosts
              .filter((post) => category === 'None' || category === post.category)
              .map((post) => (
                <PostMarker setter={setFocusedPost} key={post.id} post={post} />
              ))}
            <RegionPolygon region={interestRegion.perimeter} />
          </Map>
        </div>
      </APIProvider>
    </>
  );
};

export default PostMapView;
