// HTTPレスポンスとリクエストの処理を記述

import { NextFunction, Request, Response } from 'express';
import prisma from '../../config/database';

// コンビニブランドカテゴリー取得
export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.brand.findMany({
      orderBy: {
        // 昇順に並べる
        brandId: 'asc',
      },
    });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// コンビニブランドカテゴリー作成
export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, brandId } = req.body;
    const category = await prisma.brand.create({
      data: { name, brandId },
    });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};
