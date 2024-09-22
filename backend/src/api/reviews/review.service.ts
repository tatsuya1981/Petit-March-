import prisma from "../../models/prismaClient";

interface CreateReviewData {
  userId: number;
  productId: number;
  brandId: number;
  storeId?: number;
  rating: number;
  title: string;
  productName: string;
  price?: number;
  purchaseDate?: Date;
  content: string;
}

const createReview = async (data: CreateReviewData) => {
  return await prisma.review.create({
    data: {
      ...data,
      price: data.price ? parseFloat(data.price.toFixed(2)) : null,
    },
  });
};

export default { createReview };
