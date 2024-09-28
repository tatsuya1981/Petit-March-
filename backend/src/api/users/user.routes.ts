// APIエンドポイントの定義とルーティングを記述

import express from "express";
import { createUser, getUserById } from "./user.controller";
import { validateUserMiddleware } from "./user.middleware";

const router = express.Router();

router.get("/:id", getUserById);
router.post("/", validateUserMiddleware, createUser);

export default router;
