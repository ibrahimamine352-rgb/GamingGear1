/*
  Warnings:

  - You are about to drop the column `numbers` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the `_disk2_pcOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prodNumber` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_disk2_pcOrder" DROP CONSTRAINT "_disk2_pcOrder_A_fkey";

-- DropForeignKey
ALTER TABLE "_disk2_pcOrder" DROP CONSTRAINT "_disk2_pcOrder_B_fkey";

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "numbers";

-- AlterTable
ALTER TABLE "pcOrder" ADD COLUMN     "casorderItemId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "cooorderItemId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "disorderItemId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "gpuorderItemId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "motorderItemId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "poworderItemId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "proorderItemId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ramorderItemId" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "scrorderItemId" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "_disk2_pcOrder";

-- DropTable
DROP TABLE "prodNumber";
