'use client';
import React, { useState } from 'react';
import LocationPicker from './LocPicker';
interface LocationCoordinates {
  lat: number;
  lng: number;
}

const Index = () => {
  const [selectedCoordinates, setSelectedCoordinates] = useState<LocationCoordinates | null>(null);
  
  // Replace with your actual Google Maps API key
  const GOOGLE_MAPS_API_KEY = "AIzaSyCGTpExS27yGMpb0fccyQltC1xQe9R6NVY";

  const handleLocationSelect = (coordinates: LocationCoordinates) => {
    setSelectedCoordinates(coordinates);
  };

  return (
    <div style={{ minHeight: '100vh'}}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '40px',
          fontSize: '2.5rem',
        }}>
          Location Picker
        </h1>

        {GOOGLE_MAPS_API_KEY === "AIzaSyCGTpExS27yGMpb0fccyQltC1xQe9R6NVY" && (
          <div style={{
            padding: '15px',
            border: '1px solid #ffeaa7',
            borderRadius: '8px',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
          </div>
        )}

        <LocationPicker
          apiKey={GOOGLE_MAPS_API_KEY}
          onLocationSelect={handleLocationSelect}
        />

        {selectedCoordinates && (
          <div style={{
            marginTop: '30px',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3>Last Selected Location:</h3>
            <pre style={{ 
              padding: '10px', 
              borderRadius: '4px',
              overflow: 'auto'
            }}>
              {JSON.stringify(selectedCoordinates, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
