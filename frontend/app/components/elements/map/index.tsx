import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';

interface MapProps {
  initialLocation?: { lat: number; lng: number } | null;
  onStoreSelect: (storeInfo: { lat: number; lng: number; address: string; storeName?: string }) => void;
}

interface LocationInfo {
  lat: number;
  lng: number;
  address: string;
  storeName?: string;
}

const Map: React.FC<MapProps> = ({ initialLocation, onStoreSelect }) => {
  // useJsApiLoaderフックで googleMapsAPI を非同期に読み込む
  const { isLoaded } = useJsApiLoader({
    // 同一idの場合既存のスクリプトを使用し、重複読み込みを防止
    id: 'google-map-script',
    // フロントエンドでは NEXT_PUBLIC_ を付けて環境変数を設定
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places'],
    language: 'ja',
    region: 'JP',
  });

  const [selectedLocation, setSelectedLocation] = useState<LocationInfo | null>(null);

  useEffect(() => {
    // 既存mapデータがあればそのデータを状態へ反映＆変更があればその値へ変更
    if (initialLocation) {
      getAddressFromLatLng(initialLocation.lat, initialLocation.lng);
    }
  }, [initialLocation]);

  const getAddressFromLatLng = async (lat: number, lng: number) => {
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({
        location: { lat, lng },
      });
      if (response.results[0]) {
        const addressComponents = response.results[0].address_components;
        const formattedAddress = response.results[0].formatted_address;

        const placesService = new google.maps.places.PlacesService(document.createElement('div'));

        const request = {
          location: { lat, lng },
          radius: 100,
          type: 'convenience_store',
        };

        placesService.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
            const nearestStore = results[0];
            const locationInfo: LocationInfo = {
              lat,
              lng,
              address: formattedAddress,
              storeName: nearestStore.name,
            };
            setSelectedLocation(locationInfo);
            onStoreSelect(locationInfo);
          } else {
            const locationInfo: LocationInfo = {
              lat,
              lng,
              address: formattedAddress,
            };
            setSelectedLocation(locationInfo);
            onStoreSelect(locationInfo);
          }
        });
      }
    } catch (error) {
      console.error('Error getting address:', error);
    }
  };

  // ユーザーが地図をクリックした時実行されるイベントハンドラ
  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      getAddressFromLatLng(lat, lng);
    }
  };
  // map の default 位置を設定 selectedLocation が設定されている場合はその位置を中心
  const center = selectedLocation
    ? { lat: selectedLocation.lat, lng: selectedLocation.lng }
    : { lat: 35.6884, lng: 139.7555 };

  // 状態変数 isLoaded が true の場合 Map を表示
  return isLoaded ? (
    <div>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '400px' }}
        center={center}
        zoom={15}
        onClick={handleMapClick}
      >
        {selectedLocation && <Marker position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }} />}
      </GoogleMap>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

// memo 化で Map コンポーネントに変化がある場合のみレンダリング
export default React.memo(Map);
