// HTTPレスポンスとリクエストの処理を記述

import { Request, Response } from "express";
import prisma from "../config/database";

// 商品カテゴリー取得
export const getProductCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.productCategory.findMany({
      orderBy: {
        // 昇順に並べる
        name: "asc",
      },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "カテゴリーの取得に失敗しました" });
  }
};

// 商品カテゴリー作成
export const createProductCategories = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const category = await prisma.productCategory.create({
      data: { name },
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: "カテゴリーの作成に失敗しました" });
  }
};
