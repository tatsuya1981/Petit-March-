'use client';

import { useState } from 'react';
import styles from './index.module.scss';
import { Star } from 'lucide-react';

export const Rating = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.textContainer}>
          <p className={styles.text}>星評価（満点は星５つ）</p>
        </div>
        <div className={styles.ratingContainer}>
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <label key={index}>
                <input
                  className={styles.starInput}
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  onClick={() => setRating(ratingValue)}
                />
                <Star
                  className={styles.starIcon}
                  size={52}
                  color={'#3C2A21'}
                  fill={ratingValue <= (hover || rating) ? '#ffc107' : 'none'}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(0)}
                  style={{ marginLeft: index === 0 ? '0' : '2rem' }}
                />
              </label>
            );
          })}
        </div>
        <p>選択した評価: {rating}</p>
      </div>
    </>
  );
};
