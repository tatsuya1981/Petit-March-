/*
  Warnings:

  - A unique constraint covering the columns `[brandId]` on the table `brands` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `brandId` to the `brands` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "brands" ADD COLUMN     "brandId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "productId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "brands_brandId_key" ON "brands"("brandId");

-- CreateIndex
CREATE UNIQUE INDEX "products_productId_key" ON "products"("productId");
