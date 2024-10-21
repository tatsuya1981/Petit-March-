import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import React, { useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 35.6762,
  lng: 139.6503,
};

interface MapProps {
  onStoreSelect: (storeInfo: { lat: number; lng: number }) => void;
}

const Map = ({ onStoreSelect }: MapProps) => {
  // useJsApiLoaderフックで googleMapsAPI を非同期に読み込む
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    // フロントエンドでは NEXT_PUBLIC_ を付けて環境変数を設定
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral | null>(null);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newLocation = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setSelectedLocation(newLocation);
      onStoreSelect(newLocation);
    }
  };

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10} onClick={handleMapClick}>
      {selectedLocation && <Marker position={selectedLocation} />}
    </GoogleMap>
  ) : (
    <div>Loading...</div>
  );
};

export default React.memo(Map);
