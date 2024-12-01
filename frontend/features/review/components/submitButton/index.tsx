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
  images: File[];
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
      const formData = new FormData();

      // 必須項目のバリデーション
      if (!userId || !productId || !brandId || !rating || !title || !productName || !content) {
        throw new Error('必須項目をすべて入力してください');
      }

      // 数値データを文字列に変換して追加
      formData.append('userId', userId.toString());
      formData.append('productId', productId.toString());
      formData.append('brandId', brandId.toString());
      formData.append('rating', rating.toString());

      // 文字列データの追加
      formData.append('title', title);
      formData.append('productName', productName);
      formData.append('content', content);

      // オプションフィールドの追加
      if (typeof price !== 'undefined' && price !== null) {
        formData.append('price', price.toString());
      }

      if (purchaseDate) {
        formData.append('purchaseDate', purchaseDate.toISOString());
      }

      // 店舗情報の処理
      if (storeLocation) {
        try {
          const storeData = {
            brandId,
            name: storeLocation.storeName || 'Unknown Store',
            latitude: storeLocation.lat,
            longitude: storeLocation.lng,
            prefecture: storeLocation.prefecture,
            city: storeLocation.city,
            streetAddress1: storeLocation.streetAddress1,
            streetAddress2: storeLocation.streetAddress2,
            zip: storeLocation.zip,
          };

          const storeResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/store/`, storeData);

          const newStoreId = storeResponse.data?.id;
          if (newStoreId) {
            formData.append('storeId', newStoreId.toString());
          }
        } catch (error) {
          console.error('Store creation failed:', error);
        }
      }

      // 画像の処理
      if (images && images.length > 0) {
        const orders = images.map((_, index) => index);
        formData.append('orders', JSON.stringify(orders));

        images.forEach((image) => {
          formData.append('image', image);
        });
      }

      // レビューデータの送信
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        alert('レビューを投稿しました！');
        window.location.href = `/reviews/${response.data.id}`;
      }
    } catch (error) {
      console.error('Review submission error:', error);
      let errorMessage = 'レビューの投稿に失敗しました';

      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        console.error('Error response data:', responseData);
        errorMessage += `: ${responseData?.message || error.message}`;
      } else if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      }

      alert(errorMessage);
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
