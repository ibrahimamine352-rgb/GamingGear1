/*
  Warnings:

  - You are about to drop the column `DiscFormatId` on the `Harddisk` table. All the data in the column will be lost.
  - You are about to drop the `HarddiskDiscFormat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Harddisk" DROP CONSTRAINT "Harddisk_DiscFormatId_fkey";

-- AlterTable
ALTER TABLE "Harddisk" DROP COLUMN "DiscFormatId";

-- DropTable
DROP TABLE "HarddiskDiscFormat";
