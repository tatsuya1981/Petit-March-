'use client';

import { Review } from '@/types';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import { useParams } from 'next/navigation';

const ReviewDetail = () => {
  const params = useParams();
  const reviewId = params?.id as string;
  const [review, setReview] = useState<Review | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      // idが有効な値なのかどうか確認する
      if (!reviewId) {
        setError('無効なレビューIDです');
        setIsLoading(false);
        return;
      }

      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews/${reviewId}`;
        console.log('Requesting URL:', url);

        const response = await axios.get(url);
        // レスポンスデータの詳細をログ出力
        console.log('Full API Response:', {
          status: response.status,
          headers: response.headers,
          data: response.data,
        });

        // データの形式を確認
        if (!response.data || !response.data.title) {
          console.error('Invalid review data received:', response.data);
          setError('レビューデータの形式が不正です');
          return;
        }
        setReview(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Axios error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
          });
        } else {
          console.error('Unknown error:', error);
        }
        setError('レビューの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReview();
  }, [reviewId]);

  // 日付のフォーマットを処理する関数
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return '日付情報なし';
    }
  };

  if (isLoading) return <div>読み込み中・・・</div>;
  if (error) return <div>{error}</div>;
  if (!review) return <div>レビューが見つかりませんでした</div>;

  return (
    <main className={styles.main}>
      <div className={styles.reviewDetail}>
        <div className={styles.header}>
          <h1 className={styles.title}>{review.title || '無題'}</h1>
          <div className={styles.rating}>評価: {review.rating || '評価なし'}</div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>商品情報</h2>
          <div className={styles.productionInfo}>
            <p className={styles.productionName}>商品名: {review.productName || '商品名なし'}</p>
            {review.price !== undefined && <p className={styles.price}>価格: ¥{review.price.toLocaleString()}</p>}
          </div>
        </div>

        {review.images && review.images.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>商品画像</h2>
            <div className={styles.imageGrid}>
              {review.images.map((image) => (
                <img
                  key={image.id}
                  src={image.imageUrl}
                  alt={review.productName || '商品画像'}
                  className={styles.image}
                  onError={(e) => {
                    console.error('Image loading error:', image.imageUrl);
                    e.currentTarget.src = '/placeholder-image.jpg'; // プレースホルダー画像を設定
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>レビュー内容</h2>
          <p className={styles.content}>{review.content || 'レビュー内容なし'}</p>
        </div>

        <div className={styles.footer}>投稿日：{formatDate(review.createdAt)}</div>
      </div>
    </main>
  );
};

export default ReviewDetail;
