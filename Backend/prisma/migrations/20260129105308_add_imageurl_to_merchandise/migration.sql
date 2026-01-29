-- AlterTable
ALTER TABLE "GalleryImage" ADD COLUMN     "category" TEXT,
ADD COLUMN     "year" INTEGER;

-- AlterTable
ALTER TABLE "Merchandise" ADD COLUMN     "imageUrl" TEXT;
