'use client';

import axios from 'axios';
import { useState } from 'react';
import styles from './index.module.scss';

interface ReviewData {
  userId: number;
  productId: number;
  brandId: number;
  storeId?: number;
  rating: number;
  title: string;
  productName: string;
  price?: number;
  purchaseDate?: Date;
  content: string;
}

interface SubmitButtonProps {
  userId: number;
  productId: number;
  brandId: number;
  storeId?: number;
  rating: number;
  title: string;
  productName: string;
  price?: number;
  purchaseDate?: Date;
  content: string;
  storeLocation?: {
    lat: number;
    lng: number;
    address: string;
    prefecture: string;
    city: string;
    streetAddress1: string;
    streetAddress2?: string;
    zip: string;
    storeName?: string;
  };
  images: {
    order: number;
    imageUrl: string;
    isMain: boolean;
  }[];
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  userId,
  productId,
  brandId,
  rating,
  title,
  productName,
  price,
  purchaseDate,
  content,
  storeLocation,
  images,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (!userId || !productId || !brandId || !rating || !title || !productName || !content) {
        alert('必須項目を入力してください');
        setIsSubmitting(false);
        return;
      }

      // 基本的な送信データの構築
      const reviewData: ReviewData = {
        userId,
        productId,
        brandId,
        rating,
        title,
        productName,
        price,
        purchaseDate,
        content,
      };

      let storeId;

      // 店舗情報がある場合は新規作成して紐付け
      if (storeLocation) {
        const storeData = {
          brandId,
          name: storeLocation.storeName || '',
          latitude: storeLocation.lat,
          longitude: storeLocation.lng,
          prefecture: storeLocation.prefecture,
          city: storeLocation.city,
          streetAddress1: storeLocation.streetAddress1,
          streetAddress2: storeLocation.streetAddress2,
          zip: storeLocation.zip,
        };

        // 店舗作成とレビュー送信を並列で行う
        const [storeResponse] = await Promise.all([axios.post('/api/store', storeData)]);
        // 店舗情報が作成成功したらstoreIdを作成
        if (storeResponse.data?.id) {
          storeId = storeResponse.data.id;
        }
      }
      // 画像データの追加
      const reviewWithImages = {
        ...reviewData,
        storeId,
        images: images.map((img) => ({
          order: img.order,
          imageUrl: img.imageUrl,
          isMain: img.isMain,
        })),
      };
      // レビューデータの送信
      const response = await axios.post('/api/reviews', reviewWithImages, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        alert('レビューを投稿しました！');
        // 作成したレビュー詳細ページへリダイレクトさせる
        const reviewId = response.data.id;
        window.location.href = `/reviews/${reviewId}`;
      }
    } catch (error: any) {
      console.error('Error submitting review', error);
      alert('レビューの投稿に失敗しました' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <button
      className={`${styles.submitButton} ${isSubmitting ? styles.loading : ''}`}
      onClick={handleSubmit}
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <span className={styles.spinner}></span>
          投稿中...
        </>
      ) : (
        'レビューを投稿する'
      )}
    </button>
  );
};

export default SubmitButton;
