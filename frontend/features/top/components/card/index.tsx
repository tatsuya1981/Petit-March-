import styles from './index.module.scss';
import Image from 'next/image';

export const CardList = () => {
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

export const CardPost = () => {
  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <Image className={styles.logo} src="/store0.jpg" alt="投稿画面" width={400} height={220} priority />
      </div>
      <div className={styles.textContainer}>
        <p className={styles.topText}>購入したら商品を手軽にレビュー！</p>
        <p className={styles.text}>５段階の星で商品を手軽に評価</p>
        <p className={styles.text}>コンビニブランド別にレビュー可能</p>
        <p className={styles.text}>オプションで実際の購入店舗もマップから選択出来る</p>
      </div>
    </div>
  );
};

export const CardRanking = () => {
  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <Image className={styles.logo} src="/store0.jpg" alt="ランキング画面" width={400} height={220} priority />
      </div>
      <div className={styles.textContainer}>
        <p className={styles.topText}>レビューを投稿するとランキング機能が閲覧可能に！</p>
        <p className={styles.text}>カテゴリ別にいいね数が多いレビューを表示</p>
        <p className={styles.text}>どのコンビニブランドが人気か？ブランド別投稿数も表示</p>
        <p className={styles.text}>トータルいいね数が一番多いユーザーは・・・？</p>
      </div>
    </div>
  );
};
