/*
  Warnings:

  - The `motherBoardId` column on the `pcTemplate` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `processorId` column on the `pcTemplate` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `graphicCardId` column on the `pcTemplate` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `powerSupplyId` column on the `pcTemplate` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `caseId` column on the `pcTemplate` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `defaultcaseId` to the `pcTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defaultgraphicCardId` to the `pcTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defaulthardDiskArray` to the `pcTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defaultmotherBoardId` to the `pcTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defaultpowerSupplyId` to the `pcTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defaultprocessorId` to the `pcTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defaultramIdArray` to the `pcTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pcTemplate" ADD COLUMN     "defaultcaseId" TEXT NOT NULL,
ADD COLUMN     "defaultgraphicCardId" TEXT NOT NULL,
ADD COLUMN     "defaulthardDiskArray" TEXT NOT NULL,
ADD COLUMN     "defaultmotherBoardId" TEXT NOT NULL,
ADD COLUMN     "defaultpowerSupplyId" TEXT NOT NULL,
ADD COLUMN     "defaultprocessorId" TEXT NOT NULL,
ADD COLUMN     "defaultramIdArray" TEXT NOT NULL,
DROP COLUMN "motherBoardId",
ADD COLUMN     "motherBoardId" TEXT[],
DROP COLUMN "processorId",
ADD COLUMN     "processorId" TEXT[],
DROP COLUMN "graphicCardId",
ADD COLUMN     "graphicCardId" TEXT[],
DROP COLUMN "powerSupplyId",
ADD COLUMN     "powerSupplyId" TEXT[],
DROP COLUMN "caseId",
ADD COLUMN     "caseId" TEXT[];
