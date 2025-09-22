-- AlterTable
ALTER TABLE "pcOrder" ADD COLUMN     "di2orderItemId" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "_disk2_pcOrder" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_disk2_pcOrder_AB_unique" ON "_disk2_pcOrder"("A", "B");

-- CreateIndex
CREATE INDEX "_disk2_pcOrder_B_index" ON "_disk2_pcOrder"("B");

-- AddForeignKey
ALTER TABLE "_disk2_pcOrder" ADD CONSTRAINT "_disk2_pcOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_disk2_pcOrder" ADD CONSTRAINT "_disk2_pcOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "pcOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
