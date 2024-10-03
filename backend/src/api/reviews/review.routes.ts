// APIエンドポイントの定義とルーティングを記述

import express from 'express';
import { create, get, remove, update } from './review.controller';

const router = express.Router();

router.post('/', create);
router.get('/:id', get);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
