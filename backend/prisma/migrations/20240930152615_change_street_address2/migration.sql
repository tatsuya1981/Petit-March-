-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "content" SET DATA TYPE VARCHAR(2000);

-- AlterTable
ALTER TABLE "stores" ALTER COLUMN "streetAddress2" DROP NOT NULL;
