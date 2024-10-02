import { Prisma } from "@prisma/client";

// prismaのエラーかどうか判定する型ガード
export const isPrismaError = (
  error: unknown
): error is Prisma.PrismaClientKnownRequestError => {
  return error instanceof Prisma.PrismaClientKnownRequestError;
};
