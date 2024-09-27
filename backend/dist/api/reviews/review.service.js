"use strict";
// ここで必要なビジネスロジックを追加 コントローラーとモデルの中間層
// バリデーション、データ加工など
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidationError = void 0;
class ReviewValidationError extends Error {
    constructor(errors) {
        super("Validation failed");
        this.errors = errors;
        this.name = "ReviewValidationError";
    }
}
exports.ReviewValidationError = ReviewValidationError;
const ValidateReviewData = (data) => {
    const errors = [];
    if (!data.userId)
        errors.push("ユーザーIDは必須です");
    if (!data.productId)
        errors.push("商品IDは必須です");
    if (!data.brandId)
        errors.push("コンビニブランドは必須です");
    if (data.rating < 1 || data.rating > 5)
        errors.push("評価は１から５の間でなくてはなりません");
    if (!data.title)
        errors.push("タイトルは必須です");
    if (!data.productName)
        errors.push("商品名は必須です");
    if (!data.content)
        errors.push("レビューは必須です");
    return errors;
};
const ValidateReview = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = ValidateReviewData(data);
    if (errors.length > 0) {
        throw new ReviewValidationError(errors);
    }
});
exports.default = { ValidateReview };
