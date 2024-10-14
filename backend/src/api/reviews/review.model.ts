// データベースの操作、記述とデータ構造の定義を記述
// データベースクエリの操作やテーブルの構造を反映したインターフェースの定義など

import { Review, Prisma, Image } from '@prisma/client';
import prisma from '../../config/database';
import { z } from 'zod';
import { AppError } from '../../middleware/errorHandler';
import { uploadToS3 } from '../../utils/s3Upload';
import { CustomMulterFile } from './review.controller';
import { deleteS3Object } from '../../utils/s3Delete';

// zodライブラリを使用してプロパティの型や制約を定義
export const reviewSchema = z.object({
  userId: z.number().int().positive(),
  productId: z.number().int().positive(),
  brandId: z.number().int().positive(),
  storeId: z.number().int().positive().optional(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1).max(255),
  productName: z.string().min(1).max(255),
  price: z.number().min(0).optional(),
  purchaseDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  content: z.string().min(1).max(2000),
  images: z
    .array(
      z.object({
        imageUrl: z.string().url(),
        order: z.number().int().min(0),
        isMain: z.boolean(),
      }),
    )
    .optional(),
});

// zodスキーマからTypeScriptの型を生成
export type ReviewInput = z.infer<typeof reviewSchema>;

// reviewとimageを組み合わせた型
export type ReviewWithImages = Review & { images?: Image[] };

// formatToJapanTime が文字列で返される為、型整合性を合わせる
export type ReviewJapanTime = Omit<Review, 'createdAt' | 'updatedAt' | 'purchaseDate'> & {
  createdAt: string;
  updatedAt: string;
  purchaseDate: string | null;
};

// imageの型ガード関数
const isReviewWithImages = (review: ReviewWithImages | AppError | undefined): review is ReviewWithImages => {
  return review !== undefined && !(review instanceof AppError) && 'images' in review;
};

// 画像処理関数
export const processImages = async (files: CustomMulterFile[]) => {
  if (files && files.length > 0) {
    const imageUrls = await Promise.all(files.map(uploadToS3));
    // indexを使用し、メイン画像を０とする
    return files.map((file, index) => ({
      imageUrl: imageUrls[index],
      order: file.order,
      isMain: index === 0,
    }));
  }
  return [];
};

export class ReviewModel {
  // レビュー検索
  findById = async (id: number): Promise<ReviewWithImages | AppError | undefined> => {
    if (isNaN(id)) {
      return new AppError('Invalid ID', 400);
    }
    const review = await prisma.review.findUnique({
      where: { id },
      include: { images: true },
    });
    if (review) {
      return review;
    }

    return undefined;
  };
  // レビューの生成
  createReview = async (reviewData: ReviewInput, files: CustomMulterFile[]): Promise<ReviewWithImages | AppError> => {
    // zodスキーマでバリデーション実施
    const parseReview = await reviewSchema.safeParse(reviewData);
    if (!parseReview.success) {
      return new AppError(parseReview.error.message, 400);
    }
    const { images, ...reviewDataWithoutImage } = parseReview.data;
    // リクエストの画像ファイルを専用関数でS3へアップロード
    const processedImages = await processImages(files);

    return await prisma.review.create({
      data: {
        ...reviewDataWithoutImage,
        price:
          reviewDataWithoutImage.price !== undefined
            ? new Prisma.Decimal(reviewDataWithoutImage.price.toString())
            : null,
        // ISO-8601形式の日時をDateオブジェクトへ変換
        purchaseDate: reviewDataWithoutImage.purchaseDate ? new Date(reviewDataWithoutImage.purchaseDate) : null,
        images: {
          create: processedImages.map((image) => ({
            imageUrl: image.imageUrl,
            order: image.order,
          })),
        },
      },
      include: { images: true },
    });
  };

  // レビュー更新
  updateReview = async (
    id: number,
    reviewData: ReviewInput,
    files: CustomMulterFile[],
  ): Promise<ReviewWithImages | AppError> => {
    if (isNaN(id)) {
      return new AppError('Invalid ID', 400);
    }
    const parseReview = await reviewSchema.safeParse(reviewData);
    if (!parseReview.success) {
      throw new AppError(parseReview.error.message, 400);
    }
    const { images, ...reviewDataWithoutImage } = parseReview.data;

    // リクエストの画像ファイルを専用関数でS3へアップロード
    const processedImages = await processImages(files);

    const review = await prisma.review.update({
      where: { id },
      data: {
        ...reviewDataWithoutImage,
        price:
          reviewDataWithoutImage.price !== undefined
            ? new Prisma.Decimal(reviewDataWithoutImage.price.toString())
            : null,
        // ISO-8601形式の日時をDateオブジェクトへ変換
        purchaseDate: reviewDataWithoutImage.purchaseDate ? new Date(reviewDataWithoutImage.purchaseDate) : null,
        images: {
          deleteMany: {},
          create: images,
        },
      },
      include: { images: true },
    });
    return review;
  };

  // レビュー削除
  deleteReview = async (id: number) => {
    if (isNaN(id)) {
      return new AppError('Invalid ID', 400);
    }
    // S3の画像データ削除の為レビュー内容を取得
    const review = await this.findById(id);
    if (!review) {
      throw new AppError('Review not found', 400);
    }

    if (isReviewWithImages(review) && review.images && review.images.length > 0) {
      // 逐次処理で１個ずつ画像削除処理を行う
      for (const image of review.images) {
        // レビューのimageからurlを取得しdeleteS3Objectへ渡す
        await deleteS3Object(image.imageUrl);
      }
    }

    return await prisma.review.delete({
      where: { id },
      include: { images: true },
    });
  };
}

export default new ReviewModel();
