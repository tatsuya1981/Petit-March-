'use client';

import { useEffect, useState } from 'react';
import styles from './index.module.scss';
import FormSelect from '@/components/elements/formSelect';
import FormInput from '@/components/elements/formInput';
import DatePick from '@/components/elements/datePicker';
import axios from 'axios';
import ReviewContent from '../reviewContent';

interface Option {
  value: string;
  label: string;
}

const ProductInfo = () => {
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  const [brandOptions, setBrandOptions] = useState<Option[]>([]);
  const [category, setCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState<Date | null>(null);
  const [brand, setBrand] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');

  useEffect(() => {
    const fetchCategoryOptions = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/products/');
        const options = response.data.map((product: { productId: number; name: string }) => ({
          value: product.productId.toString(),
          label: product.name,
        }));
        setCategoryOptions(options);
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };

    const fetchBrandOptions = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/brands/');
        const options = response.data.map((brand: { brandId: number; name: string }) => ({
          value: brand.brandId.toString(),
          label: brand.name,
        }));
        setBrandOptions(options);
      } catch (error) {
        console.error('Error fetching brands', error);
      }
    };

    fetchCategoryOptions();
    fetchBrandOptions();
  }, []);

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
      <ReviewContent
        title={reviewTitle}
        setTitle={setReviewTitle}
        content={reviewContent}
        setContent={setReviewContent}
      />
    </div>
  );
};

export default ProductInfo;
