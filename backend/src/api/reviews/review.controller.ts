// HTTPレスポンスとリクエストの処理を記述

import { Request, Response, NextFunction } from 'express';
import reviewModel from './review.model';
import { AppError } from '../../middleware/errorHandler';
import multer from 'multer';
import { Review } from '@prisma/client';
import S3Service from '../../utils/s3Service';

const upload = multer({ storage: multer.memoryStorage() });

export interface SearchParams {
  productName?: string;
  productId?: number;
  priceMin?: number;
  priceMax?: number;
  brandId?: number;
}

// Express.Multer.File に order と isMain を追加してカスタム
export interface CustomMulterFile extends Express.Multer.File {
  order: number; // 画像の順序
  isMain: boolean; // メイン画像であるかどうか
}

export interface PaginationQuery extends SearchParams {
  page?: string;
  limit?: string;
}

// レビュー獲得
export const get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('Request params:', req.params);
    const reviewId = parseInt(req.params.id, 10);
    // パースしたIDログの出力
    console.log('Parsed reviewId:', reviewId);

    if (isNaN(reviewId)) {
      throw new AppError('Invalid review ID', 400);
    }

    const review = await reviewModel.findById(reviewId);
    // 取得したレビューをログに出力
    console.log('Retrieved review:', review);

    if (!review) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }

    if (review instanceof AppError) {
      next(review);
      return;
    }

    // 画像のURLを処理
    if (review.images && review.images.length > 0) {
      const processedImages = await Promise.all(
        review.images.map(async (img) => ({
          ...img,
          imageUrl: await S3Service.getSignedS3Url(img.imageUrl),
        })),
      );
      review.images = processedImages;
    }

    console.log('Sending response:', review);
    res.json(review);
  } catch (error) {
    console.error('Error in get review:', error);
    next(new AppError(error instanceof Error ? error.message : 'Unknown error', 400));
  }
};

// レビュー作成 (Expressのミドルウェアチェーン使用)
export const create = [
  // upload メソッドによってフォームフィールドの名前と最大数を指定
  upload.array('image', 3),
  async (req: Request, res: Response, next: NextFunction): Promise<Review | void> => {
    try {
      //Multer によってアップロードされた image ファイルのデータを変数filesへ格納
      let files = req.files as CustomMulterFile[];
      const reviewData = {
        userId: parseInt(req.body.userId),
        productId: parseInt(req.body.productId),
        brandId: parseInt(req.body.brandId),
        rating: parseInt(req.body.rating),
        title: req.body.title,
        productName: req.body.productName,
        price: req.body.price ? parseFloat(req.body.price) : undefined,
        purchaseDate: req.body.purchaseDate,
        content: req.body.content,
        storeId: req.body.storeId ? parseInt(req.body.storeId) : undefined,
      };
      // デバッグ用
      console.log('Received review data:', reviewData);
      console.log(
        'Received files:',
        files?.map((f) => ({ name: f.originalname, size: f.size })),
      );
      // 画像が存在している場合req.body.ordersの文字列をパースして配列にする
      if (files && files.length > 0) {
        const orders = JSON.parse(req.body.orders || '[]');
        if (!Array.isArray(orders) || orders.length !== files.length) {
          return next(new AppError('Invalid order information for images', 400));
        }
        // ファイルに order と isMain の情報追加
        files = files.map((file, index) => ({
          ...file,
          order: orders[index],
          isMain: index === 0,
        }));
      }
      const newReview = await reviewModel.createReview(reviewData, files);
      res.status(201).json(newReview);
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage =
          error.message === 'validation Error'
            ? 'Invalid review data. Please check all required fields.'
            : error.message;
        next(new AppError(errorMessage, 400));
      } else {
        next(new AppError('An unexpected error occurred', 500));
      }
    }
  },
];

// レビュー更新 (Expressのミドルウェアチェーン使用)
export const update = [
  // upload メソッドによってフォームフィールドの名前と最大数を指定
  upload.array('images', 3),
  async (req: Request, res: Response, next: NextFunction): Promise<Review | void> => {
    //Multer によってアップロードされたファイル情報を取得
    let files = req.files as CustomMulterFile[];
    const reviewId = parseInt(req.params.id, 10);
    const reviewData = req.body;

    // Multer.file型にフロントエンドからの情報を追加する処理
    files = files.map((file, index) => {
      file.order = parseInt(req.body.orders[index], 10);
      file.isMain = index === 0;
      return file;
    });
    try {
      const updateReview = await reviewModel.updateReview(reviewId, reviewData, files);
      res.json(updateReview);
    } catch (error) {
      if (error instanceof Error) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  },
];

// レビュー削除
export const remove = async (req: Request, res: Response, next: NextFunction) => {
  const reviewId = parseInt(req.params.id, 10);
  try {
    await reviewModel.deleteReview(reviewId);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      next(new AppError(error.message, 400));
    } else {
      next(error);
    }
  }
};

// レビュー検索用
export const search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query as PaginationQuery;

    // ページネーションパラメータの処理
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');

    // クエリパラメータから検索条件のデータを抽出してオブジェクトを作成
    const searchParams: SearchParams = {
      productName: req.query.productName as string,
      productId: req.query.productId ? parseInt(req.query.productId as string) : undefined,
      priceMin: req.query.priceMin ? parseInt(req.query.priceMin as string) : undefined,
      priceMax: req.query.priceMax ? parseInt(req.query.priceMax as string) : undefined,
      brandId: req.query.brandId ? parseInt(req.query.brandId as string) : undefined,
    };
    // モデルへオブジェクトを渡してレビューを検索
    const searchResult = await reviewModel.searchReviews(searchParams, page, limit);
    // JSON形式に変換してレスポンスとしてフロントエンドへ渡す
    res.json({
      reviews: searchResult.reviews,
      pagination: {
        currentPage: page,
        limit,
        totalPages: searchResult.pagination.totalPages,
        totalItems: searchResult.pagination.totalItems,
      },
    });
  } catch (error) {
    // JavaScriptの組み込みErrorかチェック
    if (error instanceof Error) {
      next(new AppError(error.message, 400));
    } else {
      next(new AppError('Unexpected error occurred', 500));
    }
  }
};
