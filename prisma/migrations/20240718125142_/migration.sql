/*
  Warnings:

  - You are about to drop the `FullPackOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FullPackOrder" DROP CONSTRAINT "FullPackOrder_orderId_fkey";

-- DropForeignKey
ALTER TABLE "_FullPackOrderPackOrder" DROP CONSTRAINT "_FullPackOrderPackOrder_A_fkey";

-- DropForeignKey
ALTER TABLE "_FullPackOrderScreen" DROP CONSTRAINT "_FullPackOrderScreen_A_fkey";

-- DropForeignKey
ALTER TABLE "_FullPackOrderUnity" DROP CONSTRAINT "_FullPackOrderUnity_A_fkey";

-- DropTable
DROP TABLE "FullPackOrder";

-- CreateTable
CREATE TABLE "FullPack" (
    "id" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "reduction" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "packId" TEXT NOT NULL,
    "packTitle" TEXT NOT NULL,
    "packImage" TEXT NOT NULL,
    "discountOnPack" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "DefaultPack" TEXT NOT NULL DEFAULT '',
    "DefaultUnity" TEXT NOT NULL DEFAULT '',
    "DefaultScreen" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "FullPack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FullPackProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FullPackProduct_AB_unique" ON "_FullPackProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_FullPackProduct_B_index" ON "_FullPackProduct"("B");

-- AddForeignKey
ALTER TABLE "_FullPackOrderUnity" ADD CONSTRAINT "_FullPackOrderUnity_A_fkey" FOREIGN KEY ("A") REFERENCES "FullPack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FullPackOrderScreen" ADD CONSTRAINT "_FullPackOrderScreen_A_fkey" FOREIGN KEY ("A") REFERENCES "FullPack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FullPackOrderPackOrder" ADD CONSTRAINT "_FullPackOrderPackOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "FullPack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FullPackProduct" ADD CONSTRAINT "_FullPackProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "FullPack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FullPackProduct" ADD CONSTRAINT "_FullPackProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
