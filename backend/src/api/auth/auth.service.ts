// ここで必要なビジネスロジックを追加 コントローラーとモデルの中間層
// バリデーション、データ加工など

import { User as PrismaUser } from "@prisma/client";
import prisma from "../config/database";
import { convertGeneration } from "./auth.model";
import validator from "validator";
import { formatToJapanTime } from "../../utils/dateUtils";
import { hashPassword } from "../../utils/authUtils";

// レスポンスとして受け取るためgeneration型を新たに文字列型として作り直す
export type UserResponse = Omit<
  PrismaUser,
  "passwordDigest" | "isActive" | "lastLoginAt" | "generation"
> & {
  generation: string;
  createdAt: string;
  updatedAt: string;
};

type CreateUserData = {
  name: string;
  email: string;
  passwordDigest: string;
  generation?: number;
  gender?: string;
};

// バリデーション時のエラーを作成
export class UserValidationError extends Error {
  constructor(public errors: string[]) {
    super("Validation failed");
    this.name = "UserValidationError";
  }
}

export class AuthService {
  //バリデーションの設定
  validateUserData(data: CreateUserData): string[] {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length === 0)
      errors.push("名前は必須です");
    if (data.name.trim().length > 50) errors.push("ユーザー名は５０字以内です");
    if (!data.email) {
      errors.push("メールアドレスは必須です");
    } else if (!validator.isEmail(data.email)) {
      errors.push("有効なメールアドレスを入力してください");
    }
    if (!data.passwordDigest) {
      errors.push("パスワードは必須です");
    } else if (data.passwordDigest.length < 8) {
      errors.push("パスワードは８文字以上でなくてはなりません");
    }
    if (data.generation && (data.generation < 10 || data.generation > 70))
      errors.push("不正な世代です");
    if (data.gender && !["男性", "女性", "秘密"].includes(data.gender))
      errors.push("性別が正しく登録されていません");

    return errors;
  }

  async validateUser(data: CreateUserData): Promise<void> {
    const errors = this.validateUserData(data);
    if (errors.length > 0) {
      throw new UserValidationError(errors);
    }
  }

  // ユーザーレスポンスを必要なものだけ表示するようにカスタマイズ
  formatUserResponse(user: PrismaUser): UserResponse {
    const {
      passwordDigest,
      isActive,
      lastLoginAt,
      ...userWithoutSensitiveInfo
    } = user;
    return {
      ...userWithoutSensitiveInfo,
      generation: convertGeneration(user.generation),
      createdAt: formatToJapanTime(user.createdAt),
      updatedAt: formatToJapanTime(user.updatedAt),
    } as UserResponse;
  }

  // ユーザー作成
  async createUser(input: CreateUserData): Promise<UserResponse> {
    const { name, email, generation, passwordDigest } = input;

    // 性別が空欄の場合の処理
    const gender =
      input.gender === "" || input.gender === undefined ? "秘密" : input.gender;

    // ユーザーデータのユニーク判定
    const Uniqueness = await prisma.user.findFirst({
      where: {
        OR: [{ name }, { email }],
      },
    });
    if (Uniqueness) {
      if (Uniqueness.email === email) {
        throw new Error("このメールアドレスは既に使用されています");
      } else {
        throw new Error("このユーザー名は既に使用されています");
      }
    }
    // パスワードのハッシュ化
    const hashedPassword = await hashPassword(passwordDigest);

    // ユーザーデータをデータベースへ登録
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordDigest: hashedPassword,
        generation,
        gender,
      },
    });
    return this.formatUserResponse(user);
  }
}

export default new AuthService();
