// データベースの操作、記述とデータ構造の定義を記述
// データベースクエリの操作やテーブルの構造を反映したインターフェースの定義など

import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { hashedPassword } from './auth.middleware';

export class AuthModel {
  // ユーザー作成メソッド
  static async createUser(userData: {
    email: string;
    password: string;
    name: string;
    generation?: number;
    gender?: string;
  }) {
    // メールアドレスの重複チェック
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (existingUser) {
      throw new AppError('Email already exists', 400);
    }
    // パスワードのハッシュ化
    const passwordHash = await hashedPassword(userData.password);

    // ユーザー作成処理
    return prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        passwordDigest: passwordHash,
        isActive: true,
        generation: userData.generation,
        gender: userData.gender,
      },
      select: {
        id: true,
        email: true,
        name: true,
        generation: true,
        gender: true,
        createdAt: true,
      },
    });
  }

  // ユーザー検索(email)
  static async findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  // ユーザー検索(userId)
  static async findUserById(userId: number) {
    // idの数値型を検証
    if (isNaN(userId)) {
      throw new Error('Invalid ID');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        generation: true,
        gender: true,
        lastLoginAt: true,
      },
    });
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  // 最終ログイン時間の更新
  static async updateLastLogin(userId: number) {
    return prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }

  // ユーザーデータのユニーク判定
  static uniqueness = async (email: string, name?: string): Promise<boolean> => {
    const search = await prisma.user.findFirst({
      where: {
        OR: [{ name }, { email }],
      },
    });
    // searchが見つけられない（ユニーク）ならtrue、そうでなければfalseを返す
    return !search;
  };
}
