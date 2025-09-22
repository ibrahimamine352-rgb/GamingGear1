/*
  Warnings:

  - The `ramorderItemId` column on the `pcOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "pcOrder" DROP COLUMN "ramorderItemId",
ADD COLUMN     "ramorderItemId" TEXT[];
