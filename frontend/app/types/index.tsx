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
}
