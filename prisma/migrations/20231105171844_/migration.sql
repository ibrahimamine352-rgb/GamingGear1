/*
  Warnings:

  - Added the required column `label` to the `navitem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "navitem" ADD COLUMN     "label" TEXT NOT NULL;
