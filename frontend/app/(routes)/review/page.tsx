'use client';

import { ReviewTitle } from '@/../features/review/components/title';
import styles from './page.module.scss';
import { Rating } from '../../../features/review/components/rating';
import ProductInfo from '../../../features/review/components/productInfo';
import { useState } from 'react';
import ImageUpload from '../../../features/review/components/imageUpload';

interface ImageFile extends File {
  id: string;
  order: number;
  isMain: boolean;
}

const Home = () => {
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);

  const handleImagesSelected = (files: ImageFile[]) => {
    setSelectedImages(files);
  };

  return (
    <>
      <main className={styles.main}>
        <ReviewTitle />
        <Rating />
        <ProductInfo />
        {/** 子コンポーネントへ onImagesSelected というpropsを通じて handleImagesSelected 関数を渡している */}
        <ImageUpload onImagesSelected={handleImagesSelected} maxImages={3} maxWidth={1200} maxHeight={1200} />
        <p>選択された画像: {selectedImages.length}枚</p>
      </main>
    </>
  );
};

export default Home;
