import styles from './index.module.scss';
import Image from 'next/image';

export const TopDescriptionList = () => {
  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <Image className={styles.logo} src="/store0.jpg" alt="レビュー一覧画面" width={400} height={220} priority />
      </div>
      <div className={styles.textContainer}>
        <p className={styles.topText}>コンビニ商品のレビューを一覧表示！</p>
        <p className={styles.text}>全国のユーザーが実際に食べてみた・使用してみた商品のレビューが全てここに</p>
        <p className={styles.text}>タグによってどのコンビニのどのジャンルの商品か見やすく表示</p>
        <p className={styles.text}>役に立ったレビューにはいいねをしてみよう！</p>
      </div>
    </div>
  );
};
