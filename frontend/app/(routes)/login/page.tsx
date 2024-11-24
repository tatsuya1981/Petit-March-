import { LoginForm } from '@/../../features/login/components/loginForm';
import styles from './page.module.scss';
import { LoginTitle } from '@/../../features/login/components/title';
import GoogleAuthButton from '@/components/elements/googleAuthButton';

const Home = () => {
  return (
    <>
      <main className={styles.main}>
        <LoginTitle />
        <LoginForm />
        <div className={styles.divider}>または</div>
        <GoogleAuthButton className={styles.googleButton} />
      </main>
    </>
  );
};

export default Home;
