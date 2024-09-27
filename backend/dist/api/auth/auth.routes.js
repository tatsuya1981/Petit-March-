"use strict";
// APIエンドポイントの定義とルーティングを記述
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("./auth.middleware");
const router = express_1.default.Router();
router.post("/", auth_middleware_1.validateUserMiddleware, auth_controller_1.createUser);
exports.default = router;
