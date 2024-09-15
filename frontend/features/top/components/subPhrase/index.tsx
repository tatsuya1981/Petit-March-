import React from 'react';
import styles from './index.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import Button from '../../../../app/components/elements/button/Index';
import { ScrollComponentY } from '../../../../app/components/elements/scrollAnimation';

const SubPhrase = () => {
  return (
    <div className={styles.container}>
      <Image
        className={styles.image}
        src="/storeWide.png"
        alt="コンビニ店舗のイラスト"
        width={1280}
        height={300}
        style={{ objectFit: 'cover' }}
      />

      <div className={styles.overlay}>
        <ScrollComponentY>
          <h3 className={styles.text}>参加してみませんか？</h3>
        </ScrollComponentY>
        <Link href="" className={styles.link}>
          <Button variant="topImage">新規登録でレビュー！</Button>
        </Link>
      </div>
    </div>
  );
};

export default SubPhrase;
