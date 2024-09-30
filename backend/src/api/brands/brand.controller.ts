// HTTPレスポンスとリクエストの処理を記述

import { Request, Response } from "express";
import prisma from "../../config/database";

// コンビニブランドカテゴリー取得
export const get = async (req: Request, res: Response) => {
  const categories = await prisma.brand.findMany({
    orderBy: {
      // 昇順に並べる
      name: "asc",
    },
  });
  res.json(categories);
};

// コンビニブランドカテゴリー作成
export const create = async (req: Request, res: Response) => {
  const { name, brandId } = req.body;
  const category = await prisma.brand.create({
    data: { name, brandId },
  });
  res.status(201).json(category);
};
