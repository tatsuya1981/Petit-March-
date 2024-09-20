/*
  Warnings:

  - Added the required column `generation` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GenerationCode" AS ENUM ('EARLY_TEENS', 'LATE_TEENS', 'EARLY_TWENTIES', 'LATE_TWENTIES', 'EARLY_THIRTIES', 'LATE_THIRTIES', 'EARLY_FORTIES', 'LATE_FORTIES', 'EARLY_FIFTIES', 'LATE_FIFTIES', 'EARLY_SIXTIES', 'LATE_SIXTIES', 'ELDERLY');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "generation",
ADD COLUMN     "generation" "GenerationCode" NOT NULL;
