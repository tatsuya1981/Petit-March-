'use client';

import React, { useEffect, useState } from 'react';
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

interface ReviewInfo {
  category: string;
  productName: string;
  price: string;
  purchaseDate: Date | null;
  brand: string;
  title: string;
  content: string;
}

interface ProductInfoProps {
  reviewInfo: ReviewInfo;
  onReviewInfoChange: (info: Partial<ReviewInfo>) => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ reviewInfo, onReviewInfoChange }) => {
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  const [brandOptions, setBrandOptions] = useState<Option[]>([]);

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

  const handleChange = (name: keyof ReviewInfo, value: string | Date | null) => {
    onReviewInfoChange({ [name]: value });
  };

  return (
    <div className={styles.productContainer}>
      <FormSelect
        label="商品カテゴリ"
        name="category"
        options={categoryOptions}
        value={reviewInfo.category}
        onChange={(e) => handleChange('category', e.target.value)}
        required
      />
      <FormInput
        label="商品名"
        name="productName"
        type="text"
        value={reviewInfo.productName}
        onChange={(e) => handleChange('productName', e.target.value)}
        required
      />
      <div className={styles.formWrapper}>
        <FormInput
          label="価格"
          name="price"
          type="number"
          value={reviewInfo.price}
          onChange={(e) => handleChange('price', e.target.value)}
        />
        <span className={styles.unit}>円</span>
      </div>
      <DatePick
        label="購入日"
        selected={reviewInfo.purchaseDate}
        onChange={(date) => handleChange('purchaseDate', date)}
      />
      <FormSelect
        label="コンビニブランド"
        name="brand"
        options={brandOptions}
        value={reviewInfo.brand}
        onChange={(e) => handleChange('brand', e.target.value)}
        required
      />
      <ReviewContent
        title={reviewInfo.title}
        setTitle={(value) => handleChange('title', value)}
        content={reviewInfo.content}
        setContent={(value) => handleChange('content', value)}
      />
    </div>
  );
};

export default ProductInfo;
