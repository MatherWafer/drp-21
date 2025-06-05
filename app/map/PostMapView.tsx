import React, { useState, useCallback, useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import PostOverview, { PostInfo } from '../user/posts/PostOverview';
import PostMarker from './PostMarker';
import { useFiltered } from '../user/posts/FilterContext';
import { LatLng } from '../api/util/geoHelpers';
import Selector from '../layout/Selector';
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
  posts: PostInfo[]
  interestRegion: RoiData
}

const PostMapView: React.FC<PostMapViewProps> = ({
  onLocationSelect,
  initialLocation = { lat: 51.512409, lng: -0.125146 },
  apiKey,
  posts,
  interestRegion
}) => {
  const { category, filtered } = useFiltered();
  const [focusedPost, setFocusedPost] = useState<PostInfo>();
  const [genericFeed, setGenericFeed] = useState<PostInfo[]>([]);
  const [userLocation, setUserLocation] = useState<LocationCoordinates | null>(null);
  const {interestRegion:{center}} = useUser()
  useEffect(() => {

    console.log(center)
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

  useEffect(() => {
    if (filtered && genericFeed.length === 0) {
      getGenericFeed();
    }
  }, [filtered]);

  const getGenericFeed = async () => {
    fetch("/api/posts/feed", {
      method: "GET",
      headers: {
        "x-filter-roi": "false"
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch posts");
        return res.json();
      })
      .then((data) => { 
        setGenericFeed(data.posts);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
      });
  };

  const handleMapClick = useCallback((event: any) => {
    if (event.detail?.latLng) {
      const newLocation = {
        lat: event.detail.latLng.lat,
        lng: event.detail.latLng.lng,
      };
      onLocationSelect?.(newLocation);
    }
  }, [onLocationSelect]);

  const displayedPosts = filtered ? posts : genericFeed;

  return (
    <>
      <APIProvider
        apiKey={apiKey}
        onLoad={() => console.log('APIProvider loaded')}
        onError={(error) => {
          console.error('APIProvider error:', error);
        }}
      >
        <div style={{ height: '100vh', width: '100%'}}>
          <Map
            zoomControl={true}
            scrollwheel={true}
            defaultZoom={13}
            gestureHandling="greedy"
            mapId="a2bc871f26d67c06e4448720"
            style={{ width: '100%', height: '100vh' }}
            mapTypeControl={false}
            defaultCenter={center}
          >
            {displayedPosts.filter(post => category == 'None' || category == post.category).
              map(post => <PostMarker setter={setFocusedPost} key={post.id} post={post}/>)}
            <RegionPolygon region={interestRegion.perimeter}/>
          </Map>
        </div>
      </APIProvider>
    </>
  );
};



export default PostMapView;