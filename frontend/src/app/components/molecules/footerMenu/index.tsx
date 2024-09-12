import Link from 'next/link';
import styles from './index.module.scss';

const FooterMenu = () => {
  return (
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
  );
};

export default FooterMenu;
