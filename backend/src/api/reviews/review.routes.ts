// APIエンドポイントの定義とルーティングを記述

import express from "express";
import { create } from "./review.controller";
import { validate } from "./review.middleware";

const router = express.Router();

router.post("/", validate, create);

export default router;
