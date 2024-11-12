import styles from './page.module.scss';
import { SignUpTitle } from '../../../features/sign-up/components/title';
import { SignUpForm } from '../../../features/sign-up/components/userInfo';
import dynamic from 'next/dynamic';

const GoogleAuthButton = dynamic(() => import('@/components/elements/googleAuthButton'), { ssr: false });

const Home = () => {
  return (
    <>
      <main className={styles.main}>
        <SignUpTitle />
        <SignUpForm />
        <div className={styles.divider}>または</div>
        <GoogleAuthButton className={styles.googleButton} />
      </main>
    </>
  );
};

export default Home;
