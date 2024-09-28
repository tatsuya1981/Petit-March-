import prisma from "../src/config/database";

const main = async () => {
  // シードデータの初期化
  await prisma.product.deleteMany();

  // シードデータを定義
  const categories = [
    "お弁当・おにぎり",
    "パン・サンド",
    "麺類",
    "惣菜",
    "ホットスナック",
    "スイーツ",
    "お菓子",
    "インスタント食品",
    "ドリンク類",
    "その他",
  ];
  // データベースへ挿入
  for (const name of categories) {
    await prisma.product.create({
      data: { name },
    });
  }
};

// シードの実行
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
