import Image from 'next/image';
import styles from './page.module.scss';
import Button from '../components/atoms/Button/Index';
import Header from '../components/organisms/header/Index';
import HeaderTitlesLogin from '../components/molecules/headerLogin';
import TopImage from '../components/organisms/topImage';
import { TopDescriptionList, TopDescriptionPost, TopDescriptionRanking } from '../components/molecules/topDiscription';
import ScrollComponent from '../components/scrollAnimation';
import BottomImage from '../components/organisms/bottomImage';
import FooterMenu from '../components/molecules/footerMenu';
import Footer from '../components/organisms/footer/Index';

export default function Home() {
  return (
    <>
      <Header />
      <TopImage />
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
            <TopDescriptionList />
          </ScrollComponent>
        </div>
        <div className={styles.postComponent}>
          <ScrollComponent>
            <TopDescriptionPost />
          </ScrollComponent>
        </div>
        <div className={styles.rankingComponent}>
          <ScrollComponent>
            <TopDescriptionRanking />
          </ScrollComponent>
        </div>
        <BottomImage />
        <Footer />
      </main>
    </>
  );
}
