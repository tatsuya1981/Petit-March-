import { LoginForm } from '@/../../features/login/components/loginForm';
import styles from './page.module.scss';
import { LoginTitle } from '@/../../features/login/components/title';

const Home = () => {
  return (
    <>
      <main className={styles.main}>
        <LoginTitle />
        <LoginForm />
      </main>
    </>
  );
};

export default Home;
