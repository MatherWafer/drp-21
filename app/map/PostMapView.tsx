import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { APIProvider, Map, Marker, useMap } from '@vis.gl/react-google-maps';
import PostOverview, { PostInfo } from '../user/posts/PostOverview';
import PostMarker from './PostMarker';
import { useFiltered } from '../user/posts/FilterContext';
import { LatLng } from '../api/util/geoHelpers';
import { RoiData, useUser } from '../context/userContext';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

interface RegionPolygonProps {
  region: LatLng[];
  name: string;
  onClick?: () => void;
}

const maxLikes = (posts: PostInfo[]): number => {
  return Math.max(...posts.map(post => post.likeCount))
}

const computeCentroid = (coords: LatLng[]): LatLng => {
    const latSum = coords.reduce((sum, point) => sum + point.lat, 0);
    const lngSum = coords.reduce((sum, point) => sum + point.lng, 0);
    return {
      lat: latSum / coords.length,
      lng: lngSum / coords.length,
    };
  };

export const RegionPolygon: React.FC<RegionPolygonProps> = ({ region, onClick, name }) => {
  const polygonRef = useRef<google.maps.Polygon | null>(null);
  const clickListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const map = useMap();

  useEffect(() => {
    if (!map || !window.google || !window.google.maps || region.length === 0) return;

    if (polygonRef.current) {
      polygonRef.current.setMap(null);
    }

    const polygon = new window.google.maps.Polygon({
      paths: region,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.1,
    });

    polygon.setMap(map);
    polygonRef.current = polygon;

    if (onClick) {
      clickListenerRef.current = google.maps.event.addListener(polygon, 'click', (e: google.maps.MapMouseEvent) => {
        e.domEvent?.stopPropagation(); // prevent map click propagation
        onClick();
      });
    }

    return () => {
      polygon.setMap(null);
      if (clickListenerRef.current) {
        google.maps.event.removeListener(clickListenerRef.current);
      }
    };
  }, [region, map, onClick]);
  console.log(name)
  return        <Marker
                  position={computeCentroid(region)}
                  label={{
                    text: name == "" ? " " : name,
                    color: '#FF4444',
                    fontSize: '16px',
                    fontWeight: 'bold',
                  }}
                  icon={{
                    url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=',
                    scaledSize: new window.google.maps.Size(1, 1),
                  }}
                  clickable={false}
                  zIndex={0}
                />
};

interface PostMapViewProps {
  onLocationSelect?: (coordinates: LocationCoordinates) => void;
  initialLocation?: LocationCoordinates;
  apiKey: string;
  posts: PostInfo[];
  interestRegion: RoiData[];
}

const PostMapView: React.FC<PostMapViewProps> = ({
  onLocationSelect,
  apiKey,
  posts,
  interestRegion,
}) => {
  const { category, filtered } = useFiltered();
  const [focusedPost, setFocusedPost] = useState<PostInfo>();
  const [userLocation, setUserLocation] = useState<LocationCoordinates | null>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const highestLikes = useMemo(() => maxLikes(posts),[posts])
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
          onClick={() => {
            setFocusedPost(undefined)}}
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
            defaultCenter={interestRegion[0]?.center ?? { lat: 51.5074, lng: -0.1278 }}
            onCenterChanged={(e) => {
              console.log(e.detail)
            }}
            onClick={handleMapClick}
          >
            {posts
              .filter((post) => category === 'None' || category === post.category)
              .map((post) => (
                <PostMarker setter={setFocusedPost} key={post.id} post={post} maxLikes ={highestLikes} />
              ))}
            {
              interestRegion && interestRegion.map(({perimeter, name},index) =>       
                <RegionPolygon key={index} region={perimeter} name={name} />
              )
            }
          </Map>
        </div>
      </APIProvider>
    </>
  );
};

export default PostMapView;
