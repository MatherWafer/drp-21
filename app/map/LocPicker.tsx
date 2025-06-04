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
  const [locationName, setLocationName] = useState<string>('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

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

  // Perform initial geocoding for default location
  // useEffect(() => {
  //   geocodeViaHttp(initialLocation);
  // }, [initialLocation, apiKey]);

  // Debounced geocoding for selected location
  // useEffect(() => {
  //   if (debounceTimer.current) {
  //     clearTimeout(debounceTimer.current);
  //   }

  //   setIsGeocoding(true);
  //   debounceTimer.current = setTimeout(() => {
  //     geocodeViaHttp(selectedLocation);
  //   }, 300);

  //   return () => {
  //     if (debounceTimer.current) {
  //       clearTimeout(debounceTimer.current);
  //     }
  //   };
  // }, [selectedLocation, apiKey]);

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
        <div style={{ height, width: '100%', marginBottom: '20px' }}>
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