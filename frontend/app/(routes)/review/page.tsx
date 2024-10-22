'use client';

import { ReviewTitle } from '@/../features/review/components/title';
import styles from './page.module.scss';
import { Rating } from '../../../features/review/components/rating';
import ProductInfo from '../../../features/review/components/productInfo';
import { useState } from 'react';
import ImageUpload from '../../../features/review/components/imageUpload';
import Map from '@/components/elements/map';

// 画像ファイルの型定義
interface ImageFile extends File {
  id: string;
  order: number;
  isMain: boolean;
}

// 店舗情報の型定義
interface StoreLocation {
  lat: number;
  lng: number;
  address: string;
  storeName?: string;
}

const Home = () => {
  // 画像ファイルの状態管理
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
  // 店舗情報の状態管理
  const [storeLocation, setStoreLocation] = useState<StoreLocation | null>(null);
  // 画像ファイルが投稿された時のイベントハンドラー
  const handleImagesSelected = (files: ImageFile[]) => {
    setSelectedImages(files);
  };
  // 店舗が選択された時のイベントハンドラー
  const handleStoreSelect = (location: StoreLocation) => {
    setStoreLocation(location);
  };

  return (
    <>
      <main className={styles.main}>
        <ReviewTitle />
        <Rating />
        <ProductInfo />
        {/** 子コンポーネントへ onImagesSelected というpropsを通じて handleImagesSelected 関数を渡している */}
        <ImageUpload onImagesSelected={handleImagesSelected} maxImages={3} maxWidth={1200} maxHeight={1200} />
        <p className={styles.imageText}>選択された画像: {selectedImages.length}枚</p>
        <div className={styles.storeSection}>
          <h3>店舗を選択</h3>
          <p className={styles.storeSelectMessage}>地図上で購入した店舗を選択してください</p>
          <div className={styles.map}>
            {' '}
            <div className={styles.mapArea}>
              <Map onStoreSelect={handleStoreSelect} initialLocation={null} />
            </div>
            {storeLocation && (
              <div className={styles.selectedStore}>
                {' '}
                {storeLocation.storeName && (
                  <p className={styles.storeName}>選択された店舗名: {storeLocation.storeName}</p>
                )}
                <p className={styles.address}>住所: {storeLocation.address}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
