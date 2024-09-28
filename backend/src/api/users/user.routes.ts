// APIエンドポイントの定義とルーティングを記述

import express from "express";
import { getUserById } from "./user.controller";

const router = express.Router();

router.get("/:id", getUserById);

export default router;
