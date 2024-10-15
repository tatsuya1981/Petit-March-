import prisma from '../src/config/database';

const main = async () => {
  // シードデータの初期化
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();

  // シードデータを定義
  const categories = [
    { productId: 1, name: 'お弁当・おにぎり' },
    { productId: 2, name: 'パン・サンド' },
    { productId: 3, name: '麺類' },
    { productId: 4, name: '惣菜' },
    { productId: 5, name: 'ホットスナック' },
    { productId: 6, name: 'スイーツ' },
    { productId: 7, name: 'お菓子' },
    { productId: 8, name: 'インスタント食品' },
    { productId: 9, name: 'ドリンク類' },
    { productId: 10, name: 'その他' },
  ];

  const brands = [
    { brandId: 1, name: 'セブンイレブン' },
    { brandId: 2, name: 'ファミリーマート' },
    { brandId: 3, name: 'ローソン' },
    { brandId: 4, name: 'ミニストップ' },
    { brandId: 5, name: 'デイリーヤマザキ' },
    { brandId: 6, name: 'セイコーマート' },
    { brandId: 7, name: 'さくらみくら' },
    { brandId: 8, name: 'その他' },
  ];

  // データベースへ挿入
  for (const category of categories) {
    await prisma.product.create({
      data: { productId: category.productId, name: category.name },
    });
  }

  for (const brand of brands) {
    await prisma.brand.create({
      data: { brandId: brand.brandId, name: brand.name },
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
