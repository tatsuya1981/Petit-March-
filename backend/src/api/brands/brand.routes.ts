// APIエンドポイントの定義とルーティングを記述

import express from "express";
import { create, get } from "./brand.controller";

const router = express.Router();

router.get("/", get);
router.post("/", create);

export default router;
