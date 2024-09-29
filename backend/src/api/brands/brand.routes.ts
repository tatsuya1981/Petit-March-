// APIエンドポイントの定義とルーティングを記述

import express from "express";
import { createBrandCategories, getBrandCategories } from "./brand.controller";

const router = express.Router();

router.get("/", getBrandCategories);
router.post("/", createBrandCategories);

export default router;
