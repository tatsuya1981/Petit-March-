import HeaderTitlesLogin from '../../molecules/header_login';
import styles from './index.module.scss';

const Header = () => {
  return (
    <div className={styles.header}>
      <HeaderTitlesLogin />
    </div>
  );
};

export default Header;
