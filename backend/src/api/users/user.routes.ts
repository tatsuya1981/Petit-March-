// APIエンドポイントの定義とルーティングを記述

import express from "express";
import { create, get } from "./user.controller";
import { validate } from "./user.middleware";

const router = express.Router();

router.get("/:id", get);
router.post("/", validate, create);

export default router;
