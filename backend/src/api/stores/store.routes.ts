// APIエンドポイントの定義とルーティングを記述
import express from "express";
import { create, get } from "./store.controller";

const router = express.Router();

router.get("/:id", get);
router.post("/", create);

export default router;
