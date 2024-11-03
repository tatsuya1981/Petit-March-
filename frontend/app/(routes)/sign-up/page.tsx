import styles from './page.module.scss';
import { SignUpTitle } from '../../../features/sign-up/components/title';

const Home = () => {
  return (
    <>
      <main className={styles.main}>
        <SignUpTitle />
      </main>
    </>
  );
};

export default Home;
