import React, { useState, useCallback, useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

interface LocationPickerProps {
  onLocationSelect?: (coordinates: LocationCoordinates) => void;
  initialLocation?: LocationCoordinates;
  apiKey: string;
  height: string
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  initialLocation = { lat: 51.512409, lng: -0.125146 },
  apiKey,
  height
}) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationCoordinates>(initialLocation);



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
        }}
      >
        <div style={{ height, width: '100%'}}>
          <Map
            zoomControl={true}
            scrollwheel={true}
            defaultZoom={13}
            gestureHandling="cooperative"
            defaultCenter={initialLocation}
            mapId="a2bc871f26d67c06e4448720"
            onClick={handleMapClick}
            style={{ width: '100%', height: '100%' }}
          >
            <AdvancedMarker position={selectedLocation}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid white',
                  borderRadius: '50%',
                  backgroundColor: '#4285f4',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              />
            </AdvancedMarker>
          </Map>
        </div>
      </APIProvider>
  );
};

export default LocationPicker;