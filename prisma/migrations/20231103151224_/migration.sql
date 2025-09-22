/*
  Warnings:

  - You are about to drop the `_CategoryToCathegoryCollection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToCathegoryCollection" DROP CONSTRAINT "_CategoryToCathegoryCollection_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToCathegoryCollection" DROP CONSTRAINT "_CategoryToCathegoryCollection_B_fkey";

-- DropTable
DROP TABLE "_CategoryToCathegoryCollection";

-- CreateTable
CREATE TABLE "Cathegorilab" (
    "id" TEXT NOT NULL,
    "index" DECIMAL(65,30) NOT NULL,
    "catId" TEXT NOT NULL,
    "Label" TEXT NOT NULL,

    CONSTRAINT "Cathegorilab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CathegorilabToCathegoryCollection" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CathegorilabToCathegoryCollection_AB_unique" ON "_CathegorilabToCathegoryCollection"("A", "B");

-- CreateIndex
CREATE INDEX "_CathegorilabToCathegoryCollection_B_index" ON "_CathegorilabToCathegoryCollection"("B");

-- AddForeignKey
ALTER TABLE "_CathegorilabToCathegoryCollection" ADD CONSTRAINT "_CathegorilabToCathegoryCollection_A_fkey" FOREIGN KEY ("A") REFERENCES "Cathegorilab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CathegorilabToCathegoryCollection" ADD CONSTRAINT "_CathegorilabToCathegoryCollection_B_fkey" FOREIGN KEY ("B") REFERENCES "CathegoryCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
