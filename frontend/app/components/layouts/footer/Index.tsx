import Image from 'next/image';
import styles from './index.module.scss';
import Link from 'next/link';

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.areaWrapper}>
        <div className={styles.logoWrapper}>
          <Image
            className={styles.logo}
            src="/PetitMarche.svg"
            alt="当サイトのロゴ"
            width={200}
            height={100}
            priority
          />
          <Link href="https://github.com/tatsuya1981" className={styles.link}>
            <Image className={styles.logoGithub} src="/github.svg" alt="githubのロゴ" width={50} height={50} priority />
          </Link>
        </div>
        <div className={styles.menu}>
          <div className={styles.menuWrapper}>
            <Link href="/" className={styles.link}>
              <span className={styles.text}>お問い合わせ</span>
            </Link>
            <Link href="/" className={styles.link}>
              <span className={styles.text}>利用規約</span>
            </Link>
            <Link href="/" className={styles.link}>
              <span className={styles.text}>プライバシーポリシー</span>
            </Link>
          </div>
          <small className={styles.copyRight}>©︎Petit Marche Portfolio</small>
        </div>
      </div>
    </div>
  );
};

export default Footer;
