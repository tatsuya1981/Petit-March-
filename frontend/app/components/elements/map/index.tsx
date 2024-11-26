import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';

// コンポーネントの型定義
interface MapProps {
  initialLocation?: { lat: number; lng: number } | null;
  onStoreSelect: (storeInfo: {
    lat: number;
    lng: number;
    address: string;
    prefecture: string;
    city: string;
    streetAddress1: string;
    streetAddress2?: string;
    zip: string;
    storeName?: string;
  }) => void;
}

// マップ上で選択された店舗情報に対する型定義
interface LocationInfo {
  lat: number;
  lng: number;
  address: string;
  prefecture: string;
  city: string;
  streetAddress1: string;
  streetAddress2?: string;
  zip: string;
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
      // 既存mapデータの緯度・経度をgetAddressFromLatLngへ渡す
      getAddressFromLatLng(initialLocation.lat, initialLocation.lng);
    }
  }, [initialLocation]);

  // 住所コンポーネントから特定の種類を取得するヘルパー関数
  const getAddressComponent = (components: google.maps.GeocoderAddressComponent[], type: string): string => {
    const component = components.find((comp) => comp.types.includes(type));
    // 見つかった場合は component の long_name（住所情報）を返す
    return component ? component.long_name : '';
  };

  // 郵便番号をフォーマットするヘルパー関数
  const formatZipCode = (zip: string): string => {
    // 数字以外を消去する
    const numbers = zip.replace(/[^\d]/g, '');
    // 7桁であることを確認する
    if (numbers.length !== 7) {
      return '';
    }
    // 123-4567といった形式に変換
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  };

  // 住所を構造化するヘルパー関数
  const parseAddress = (
    addressComponents: google.maps.GeocoderAddressComponent[],
  ): {
    prefecture: string;
    city: string;
    streetAddress1: string;
    streetAddress2: string;
    zip: string;
  } => {
    // それぞれ特定タイプの住所情報に分けて取得
    const prefecture = getAddressComponent(addressComponents, 'administrative_area_level_1');
    const city =
      getAddressComponent(addressComponents, 'locality') ||
      getAddressComponent(addressComponents, 'sublocality_level_1');
    // 町名・番地
    const district = getAddressComponent(addressComponents, 'sublocality_level_2');
    const streetNumber = getAddressComponent(addressComponents, 'sublocality_level_3');
    const premise = getAddressComponent(addressComponents, 'premise');

    // 町名・番地の結合
    const streetAddress1 = [district, streetNumber, premise].filter(Boolean).join('');
    // 建物名
    const streetAddress2 = getAddressComponent(addressComponents, 'establishment');
    // 郵便番号をバックエンドの形式に合わせる
    const rawZip = getAddressComponent(addressComponents, 'postal_code');
    const zip = formatZipCode(rawZip);

    // バリデーション
    if (!zip.match(/^\d{3}-\d{4}$/)) {
      console.error('Invalid zip code format', zip);
      // デフォルトの郵便番号を設定するか、エラーハンドリングを行う
    }

    return {
      prefecture,
      city,
      streetAddress1,
      streetAddress2,
      zip,
    };
  };

  const getAddressFromLatLng = async (lat: number, lng: number) => {
    try {
      const geocoder = new google.maps.Geocoder();
      // Google Maps Geocodingサービスを利用して緯度・経度から住所を取得
      const response = await geocoder.geocode({
        location: { lat, lng },
      });
      // Geocoding APIから得られた住所が存在しているかどうか、最初の配列でチェック
      if (response.results[0]) {
        // 指定された住所を構成する各要素（郵便番号や番地など）を保持する
        const addressComponents = response.results[0].address_components;
        // 人が読みやすい形式にフォーマット
        const formattedAddress = response.results[0].formatted_address;
        // 住所情報を構造化
        const addressInfo = parseAddress(addressComponents);
        // 郵便番号のバリデーション
        if (!addressInfo.zip.match(/^\d{3}-\d{4}$/)) {
          throw new Error('Invalid zip code format received from Google Maps');
        }
        // 周辺の施設情報を取得
        const placesService = new google.maps.places.PlacesService(document.createElement('div'));
        // クリックした周辺の指定タイプの施設を検索
        const request = {
          location: { lat, lng },
          // クリックした半径１００メートル以内でポイントから最も近い施設を検索
          radius: 100,
          // 検索対象をコンビニに限定
          type: 'convenience_store',
        };

        // マップで選択後、周辺の特定施設を表示させる
        placesService.nearbySearch(request, (results, status) => {
          // 検索が正常に終了した場合、最も近い施設を示す
          if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
            const nearestStore = results[0];
            // 取得したデータからオブジェクトを生成
            const locationInfo: LocationInfo = {
              lat,
              lng,
              address: formattedAddress,
              ...addressInfo,
              storeName: nearestStore.name,
            };
            setSelectedLocation(locationInfo);
            onStoreSelect(locationInfo);
          } else {
            // 検索結果が見つからなかった場合、ロケーション情報だけ作成
            const locationInfo: LocationInfo = {
              lat,
              lng,
              address: formattedAddress,
              ...addressInfo,
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
