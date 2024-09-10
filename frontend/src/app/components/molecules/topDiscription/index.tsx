import styles from './index.module.scss';
import Image from 'next/image';

const TopDescriptionList = () => {
  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <Image className={styles.logo} src="/store0.jpg" alt="レビュー一覧画面" width={400} height={220} priority />
      </div>
      <div className={styles.textContainer}>
        <p className={styles.topText}>忖度無しのレビューを一覧表示！</p>
        <p className={styles.text}>
          <span>全国のユーザーが実際に食べてみた・使用してみた商品のレビューが全てここに</span>
          <span>タグによってどのコンビニのどのジャンルの商品か見やすく表示</span>
          <span>役に立ったレビューにはいいねをしてみよう！</span>
        </p>
      </div>
    </div>
  );
};
