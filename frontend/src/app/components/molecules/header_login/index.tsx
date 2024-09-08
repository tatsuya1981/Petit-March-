import Link from 'next/link';
import styles from './index.module.scss';
import Image from 'next/image';

const HeaderTitlesLogin = () => {
  return (
    <div className={styles.container}>
      <Link href="/">
        <Image
          src="/PetitMarche.svg"
          alt="PetitMarche Logo"
          className={styles.logo}
          width={100}
          height={100}
          layout="responsive"
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
