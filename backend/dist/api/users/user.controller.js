"use strict";
// HTTPレスポンスとリクエストの処理を記述
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = void 0;
const user_service_1 = __importDefault(require("./user.service"));
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.id, 10);
    try {
        const user = yield user_service_1.default.getUserById(userId);
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json({ error: "ユーザーが見つかりません" });
        }
    }
    catch (error) {
        res.status(500).json({ error: "サーバーエラーです" });
    }
});
exports.getUserById = getUserById;
exports.default = { getUserById: exports.getUserById };
