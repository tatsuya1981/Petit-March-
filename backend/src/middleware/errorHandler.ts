import { Prisma } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(err);

  if (err instanceof AppError) {
    // カスタムエラーの場合
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // prisma の特定エラーコードの処理
    if (err.code === 'P2025') {
      res.status(404).json({
        status: 'error',
        message: 'Record not found',
      });
    } else {
      // その他の Prisma 関連のエラー
      res.status(404).json({
        status: 'error',
        message: 'Prisma error ${err.message}',
      });
    }
  } else {
    // 予期しないエラーの場合
    res.status(500).json({
      status: 'error',
      message: 'An error occurred on the server',
    });
  }
};
