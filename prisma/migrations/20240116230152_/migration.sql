-- CreateTable
CREATE TABLE "_coolings" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_coolings_AB_unique" ON "_coolings"("A", "B");

-- CreateIndex
CREATE INDEX "_coolings_B_index" ON "_coolings"("B");

-- AddForeignKey
ALTER TABLE "_coolings" ADD CONSTRAINT "_coolings_A_fkey" FOREIGN KEY ("A") REFERENCES "CompatibiltyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_coolings" ADD CONSTRAINT "_coolings_B_fkey" FOREIGN KEY ("B") REFERENCES "ComponentOnPc"("id") ON DELETE CASCADE ON UPDATE CASCADE;
