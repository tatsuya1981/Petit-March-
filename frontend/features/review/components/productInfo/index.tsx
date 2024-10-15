'use client';

import { useState } from 'react';
import styles from './index.module.scss';
import FormSelect from '@/components/elements/formSelect';
import FormInput from '@/components/elements/formInput';
import DatePick from '@/components/elements/datePicker';

const ProductInfo = () => {
  const [category, setCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState<Date | null>(null);
  const [brand, setBrand] = useState('');

  const categoryOptions = [
    { value: '1', label: 'お弁当・おにぎり' },
    { value: '2', label: 'パン・サンド' },
    { value: '3', label: '麺類' },
    { value: '4', label: '惣菜' },
    { value: '5', label: 'ホットスナック' },
    { value: '6', label: 'スイーツ' },
    { value: '7', label: 'お菓子' },
    { value: '8', label: 'インスタント食品' },
    { value: '9', label: 'ドリンク類' },
    { value: '10', label: 'その他' },
  ];

  const brandOptions = [
    { value: '1', label: 'セブンイレブン' },
    { value: '2', label: 'ファミリーマート' },
    { value: '3', label: 'ローソン' },
    { value: '4', label: 'ミニストップ' },
    { value: '5', label: 'デイリーヤマザキ' },
    { value: '6', label: 'セイコーマート' },
    { value: '7', label: 'さくらみくら' },
    { value: '8', label: 'その他' },
  ];

  return (
    <div className={styles.productContainer}>
      <FormSelect
        label="商品カテゴリ"
        name="category"
        options={categoryOptions}
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />
      <FormInput
        label="商品名"
        name="productName"
        type="text"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        required
      />
      <div className={styles.formWrapper}>
        <FormInput label="価格" name="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        <span className={styles.unit}>円</span>
      </div>
      <DatePick label="購入日" selected={purchaseDate} onChange={(date) => setPurchaseDate(date)} />
      <FormSelect
        label="コンビニブランド"
        name="brand"
        options={brandOptions}
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        required
      />
    </div>
  );
};

export default ProductInfo;
