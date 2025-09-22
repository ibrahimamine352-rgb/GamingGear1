/*
  Warnings:

  - You are about to drop the column `name` on the `FansNumber` table. All the data in the column will be lost.
  - Added the required column `number` to the `FansNumber` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FansNumber" DROP COLUMN "name",
ADD COLUMN     "number" INTEGER NOT NULL;
