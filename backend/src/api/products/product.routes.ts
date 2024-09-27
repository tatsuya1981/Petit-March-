// APIエンドポイントの定義とルーティングを記述

import express from "express";
import {
  createProductCategories,
  getProductCategories,
} from "./product.controller";

const router = express.Router();

router.get("/", getProductCategories);
router.post("/", createProductCategories);

export default router;
