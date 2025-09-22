/*
  Warnings:

  - Added the required column `MarkId` to the `Screen` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Screen" ADD COLUMN     "MarkId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Mark" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Mark_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Screen" ADD CONSTRAINT "Screen_MarkId_fkey" FOREIGN KEY ("MarkId") REFERENCES "Mark"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
