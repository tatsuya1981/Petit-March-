import HeaderTitlesLogin from '../../molecules/headerLogin';
import styles from './index.module.scss';

const Header = () => {
  return (
    <div className={styles.header}>
      <HeaderTitlesLogin />
    </div>
  );
};

export default Header;
