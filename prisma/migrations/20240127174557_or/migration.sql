/*
  Warnings:

  - You are about to drop the column `casorderItemId` on the `pcOrder` table. All the data in the column will be lost.
  - You are about to drop the column `cooorderItemId` on the `pcOrder` table. All the data in the column will be lost.
  - You are about to drop the column `di2orderItemId` on the `pcOrder` table. All the data in the column will be lost.
  - You are about to drop the column `disorderItemId` on the `pcOrder` table. All the data in the column will be lost.
  - You are about to drop the column `gpuorderItemId` on the `pcOrder` table. All the data in the column will be lost.
  - You are about to drop the column `motorderItemId` on the `pcOrder` table. All the data in the column will be lost.
  - You are about to drop the column `poworderItemId` on the `pcOrder` table. All the data in the column will be lost.
  - You are about to drop the column `proorderItemId` on the `pcOrder` table. All the data in the column will be lost.
  - You are about to drop the column `ramorderItemId` on the `pcOrder` table. All the data in the column will be lost.
  - You are about to drop the column `scrorderItemId` on the `pcOrder` table. All the data in the column will be lost.
  - Made the column `pcOrderId` on table `OrderItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "orderId" SET DEFAULT '',
ALTER COLUMN "pcOrderId" SET NOT NULL,
ALTER COLUMN "pcOrderId" SET DEFAULT '';

-- AlterTable
ALTER TABLE "pcOrder" DROP COLUMN "casorderItemId",
DROP COLUMN "cooorderItemId",
DROP COLUMN "di2orderItemId",
DROP COLUMN "disorderItemId",
DROP COLUMN "gpuorderItemId",
DROP COLUMN "motorderItemId",
DROP COLUMN "poworderItemId",
DROP COLUMN "proorderItemId",
DROP COLUMN "ramorderItemId",
DROP COLUMN "scrorderItemId";
