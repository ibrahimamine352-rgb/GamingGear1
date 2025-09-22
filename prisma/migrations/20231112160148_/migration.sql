/*
  Warnings:

  - You are about to drop the column `HardiskIdId` on the `Laptop` table. All the data in the column will be lost.
  - You are about to drop the `LapHardiskId` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Laptop" DROP CONSTRAINT "Laptop_HardiskIdId_fkey";

-- AlterTable
ALTER TABLE "Laptop" DROP COLUMN "HardiskIdId",
ADD COLUMN     "HardiskId" TEXT;

-- DropTable
DROP TABLE "LapHardiskId";

-- CreateTable
CREATE TABLE "LapHardisk" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "LapHardisk_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Laptop" ADD CONSTRAINT "Laptop_HardiskId_fkey" FOREIGN KEY ("HardiskId") REFERENCES "LapHardisk"("id") ON DELETE SET NULL ON UPDATE CASCADE;
