/*
  Warnings:

  - You are about to drop the column `category` on the `GalleryImage` table. All the data in the column will be lost.
  - You are about to drop the `Concert` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MerchandiseCategory" AS ENUM ('ROUPA', 'CD', 'VINIL', 'ALBUM', 'POSTER', 'ACESSORIO', 'OUTRO');

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "size" TEXT;

-- AlterTable
ALTER TABLE "GalleryImage" DROP COLUMN "category";

-- AlterTable
ALTER TABLE "Merchandise" ADD COLUMN     "category" "MerchandiseCategory" NOT NULL DEFAULT 'OUTRO';

-- DropTable
DROP TABLE "public"."Concert";

-- CreateTable
CREATE TABLE "MerchandiseVariant" (
    "id" SERIAL NOT NULL,
    "merchandiseId" INTEGER NOT NULL,
    "size" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MerchandiseVariant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MerchandiseVariant_merchandiseId_size_key" ON "MerchandiseVariant"("merchandiseId", "size");

-- AddForeignKey
ALTER TABLE "MerchandiseVariant" ADD CONSTRAINT "MerchandiseVariant_merchandiseId_fkey" FOREIGN KEY ("merchandiseId") REFERENCES "Merchandise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
