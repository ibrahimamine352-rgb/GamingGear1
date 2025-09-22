-- CreateTable
CREATE TABLE "_ProductToManette" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToManette_AB_unique" ON "_ProductToManette"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToManette_B_index" ON "_ProductToManette"("B");

-- AddForeignKey
ALTER TABLE "_ProductToManette" ADD CONSTRAINT "_ProductToManette_A_fkey" FOREIGN KEY ("A") REFERENCES "Manette"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToManette" ADD CONSTRAINT "_ProductToManette_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
