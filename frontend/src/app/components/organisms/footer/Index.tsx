import Image from 'next/image';
import styles from './index.module.scss';
import FooterMenu from '../../molecules/footerMenu';

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
          <Image className={styles.logoGithub} src="/github.svg" alt="当サイトのロゴ" width={50} height={50} priority />
        </div>
        <div className={styles.menu}>
          <FooterMenu />
        </div>
      </div>
    </div>
  );
};

export default Footer;
