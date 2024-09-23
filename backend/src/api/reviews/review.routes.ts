// APIエンドポイントの定義とルーティングを記述

import express from "express";
import { createReview } from "./review.controller";
import { validateReviewMiddleware } from "./review.middleware";

const router = express.Router();

router.post("/", validateReviewMiddleware, createReview);

export default router;
