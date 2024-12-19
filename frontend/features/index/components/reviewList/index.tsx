import { Review } from '@/types';
import styles from './index.module.scss';

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList = ({ reviews }: ReviewListProps) => {
  if (reviews.length === 0) {
    return (
      <div className={styles.noResults}>
        <p>検索結果がありません</p>
      </div>
    );
  }

  return (
    <div className={styles.reviewList}>
      {reviews.map((review) => (
        <div key={review.id} className={styles.reviewCard}>
          <div className={styles.header}>
            <h3 className={styles.title}>{review.title}</h3>
            <div className={styles.rating}>評価: {review.rating}</div>
          </div>
          <div className={styles.content}>
            <p className={styles.productInfo}>
              <p className={styles.productName}>{review.productName}</p>
              <p className={styles.productPrice}>{review.price && `商品の値段 - ¥${review.price}`}</p>
              <p className={styles.reviewText}>{review.content}</p>
            </p>
          </div>
          <div className={styles.footer}>
            <time className={styles.date}>{new Date(review.createdAt).toLocaleDateString('ja-JP')}</time>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
