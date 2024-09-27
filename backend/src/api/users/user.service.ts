// ここで必要なビジネスロジックを追加 コントローラーとモデルの中間層
// バリデーション、データ加工など

import authService from "../auth/auth.service";
import prisma from "../config/database";
import { UserResponse } from "../auth/auth.service";

export class UserService {
  // ユーザー検索
  async getUserById(userId: number): Promise<UserResponse | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (user) {
      return authService.formatUserResponse(user);
    }
    return null;
  }
}

export default new UserService();
