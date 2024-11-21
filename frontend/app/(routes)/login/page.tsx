import styles from './page.module.scss';
import { LoginTitle } from '@/../../features/login/components/title';

const Home = () => {
  return (
    <>
      <main className={styles.main}>
        <LoginTitle />
      </main>
    </>
  );
};

export default Home;
