import Image from 'next/image';
import styles from './page.module.scss';
import Header from '../components/layouts/header/Index';
import ScrollComponent from '../components/elements/scrollAnimation';
import Footer from '../components/layouts/footer/Index';
import * as Top from '../../features/top/components/Index';
import ScrollToTop from '../components/elements/scrollToTop';

export default function Home() {
  return (
    <>
      <Header />
      <Top.Catchphrase />
      <main className={styles.main}>
        <Image className={styles.logo} src="/PetitMarche.svg" alt="当サイトのロゴ" width={200} height={200} priority />
        <div className={styles.mainWordWrapper}>
          <h2 className={styles.mainWord}>今度発売される新商品　気にはなるけど実際どうなの？！</h2>
          <h2 className={styles.mainWord}>気になる商品あるけど、失敗したらやだなぁ・・・</h2>
          <h2 className={styles.mainWord}>今度出た弁当、めっちゃ美味いからみんなにも知らせたい！</h2>
        </div>
        <div className={styles.wordWrapper}>
          <p className={styles.word}>新商品が次々と生まれる目まぐるしいコンビニの商品</p>
          <p className={styles.word}>そんなコンビニ商品に対し情報を共有することを目的としたアプリです</p>
        </div>
        <Image className={styles.image} src="/store4.jpg" alt="店舗内のイメージ" width={350} height={285} />
        <div className={styles.wordWrapperBottom}>
          <p className={styles.word}>良かった商品、失敗しちゃった商品などなど全部ひっくるめてレビュー</p>
          <p className={styles.word}>みんなで教え合ってより良いコンビニライフを送ろう！</p>
        </div>
        <div className={styles.listComponent}>
          <ScrollComponent>
            <Top.CardList />
          </ScrollComponent>
        </div>
        <div className={styles.postComponent}>
          <ScrollComponent>
            <Top.CardPost />
          </ScrollComponent>
        </div>
        <div className={styles.rankingComponent}>
          <ScrollComponent>
            <Top.CardRanking />
          </ScrollComponent>
        </div>
        <Top.SubPhrase />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
