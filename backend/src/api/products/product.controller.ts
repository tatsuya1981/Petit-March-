// HTTPレスポンスとリクエストの処理を記述

import { Request, Response } from "express";
import prisma from "../../config/database";

// 商品カテゴリー取得
export const getProductCategories = async (req: Request, res: Response) => {
  const categories = await prisma.product.findMany({
    orderBy: {
      // 昇順に並べる
      name: "asc",
    },
  });
  res.json(categories);
};

// 商品カテゴリー作成
export const createProductCategories = async (req: Request, res: Response) => {
  const { name, productId } = req.body;
  const category = await prisma.product.create({
    data: { name, productId },
  });
  res.status(201).json(category);
};
