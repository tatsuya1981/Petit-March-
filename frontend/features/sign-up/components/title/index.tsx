import styles from './index.module.scss';

export const SignUpTitle = () => {
  return (
    <div className={styles.titleContainer}>
      <div className={styles.title}>
        <h1>ユーザー登録</h1>
      </div>
      <div className={styles.text}>
        <p>レビューを閲覧したり投稿出来るようになります</p>
      </div>
      <div className={styles.notice}>
        <p>印は必須項目です</p>
      </div>
    </div>
  );
};
