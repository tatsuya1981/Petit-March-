import Link from 'next/link';
import styles from './index.module.scss';
import Image from 'next/image';

const HeaderTitlesLogin = () => {
  return (
    <div className={styles.container}>
      <Link href="/" className={styles.logoContainer}>
        <Image
          src="/PetitMarche.svg"
          alt="PetitMarche Logo"
          className={styles.logo}
          width={100}
          height={100}
          style={{ width: 'auto', height: '100%' }}
          priority
        />
      </Link>
      <nav className={styles.nav}>
        <Link href="" className={styles.link}>
          新規登録
        </Link>
        <Link href="" className={styles.link}>
          ログイン
        </Link>
      </nav>
    </div>
  );
};

export default HeaderTitlesLogin;
