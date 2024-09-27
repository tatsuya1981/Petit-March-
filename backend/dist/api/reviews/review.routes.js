"use strict";
// APIエンドポイントの定義とルーティングを記述
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const review_controller_1 = require("./review.controller");
const review_middleware_1 = require("./review.middleware");
const router = express_1.default.Router();
router.post("/", review_middleware_1.validateReviewMiddleware, review_controller_1.createReview);
exports.default = router;
