/*
  Warnings:

  - Added the required column `index` to the `CathegoryCollection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CathegoryCollection" ADD COLUMN     "index" DECIMAL(65,30) NOT NULL;
