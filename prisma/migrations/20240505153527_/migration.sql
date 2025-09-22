-- CreateTable
CREATE TABLE "_PackSpeaker" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PackManette" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PackChair" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PackSpeaker_AB_unique" ON "_PackSpeaker"("A", "B");

-- CreateIndex
CREATE INDEX "_PackSpeaker_B_index" ON "_PackSpeaker"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PackManette_AB_unique" ON "_PackManette"("A", "B");

-- CreateIndex
CREATE INDEX "_PackManette_B_index" ON "_PackManette"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PackChair_AB_unique" ON "_PackChair"("A", "B");

-- CreateIndex
CREATE INDEX "_PackChair_B_index" ON "_PackChair"("B");

-- AddForeignKey
ALTER TABLE "_PackSpeaker" ADD CONSTRAINT "_PackSpeaker_A_fkey" FOREIGN KEY ("A") REFERENCES "AccessoryPack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackSpeaker" ADD CONSTRAINT "_PackSpeaker_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackManette" ADD CONSTRAINT "_PackManette_A_fkey" FOREIGN KEY ("A") REFERENCES "AccessoryPack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackManette" ADD CONSTRAINT "_PackManette_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackChair" ADD CONSTRAINT "_PackChair_A_fkey" FOREIGN KEY ("A") REFERENCES "AccessoryPack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackChair" ADD CONSTRAINT "_PackChair_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
