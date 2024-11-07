import styles from './page.module.scss';
import { SignUpTitle } from '../../../features/sign-up/components/title';
import { SignUpForm } from '../../../features/sign-up/components/userInfo';

const Home = () => {
  return (
    <>
      <main className={styles.main}>
        <SignUpTitle />
        <SignUpForm />
      </main>
    </>
  );
};

export default Home;
