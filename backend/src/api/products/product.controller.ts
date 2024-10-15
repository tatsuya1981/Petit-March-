// HTTPレスポンスとリクエストの処理を記述

import { NextFunction, Request, Response } from 'express';
import prisma from '../../config/database';

// 商品カテゴリー取得
export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.product.findMany({
      orderBy: {
        // 昇順に並べる
        productId: 'asc',
      },
    });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// 商品カテゴリー作成
export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, productId } = req.body;
    const category = await prisma.product.create({
      data: { name, productId },
    });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};
