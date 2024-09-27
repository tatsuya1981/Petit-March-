import bcrypt from "bcryptjs";

// 環境変数のペッパー呼び出し
const PEPPER = process.env.MY_PEPPER;

// パスワードハッシュ化＋ソルト＋ペッパー
export const hashPassword = async (password: string): Promise<string> => {
  const pepperPassword = password + PEPPER;
  return await bcrypt.hash(pepperPassword, 10);
};
