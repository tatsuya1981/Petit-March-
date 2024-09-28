// ここで必要なビジネスロジックを追加 コントローラーとモデルの中間層
// バリデーション、データ加工など

// バリデーション作成
import { Review } from "./review.model";
export class ReviewValidationError extends Error {
  constructor(public errors: string[]) {
    super("Validation failed");
    this.name = "ReviewValidationError";
  }
}

const ValidateReviewData = (data: Review): string[] => {
  const errors: string[] = [];

  if (!data.userId) errors.push("ユーザーIDは必須です");
  if (!data.productId) errors.push("商品IDは必須です");
  if (!data.brandId) errors.push("コンビニブランドは必須です");
  if (data.rating < 1 || data.rating > 5)
    errors.push("評価は１から５の間でなくてはなりません");
  if (!data.title) errors.push("タイトルは必須です");
  if (!data.productName) errors.push("商品名は必須です");
  if (!data.content) errors.push("レビューは必須です");

  return errors;
};

const ValidateReview = async (data: Review) => {
  const errors = ValidateReviewData(data);
  if (errors.length > 0) {
    throw new ReviewValidationError(errors);
  }
};

export default { ValidateReview };
