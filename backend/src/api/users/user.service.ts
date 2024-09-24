// ここで必要なビジネスロジックを追加 コントローラーとモデルの中間層
// バリデーション、データ加工など

import { User as PrismaUser } from "@prisma/client";
import bcrypt from "bcryptjs";
import prisma from "../config/database";
import { convertGeneration } from "./user.model";

// レスポンスとして受け取るためgeneration型を除外して新たに文字列型として作り直す
type User = Omit<PrismaUser, "generation"> & { generation: string };

type CreateUserData = {
  name: string;
  email: string;
  passwordDigest: string;
  generation?: number;
  gender?: string;
};

export class UserValidationError extends Error {
  constructor(public errors: string[]) {
    super("Validation failed");
    this.name = "UserValidationError";
  }
}

export class UserService {
  //バリデーションの設定
  validateUserData(data: CreateUserData): string[] {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length === 0)
      errors.push("名前は必須です");
    if (data.name.trim().length > 50) errors.push("ユーザー名は５０字以内です");
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      errors.push("有効なメールアドレスを入力してください");
    if (!data.passwordDigest) errors.push("パスワードは必須です");
    else if (data.passwordDigest.length < 8)
      errors.push("パスワードは８文字以上でなくてはなりません");
    if (data.generation && (data.generation < 10 || data.generation > 70))
      errors.push("不正な世代です");
    if (data.gender && !["男性", "女性", "秘密"].includes(data.gender))
      errors.push("不明な性別です");

    return errors;
  }

  async validateUser(data: CreateUserData): Promise<void> {
    const errors = this.validateUserData(data);
    if (errors.length > 0) {
      throw new UserValidationError(errors);
    }
  }

  // ユーザー作成
  async createUser(input: CreateUserData): Promise<User> {
    const { name, email, generation, passwordDigest } = input;
    const gender =
      input.gender === "" || input.gender === undefined ? "秘密" : input.gender;

    // メールのユニーク判定
    const uniqueEmail = await prisma.user.findUnique({
      where: { email: input.email },
    });
    if (uniqueEmail) {
      throw new Error("このメールアドレスはすでに使用されています");
    }

    // パスワードハッシュ化＋ソルト
    const hashedPassword = await bcrypt.hash(passwordDigest, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordDigest: hashedPassword,
        generation,
        gender,
      },
    });
    return {
      ...user,
      generation: convertGeneration(user.generation),
    };
  }

  // ユーザー検索
  async getUserById(userId: number): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (user) {
      return {
        ...user,
        generation: convertGeneration(user.generation),
      };
    }
    return null;
  }
}

export default new UserService();
