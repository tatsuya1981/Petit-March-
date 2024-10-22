import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';

interface MapProps {
  initialLocation?: { lat: number; lng: number } | null;
  onStoreSelect: (storeInfo: { lat: number; lng: number }) => void;
}

const Map: React.FC<MapProps> = ({ initialLocation, onStoreSelect }) => {
  // useJsApiLoaderフックで googleMapsAPI を非同期に読み込む
  const { isLoaded } = useJsApiLoader({
    // 同一idの場合既存のスクリプトを使用し、重複読み込みを防止
    id: 'google-map-script',
    // フロントエンドでは NEXT_PUBLIC_ を付けて環境変数を設定
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral | null>(initialLocation || null);

  useEffect(() => {
    // 既存mapデータがあればそのデータを状態へ反映＆変更があればその値へ変更
    if (initialLocation) {
      setSelectedLocation(initialLocation);
    }
  }, [initialLocation]);

  // ユーザーが地図をクリックした時実行されるイベントハンドラ
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
  // map の default 位置を設定 selectedLocation が設定されている場合はその位置を中心
  const center = selectedLocation || { lat: 35.6762, lng: 139.6503 };

  // 状態変数 isLoaded が true の場合 Map を表示
  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '400px' }}
      center={center}
      zoom={10}
      onClick={handleMapClick}
    >
      {selectedLocation && <Marker position={selectedLocation} />}
    </GoogleMap>
  ) : (
    <div>Loading...</div>
  );
};

// memo 化で Map コンポーネントに変化がある場合のみレンダリング
export default React.memo(Map);
