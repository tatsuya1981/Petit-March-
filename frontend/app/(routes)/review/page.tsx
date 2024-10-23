'use client';

import { ReviewTitle } from '@/../features/review/components/title';
import styles from './page.module.scss';
import { Rating } from '@/../features/review/components/rating';
import ProductInfo from '@/../features/review/components/productInfo';
import { useState } from 'react';
import ImageUpload from '@/../features/review/components/imageUpload';
import Map from '@/components/elements/map';
import SubmitButton from '@/../features/review/components/submitButton';

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
  prefecture: string;
  city: string;
  streetAddress1: string;
  streetAddress2?: string;
  zip: string;
  storeName?: string;
}

interface ReviewInfo {
  category: string;
  productName: string;
  price: string;
  purchaseDate: Date | null;
  brand: string;
  title: string;
  content: string;
}

const Home = () => {
  // 評価の状態管理
  const [rating, setRating] = useState<number>(0);
  // 画像ファイルの状態管理
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
  // 店舗情報の状態管理
  const [storeLocation, setStoreLocation] = useState<StoreLocation | null>(null);
  // レビュー情報の状態管理
  const [reviewInfo, setReviewInfo] = useState<ReviewInfo>({
    category: '',
    productName: '',
    price: '',
    purchaseDate: null,
    brand: '',
    title: '',
    content: '',
  });

  // 評価が変更された時のハンドラー
  const handleRatingChange = (value: number) => {
    setRating(value);
  };
  // レビュー情報が変更された時のハンドラー
  const handleReviewInfoChange = (info: Partial<ReviewInfo>) => {
    setReviewInfo((prev) => ({ ...prev, ...info }));
  };
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
        <Rating onRatingChange={handleRatingChange} />
        <ProductInfo onReviewInfoChange={handleReviewInfoChange} reviewInfo={reviewInfo} />
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
                  <p className={styles.storeName}>選択された店舗名： {storeLocation.storeName}</p>
                )}
                <p className={styles.address}>住所： {storeLocation.address}</p>
              </div>
            )}
          </div>
        </div>

        <SubmitButton
          // ユーザーidは後で認証システムから取得する様に設定する
          userId={1}
          productId={parseInt(reviewInfo.category)}
          brandId={parseInt(reviewInfo.brand)}
          rating={rating}
          title={reviewInfo.title}
          productName={reviewInfo.productName}
          price={reviewInfo.price ? parseInt(reviewInfo.price) : undefined}
          purchaseDate={reviewInfo.purchaseDate || undefined}
          content={reviewInfo.content}
          storeLocation={storeLocation || undefined}
          images={selectedImages.map((img) => ({
            order: img.order,
            imageUrl: URL.createObjectURL(img),
            isMain: img.isMain,
          }))}
        />
      </main>
    </>
  );
};

export default Home;
