import { useState } from 'react';

// 検索パラメータの型定義
interface SearchParams {
  productName: string;
  productId: string;
  priceRange: string;
  brandId: string;
}

// 商品カテゴリの型定義
interface Product {
  productId: number;
  name: string;
}

// コンビニブランドの型定義
interface Brand {
  brandId: number;
  name: string;
}

const searchForm = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    productName: '',
    productId: '',
    priceRange: '',
    brandId: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
};
