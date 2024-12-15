import { useState } from 'react';
import styles from './page.module.scss';
import SearchForm from '@/../../features/index/components/searchForm';
import { Review } from '@/types';
import ReviewList from '@/../../features/index/components/reviewList';

const Home = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const handleSearch = (searchData: Review[]) => {
    setReviews(searchData);
    // 検索結果が０件の場合
    if (searchData.length === 0) {
    }
  };

  return (
    <main className={styles.main}>
      <SearchForm onSearch={handleSearch} />
      <ReviewList reviews={reviews} />
    </main>
  );
};
