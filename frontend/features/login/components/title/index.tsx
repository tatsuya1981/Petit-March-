import styles from './index.module.scss';

export const LoginTitle = () => {
  return (
    <div className={styles.titleContainer}>
      <div className={styles.title}>
        <h1>ログイン</h1>
      </div>
      <div className={styles.notice}>
        <p>印は必須項目です</p>
      </div>
    </div>
  );
};
