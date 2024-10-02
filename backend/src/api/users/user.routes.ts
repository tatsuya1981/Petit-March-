// APIエンドポイントの定義とルーティングを記述

import express from "express";
import { create, get, remove, update } from "./user.controller";

const router = express.Router();

router.get("/:id", get);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
