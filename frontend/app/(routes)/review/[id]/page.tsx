'use client';

import { Review } from '@/types';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './page.module.scss';

const ReviewDetail = () => {
  const { id } = useParams();
  const [review, setReview] = useState<Review | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews/${id}`);
        setReview(response.data);
      } catch (error) {
        setError('レビューの取得に失敗しました');
        console.error('Error fetching review:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReview();
  }, [id]);

  if (isLoading) return <div>読み込み中・・・</div>;
  if (error) return <div>{error}</div>;
  if (!review) return <div>レビューが見つかりませんでした</div>;

  return (
    <main className={styles.main}>
      <div className={styles.reviewDetail}>
        <div className={styles.header}>
          <h1 className={styles.title}>{review.title}</h1>
          <div className={styles.rating}>評価: {review.rating}</div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>商品情報</h2>
          <div className={styles.productionInfo}>
            <p className={styles.productionName}>商品名: {review.productName}</p>
            {review.price && <p className={styles.price}>価格: {review.price.toLocaleString()}</p>}
          </div>
        </div>

        {review.images && review.images.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>商品画像</h2>
            <div className={styles.imageGrid}>
              {review.images.map((image) => (
                <img key={image.id} src={image.imageUrl} alt={review.productName} className={styles.image} />
              ))}
            </div>
          </div>
        )}

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>レビュー内容</h2>
          <p className={styles.content}>{review.content}</p>
        </div>

        <div className={styles.footer}>投稿日： {new Date(review.createdAt).toLocaleDateString('ja-JP')}</div>
      </div>
    </main>
  );
};

export default ReviewDetail;
