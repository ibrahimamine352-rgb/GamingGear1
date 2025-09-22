-- CreateTable
CREATE TABLE "FullPackOrder" (
    "id" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "reduction" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "packId" TEXT NOT NULL,
    "packTitle" TEXT NOT NULL,
    "packImage" TEXT NOT NULL,
    "orderId" TEXT,

    CONSTRAINT "FullPackOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FullPackOrderUnity" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FullPackOrderScreen" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FullPackOrderPackOrder" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FullPackOrderUnity_AB_unique" ON "_FullPackOrderUnity"("A", "B");

-- CreateIndex
CREATE INDEX "_FullPackOrderUnity_B_index" ON "_FullPackOrderUnity"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FullPackOrderScreen_AB_unique" ON "_FullPackOrderScreen"("A", "B");

-- CreateIndex
CREATE INDEX "_FullPackOrderScreen_B_index" ON "_FullPackOrderScreen"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FullPackOrderPackOrder_AB_unique" ON "_FullPackOrderPackOrder"("A", "B");

-- CreateIndex
CREATE INDEX "_FullPackOrderPackOrder_B_index" ON "_FullPackOrderPackOrder"("B");

-- AddForeignKey
ALTER TABLE "FullPackOrder" ADD CONSTRAINT "FullPackOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FullPackOrderUnity" ADD CONSTRAINT "_FullPackOrderUnity_A_fkey" FOREIGN KEY ("A") REFERENCES "FullPackOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FullPackOrderUnity" ADD CONSTRAINT "_FullPackOrderUnity_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FullPackOrderScreen" ADD CONSTRAINT "_FullPackOrderScreen_A_fkey" FOREIGN KEY ("A") REFERENCES "FullPackOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FullPackOrderScreen" ADD CONSTRAINT "_FullPackOrderScreen_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FullPackOrderPackOrder" ADD CONSTRAINT "_FullPackOrderPackOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "FullPackOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FullPackOrderPackOrder" ADD CONSTRAINT "_FullPackOrderPackOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "PackOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
