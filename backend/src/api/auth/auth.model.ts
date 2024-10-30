// データベースの操作、記述とデータ構造の定義を記述
// データベースクエリの操作やテーブルの構造を反映したインターフェースの定義など

import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { hashedPassword } from './auth.middleware';

export class AuthModel {
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

    // ユーザー作成
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
        isActive: true,
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

  // 最終ログイン時間の更新
  static async updateLastLogin(userId: number) {
    return prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }

  // ユーザー検索(userId)
  static async findUserById(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        generation: true,
        gender: true,
        isActive: true,
        lastLoginAt: true,
      },
    });
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }
}
