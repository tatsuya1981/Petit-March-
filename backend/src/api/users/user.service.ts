import prisma from "../../models/prismaClient";

const convertGeneration = (generation: number | null): string => {
  if (generation === null) return "秘密";

  switch (generation) {
    case 10:
      return "１０代前半";
    case 15:
      return "１０代後半";
    case 20:
      return "２０代前半";
    case 25:
      return "２０代後半";
    case 30:
      return "３０代前半";
    case 35:
      return "３０代後半";
    case 40:
      return "４０代前半";
    case 45:
      return "４０代後半";
    case 50:
      return "５０代前半";
    case 55:
      return "５０代後半";
    case 60:
      return "６０代前半";
    case 65:
      return "６０代後半";
    case 70:
      return "７０歳以上";
    default:
      return "";
  }
};

const getUserId = async (userId: number) => {
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
};

export default { getUserId };
