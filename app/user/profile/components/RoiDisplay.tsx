import React, { useEffect, useRef } from 'react';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import { LatLng } from '../../../api/util/geoHelpers';
import { RoiData } from '../../../context/userContext';

interface LocationCoordinates {
  lat: number;
  lng: number;
}

const RegionPolygon: React.FC<{ region: LatLng[] }> = ({ region }) => {
  const polygonRef = useRef<google.maps.Polygon | null>(null);
  const map = useMap();

  useEffect(() => {
    if (!map || !region || region.length === 0) return;

    polygonRef.current = new window.google.maps.Polygon({
      paths: region,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.1,
      map: map
    });

    return () => {
      if (polygonRef.current) {
        polygonRef.current.setMap(null);
      }
    };
  }, [map, region]);

  return null;
};

interface PostMapViewProps {
  apiKey: string;
  interestRegion: RoiData;
}

const RoiDisplay: React.FC<PostMapViewProps> = ({ apiKey, interestRegion }) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [mapReady, setMapReady] = React.useState(false);

  // Ensure the container has explicit dimensions
  const containerStyle = {
    width: '100%',
    height: '400px', // Fixed height or use 100% if parent has defined height
    minHeight: '300px'
  };

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    setMapReady(true);
    
    // Recenter after a small delay to ensure proper rendering
    setTimeout(() => {
      if (interestRegion.center) {
        map.panTo(interestRegion.center);
      }
      // Optional: Fit the bounds of the polygon
      if (interestRegion.perimeter?.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        interestRegion.perimeter.forEach(point => bounds.extend(point));
        map.fitBounds(bounds);
      }
    }, 100);
  };

  return (

      <div style={containerStyle}>
        <APIProvider apiKey={apiKey}>
          <Map
            mapId="a2bc871f26d67c06e4448720"
            style={containerStyle}
            center={interestRegion.center}
            zoom={13}
            gestureHandling="none" // Disables zooming/panning with gestures
            disableDefaultUI // Disables all default UI controls
            keyboardShortcuts={false} // Disables keyboard navigation
            zoomControl={false}
            mapTypeControl={false}
            scaleControl={false}
            streetViewControl={false}
            fullscreenControl={false}
            rotateControl={false}
            clickableIcons={false} // Disables clickable points of interest
            draggable={false} // Disables map dragging
          >
            <RegionPolygon region={interestRegion.perimeter} />
          </Map>
        </APIProvider>
    </div>
  )
};

export default RoiDisplay;