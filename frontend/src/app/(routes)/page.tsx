import Image from 'next/image';
import styles from './page.module.scss';
import Button from '../components/atoms/Button/Index';
import Header from '../components/organisms/header/Index';
import HeaderTitlesLogin from '../components/molecules/header_login';
import TopImage from '../components/organisms/top_image';

export default function Home() {
  return (
    <>
      <Header />
      <TopImage />
      <main className={styles.main}>
        <div className={styles.center}>
          <Image className={styles.logo} src="/PetitMarche.svg" alt="Next.js Logo" width={200} height={200} priority />
        </div>
      </main>
    </>
  );
}
