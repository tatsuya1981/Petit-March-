// APIエンドポイントの定義とルーティングを記述

import express from "express";
import { createUser } from "./auth.controller";
import { validateUserMiddleware } from "./auth.middleware";

const router = express.Router();

router.post("/", validateUserMiddleware, createUser);

export default router;
