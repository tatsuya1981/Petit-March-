export interface Image {
  id: number;
  reviewId: number;
  order: number;
  imageUrl: string;
  isMain: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  brandId: number;
  name: string;
}

export interface Product {
  productId: number;
  name: string;
}

export interface Review {
  id: number;
  userId: number;
  productId: number;
  brandId: number;
  storeId?: number;
  rating: number;
  title: string;
  productName: string;
  price?: number;
  purchaseDate?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  images?: Image[];
  brand?: Brand;
  product: Product;
}
