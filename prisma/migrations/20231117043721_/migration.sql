/*
  Warnings:

  - You are about to drop the column `priceOnpc` on the `ComponentOnPc` table. All the data in the column will be lost.
  - You are about to drop the `_RAMs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_Disks" DROP CONSTRAINT "_Disks_B_fkey";

-- DropForeignKey
ALTER TABLE "_RAMs" DROP CONSTRAINT "_RAMs_A_fkey";

-- DropForeignKey
ALTER TABLE "_RAMs" DROP CONSTRAINT "_RAMs_B_fkey";

-- AlterTable
ALTER TABLE "ComponentOnPc" DROP COLUMN "priceOnpc",
ADD COLUMN     "componentOnPcGroupeId" TEXT;

-- DropTable
DROP TABLE "_RAMs";

-- CreateTable
CREATE TABLE "ComponentOnPcGroupe" (
    "id" TEXT NOT NULL,

    CONSTRAINT "ComponentOnPcGroupe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Rams" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Rams_AB_unique" ON "_Rams"("A", "B");

-- CreateIndex
CREATE INDEX "_Rams_B_index" ON "_Rams"("B");

-- AddForeignKey
ALTER TABLE "ComponentOnPc" ADD CONSTRAINT "ComponentOnPc_componentOnPcGroupeId_fkey" FOREIGN KEY ("componentOnPcGroupeId") REFERENCES "ComponentOnPcGroupe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Rams" ADD CONSTRAINT "_Rams_A_fkey" FOREIGN KEY ("A") REFERENCES "CompatibiltyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Rams" ADD CONSTRAINT "_Rams_B_fkey" FOREIGN KEY ("B") REFERENCES "ComponentOnPcGroupe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Disks" ADD CONSTRAINT "_Disks_B_fkey" FOREIGN KEY ("B") REFERENCES "ComponentOnPcGroupe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
