/*
  Warnings:

  - You are about to drop the `_CathegorilabToCathegoryCollection` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `CathegoryCollectionId` to the `Cathegorilab` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CathegorilabToCathegoryCollection" DROP CONSTRAINT "_CathegorilabToCathegoryCollection_A_fkey";

-- DropForeignKey
ALTER TABLE "_CathegorilabToCathegoryCollection" DROP CONSTRAINT "_CathegorilabToCathegoryCollection_B_fkey";

-- AlterTable
ALTER TABLE "Cathegorilab" ADD COLUMN     "CathegoryCollectionId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_CathegorilabToCathegoryCollection";

-- AddForeignKey
ALTER TABLE "Cathegorilab" ADD CONSTRAINT "Cathegorilab_CathegoryCollectionId_fkey" FOREIGN KEY ("CathegoryCollectionId") REFERENCES "CathegoryCollection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
