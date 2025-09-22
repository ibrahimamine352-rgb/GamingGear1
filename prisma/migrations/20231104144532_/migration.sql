/*
  Warnings:

  - Added the required column `PouceId` to the `Screen` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Screen" ADD COLUMN     "PouceId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Pouce" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Pouce_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Screen" ADD CONSTRAINT "Screen_PouceId_fkey" FOREIGN KEY ("PouceId") REFERENCES "Pouce"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
