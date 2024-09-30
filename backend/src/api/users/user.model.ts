// データベースの操作、記述とデータ構造の定義を記述
// データベースクエリの操作やテーブルの構造を反映したインターフェースの定義など

import { User as PrismaUser } from "@prisma/client";
import prisma from "../../config/database";
import validator from "validator";
import { hashPassword } from "../../utils/authUtils";
import { formatToJapanTime } from "../../utils/dateUtils";

export const convertGeneration = (generation: number | null): string => {
  if (generation === null) return "秘密";

  switch (generation) {
    case 15:
      return "１０代前半";
    case 20:
      return "１０代後半";
    case 25:
      return "２０代前半";
    case 30:
      return "２０代後半";
    case 35:
      return "３０代前半";
    case 40:
      return "３０代後半";
    case 45:
      return "４０代前半";
    case 50:
      return "４０代後半";
    case 55:
      return "５０代前半";
    case 60:
      return "５０代後半";
    case 65:
      return "６０代前半";
    case 70:
      return "６０代後半";
    default:
      return "７０歳以上";
  }
};

export const convertGender = (gender: string | null): string => {
  switch (gender) {
    case "male":
      return "男性";
    case "female":
      return "女性";
    default:
      return "秘密";
  }
};

type CreateUserData = {
  name: string;
  email: string;
  passwordDigest: string;
  generation?: number;
  gender?: string;
};

// レスポンスのgeneration型を新たに文字列型として作り直す
export type UserResponse = Omit<
  PrismaUser,
  "passwordDigest" | "isActive" | "lastLoginAt" | "generation"
> & {
  generation: string;
  createdAt: string;
  updatedAt: string;
};

// バリデーション時のエラーを作成
export class UserValidationError extends Error {
  constructor(public errors: string[]) {
    super("Validation failed");
    this.name = "UserValidationError";
  }
}

export class UserModel {
  //バリデーションの設定
  validateData(data: CreateUserData): string[] {
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
    if (data.generation && (data.generation < 15 || data.generation > 70))
      errors.push("不正な世代です");
    if (data.gender && !["male", "female"].includes(data.gender))
      errors.push("性別が正しく登録されていません");

    return errors;
  }

  async validateUser(data: CreateUserData): Promise<void> {
    const errors = this.validateData(data);
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
      gender: convertGender(user.gender),
      generation: convertGeneration(user.generation),
      createdAt: formatToJapanTime(user.createdAt),
      updatedAt: formatToJapanTime(user.updatedAt),
    } as UserResponse;
  }

  // ユーザー作成
  async createUser(input: CreateUserData): Promise<UserResponse> {
    const { name, email, generation, passwordDigest, gender } = input;

    // ユーザーデータのユニーク判定
    const uniqueness = await prisma.user.findFirst({
      where: {
        OR: [{ name }, { email }],
      },
    });
    if (uniqueness) {
      if (uniqueness.email === email) {
        throw new Error("名前・メールアドレスはすでに使用されています");
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

  // ユーザー検索
  async getUserById(userId: number): Promise<UserResponse | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (user) {
      return this.formatUserResponse(user);
    }
    return null;
  }
}

export default new UserModel();
