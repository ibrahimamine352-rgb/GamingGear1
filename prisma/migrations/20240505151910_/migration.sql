-- CreateTable
CREATE TABLE "_PackProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PackProduct_AB_unique" ON "_PackProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_PackProduct_B_index" ON "_PackProduct"("B");

-- AddForeignKey
ALTER TABLE "_PackProduct" ADD CONSTRAINT "_PackProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "AccessoryPack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackProduct" ADD CONSTRAINT "_PackProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
