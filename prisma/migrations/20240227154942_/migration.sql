/*
  Warnings:

  - The `defaulthardDiskArray` column on the `pcTemplate` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `defaultramIdArray` column on the `pcTemplate` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "pcTemplate" DROP COLUMN "defaulthardDiskArray",
ADD COLUMN     "defaulthardDiskArray" TEXT[],
DROP COLUMN "defaultramIdArray",
ADD COLUMN     "defaultramIdArray" TEXT[];
