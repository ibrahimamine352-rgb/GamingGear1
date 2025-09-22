-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "email" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "lastName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "pcOrderId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "phoneNumber" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "pcOrderId" TEXT;

-- CreateTable
CREATE TABLE "pcOrder" (
    "id" TEXT NOT NULL,
    "price" TEXT NOT NULL DEFAULT '',
    "motorderItemId" TEXT NOT NULL,
    "proorderItemId" TEXT NOT NULL,
    "gpuorderItemId" TEXT NOT NULL,
    "ramorderItemId" TEXT NOT NULL,
    "disorderItemId" TEXT NOT NULL,
    "poworderItemId" TEXT NOT NULL,
    "casorderItemId" TEXT NOT NULL,
    "scrorderItemId" TEXT NOT NULL,
    "cooorderItemId" TEXT NOT NULL,

    CONSTRAINT "pcOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OrderTopcOrder" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_motherboard_pcOrder" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_processor_pcOrder" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_gpu_pcOrder" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ram_pcOrder" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_disk_pcOrder" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_power_pcOrder" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_case_pcOrder" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_screen_pcOrder" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_cooling_pcOrder" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OrderTopcOrder_AB_unique" ON "_OrderTopcOrder"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderTopcOrder_B_index" ON "_OrderTopcOrder"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_motherboard_pcOrder_AB_unique" ON "_motherboard_pcOrder"("A", "B");

-- CreateIndex
CREATE INDEX "_motherboard_pcOrder_B_index" ON "_motherboard_pcOrder"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_processor_pcOrder_AB_unique" ON "_processor_pcOrder"("A", "B");

-- CreateIndex
CREATE INDEX "_processor_pcOrder_B_index" ON "_processor_pcOrder"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_gpu_pcOrder_AB_unique" ON "_gpu_pcOrder"("A", "B");

-- CreateIndex
CREATE INDEX "_gpu_pcOrder_B_index" ON "_gpu_pcOrder"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ram_pcOrder_AB_unique" ON "_ram_pcOrder"("A", "B");

-- CreateIndex
CREATE INDEX "_ram_pcOrder_B_index" ON "_ram_pcOrder"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_disk_pcOrder_AB_unique" ON "_disk_pcOrder"("A", "B");

-- CreateIndex
CREATE INDEX "_disk_pcOrder_B_index" ON "_disk_pcOrder"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_power_pcOrder_AB_unique" ON "_power_pcOrder"("A", "B");

-- CreateIndex
CREATE INDEX "_power_pcOrder_B_index" ON "_power_pcOrder"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_case_pcOrder_AB_unique" ON "_case_pcOrder"("A", "B");

-- CreateIndex
CREATE INDEX "_case_pcOrder_B_index" ON "_case_pcOrder"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_screen_pcOrder_AB_unique" ON "_screen_pcOrder"("A", "B");

-- CreateIndex
CREATE INDEX "_screen_pcOrder_B_index" ON "_screen_pcOrder"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_cooling_pcOrder_AB_unique" ON "_cooling_pcOrder"("A", "B");

-- CreateIndex
CREATE INDEX "_cooling_pcOrder_B_index" ON "_cooling_pcOrder"("B");

-- AddForeignKey
ALTER TABLE "_OrderTopcOrder" ADD CONSTRAINT "_OrderTopcOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderTopcOrder" ADD CONSTRAINT "_OrderTopcOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "pcOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_motherboard_pcOrder" ADD CONSTRAINT "_motherboard_pcOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_motherboard_pcOrder" ADD CONSTRAINT "_motherboard_pcOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "pcOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_processor_pcOrder" ADD CONSTRAINT "_processor_pcOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_processor_pcOrder" ADD CONSTRAINT "_processor_pcOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "pcOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_gpu_pcOrder" ADD CONSTRAINT "_gpu_pcOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_gpu_pcOrder" ADD CONSTRAINT "_gpu_pcOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "pcOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ram_pcOrder" ADD CONSTRAINT "_ram_pcOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ram_pcOrder" ADD CONSTRAINT "_ram_pcOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "pcOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_disk_pcOrder" ADD CONSTRAINT "_disk_pcOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_disk_pcOrder" ADD CONSTRAINT "_disk_pcOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "pcOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_power_pcOrder" ADD CONSTRAINT "_power_pcOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_power_pcOrder" ADD CONSTRAINT "_power_pcOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "pcOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_case_pcOrder" ADD CONSTRAINT "_case_pcOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_case_pcOrder" ADD CONSTRAINT "_case_pcOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "pcOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_screen_pcOrder" ADD CONSTRAINT "_screen_pcOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_screen_pcOrder" ADD CONSTRAINT "_screen_pcOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "pcOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_cooling_pcOrder" ADD CONSTRAINT "_cooling_pcOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_cooling_pcOrder" ADD CONSTRAINT "_cooling_pcOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "pcOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
