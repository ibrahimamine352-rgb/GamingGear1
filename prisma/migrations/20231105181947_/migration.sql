/*
  Warnings:

  - You are about to drop the column `CathegoryCollectionId` on the `navitem` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `navitem` table. All the data in the column will be lost.
  - Added the required column `navitemId` to the `CathegoryCollection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CathegoryCollection" ADD COLUMN     "navitemId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "navitem" DROP COLUMN "CathegoryCollectionId",
DROP COLUMN "type";

-- AddForeignKey
ALTER TABLE "CathegoryCollection" ADD CONSTRAINT "CathegoryCollection_navitemId_fkey" FOREIGN KEY ("navitemId") REFERENCES "navitem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
