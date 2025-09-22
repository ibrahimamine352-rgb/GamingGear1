/*
  Warnings:

  - You are about to drop the column `component` on the `CompatibiltyProfile` table. All the data in the column will be lost.
  - You are about to drop the `_CompatibiltyProfileToGpu` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CompatibiltyProfileToHarddisk` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CompatibiltyProfileToMemory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CompatibiltyProfileToMotherboard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CompatibiltyProfileToPCcase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CompatibiltyProfileToPowersupply` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CompatibiltyProfileToProcessor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CompatibiltyProfileToGpu" DROP CONSTRAINT "_CompatibiltyProfileToGpu_A_fkey";

-- DropForeignKey
ALTER TABLE "_CompatibiltyProfileToGpu" DROP CONSTRAINT "_CompatibiltyProfileToGpu_B_fkey";

-- DropForeignKey
ALTER TABLE "_CompatibiltyProfileToHarddisk" DROP CONSTRAINT "_CompatibiltyProfileToHarddisk_A_fkey";

-- DropForeignKey
ALTER TABLE "_CompatibiltyProfileToHarddisk" DROP CONSTRAINT "_CompatibiltyProfileToHarddisk_B_fkey";

-- DropForeignKey
ALTER TABLE "_CompatibiltyProfileToMemory" DROP CONSTRAINT "_CompatibiltyProfileToMemory_A_fkey";

-- DropForeignKey
ALTER TABLE "_CompatibiltyProfileToMemory" DROP CONSTRAINT "_CompatibiltyProfileToMemory_B_fkey";

-- DropForeignKey
ALTER TABLE "_CompatibiltyProfileToMotherboard" DROP CONSTRAINT "_CompatibiltyProfileToMotherboard_A_fkey";

-- DropForeignKey
ALTER TABLE "_CompatibiltyProfileToMotherboard" DROP CONSTRAINT "_CompatibiltyProfileToMotherboard_B_fkey";

-- DropForeignKey
ALTER TABLE "_CompatibiltyProfileToPCcase" DROP CONSTRAINT "_CompatibiltyProfileToPCcase_A_fkey";

-- DropForeignKey
ALTER TABLE "_CompatibiltyProfileToPCcase" DROP CONSTRAINT "_CompatibiltyProfileToPCcase_B_fkey";

-- DropForeignKey
ALTER TABLE "_CompatibiltyProfileToPowersupply" DROP CONSTRAINT "_CompatibiltyProfileToPowersupply_A_fkey";

-- DropForeignKey
ALTER TABLE "_CompatibiltyProfileToPowersupply" DROP CONSTRAINT "_CompatibiltyProfileToPowersupply_B_fkey";

-- DropForeignKey
ALTER TABLE "_CompatibiltyProfileToProcessor" DROP CONSTRAINT "_CompatibiltyProfileToProcessor_A_fkey";

-- DropForeignKey
ALTER TABLE "_CompatibiltyProfileToProcessor" DROP CONSTRAINT "_CompatibiltyProfileToProcessor_B_fkey";

-- AlterTable
ALTER TABLE "CompatibiltyProfile" DROP COLUMN "component";

-- DropTable
DROP TABLE "_CompatibiltyProfileToGpu";

-- DropTable
DROP TABLE "_CompatibiltyProfileToHarddisk";

-- DropTable
DROP TABLE "_CompatibiltyProfileToMemory";

-- DropTable
DROP TABLE "_CompatibiltyProfileToMotherboard";

-- DropTable
DROP TABLE "_CompatibiltyProfileToPCcase";

-- DropTable
DROP TABLE "_CompatibiltyProfileToPowersupply";

-- DropTable
DROP TABLE "_CompatibiltyProfileToProcessor";

-- CreateTable
CREATE TABLE "ComponentOnPc" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "priceOnpc" INTEGER NOT NULL,

    CONSTRAINT "ComponentOnPc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Motherboards" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CPUs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GPUs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_RAMs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Disks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Cases" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PowerSupplies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Motherboards_AB_unique" ON "_Motherboards"("A", "B");

-- CreateIndex
CREATE INDEX "_Motherboards_B_index" ON "_Motherboards"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CPUs_AB_unique" ON "_CPUs"("A", "B");

-- CreateIndex
CREATE INDEX "_CPUs_B_index" ON "_CPUs"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GPUs_AB_unique" ON "_GPUs"("A", "B");

-- CreateIndex
CREATE INDEX "_GPUs_B_index" ON "_GPUs"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RAMs_AB_unique" ON "_RAMs"("A", "B");

-- CreateIndex
CREATE INDEX "_RAMs_B_index" ON "_RAMs"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Disks_AB_unique" ON "_Disks"("A", "B");

-- CreateIndex
CREATE INDEX "_Disks_B_index" ON "_Disks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Cases_AB_unique" ON "_Cases"("A", "B");

-- CreateIndex
CREATE INDEX "_Cases_B_index" ON "_Cases"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PowerSupplies_AB_unique" ON "_PowerSupplies"("A", "B");

-- CreateIndex
CREATE INDEX "_PowerSupplies_B_index" ON "_PowerSupplies"("B");

-- AddForeignKey
ALTER TABLE "_Motherboards" ADD CONSTRAINT "_Motherboards_A_fkey" FOREIGN KEY ("A") REFERENCES "CompatibiltyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Motherboards" ADD CONSTRAINT "_Motherboards_B_fkey" FOREIGN KEY ("B") REFERENCES "ComponentOnPc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CPUs" ADD CONSTRAINT "_CPUs_A_fkey" FOREIGN KEY ("A") REFERENCES "CompatibiltyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CPUs" ADD CONSTRAINT "_CPUs_B_fkey" FOREIGN KEY ("B") REFERENCES "ComponentOnPc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GPUs" ADD CONSTRAINT "_GPUs_A_fkey" FOREIGN KEY ("A") REFERENCES "CompatibiltyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GPUs" ADD CONSTRAINT "_GPUs_B_fkey" FOREIGN KEY ("B") REFERENCES "ComponentOnPc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RAMs" ADD CONSTRAINT "_RAMs_A_fkey" FOREIGN KEY ("A") REFERENCES "CompatibiltyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RAMs" ADD CONSTRAINT "_RAMs_B_fkey" FOREIGN KEY ("B") REFERENCES "ComponentOnPc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Disks" ADD CONSTRAINT "_Disks_A_fkey" FOREIGN KEY ("A") REFERENCES "CompatibiltyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Disks" ADD CONSTRAINT "_Disks_B_fkey" FOREIGN KEY ("B") REFERENCES "ComponentOnPc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Cases" ADD CONSTRAINT "_Cases_A_fkey" FOREIGN KEY ("A") REFERENCES "CompatibiltyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Cases" ADD CONSTRAINT "_Cases_B_fkey" FOREIGN KEY ("B") REFERENCES "ComponentOnPc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PowerSupplies" ADD CONSTRAINT "_PowerSupplies_A_fkey" FOREIGN KEY ("A") REFERENCES "CompatibiltyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PowerSupplies" ADD CONSTRAINT "_PowerSupplies_B_fkey" FOREIGN KEY ("B") REFERENCES "ComponentOnPc"("id") ON DELETE CASCADE ON UPDATE CASCADE;
