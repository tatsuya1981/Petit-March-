"use strict";
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
exports.validateReviewMiddleware = void 0;
const review_service_1 = __importDefault(require("./review.service"));
const review_service_2 = require("./review.service");
// バリデーションの検証
const validateReviewMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield review_service_1.default.ValidateReview(req.body);
        next();
    }
    catch (error) {
        if (error instanceof review_service_2.ReviewValidationError) {
            res.status(400).json({ errors: error.errors });
        }
        else {
            res.status(500).json({
                error: "バリデーション中にエラーが発生しました！",
                details: error instanceof Error ? error.message : "不明なエラーです",
            });
        }
    }
});
exports.validateReviewMiddleware = validateReviewMiddleware;
