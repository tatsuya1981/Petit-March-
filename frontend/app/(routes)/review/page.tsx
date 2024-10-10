import { ReviewTitle } from '@/../features/review/components/title';
import styles from './page.module.scss';
import { Rating } from '../../../features/review/components/rating';
import FormInput from '@/components/elements/formInput';

export default function Home() {
  return (
    <>
      <main className={styles.main}>
        <ReviewTitle />
        <Rating />
        <FormInput />
      </main>
    </>
  );
}
