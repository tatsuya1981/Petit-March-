import { ReviewTitle } from '@/../features/review/components/title';
import styles from './page.module.scss';
import { Rating } from '../../../features/review/components/rating';
import ProductInfo from '../../../features/review/components/productInfo';

export default function Home() {
  return (
    <>
      <main className={styles.main}>
        <ReviewTitle />
        <Rating />
        <ProductInfo />
      </main>
    </>
  );
}
