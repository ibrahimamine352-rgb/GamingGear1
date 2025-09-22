-- CreateTable
CREATE TABLE "AccessoryPack" (
    "id" TEXT NOT NULL,
    "DefaultClavier" TEXT NOT NULL DEFAULT '',
    "DefaultMouse" TEXT NOT NULL DEFAULT '',
    "DefaultMousePad" TEXT NOT NULL DEFAULT '',
    "DefaultMic" TEXT NOT NULL DEFAULT '',
    "DefaultHeadset" TEXT NOT NULL DEFAULT '',
    "DefaultCamera" TEXT NOT NULL DEFAULT '',
    "DefaultScreen" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "AccessoryPack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PackClavier" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PackMouse" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PackMousePad" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PackMic" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PackHeadset" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PackCamera" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PackScreen" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PackClavier_AB_unique" ON "_PackClavier"("A", "B");

-- CreateIndex
CREATE INDEX "_PackClavier_B_index" ON "_PackClavier"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PackMouse_AB_unique" ON "_PackMouse"("A", "B");

-- CreateIndex
CREATE INDEX "_PackMouse_B_index" ON "_PackMouse"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PackMousePad_AB_unique" ON "_PackMousePad"("A", "B");

-- CreateIndex
CREATE INDEX "_PackMousePad_B_index" ON "_PackMousePad"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PackMic_AB_unique" ON "_PackMic"("A", "B");

-- CreateIndex
CREATE INDEX "_PackMic_B_index" ON "_PackMic"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PackHeadset_AB_unique" ON "_PackHeadset"("A", "B");

-- CreateIndex
CREATE INDEX "_PackHeadset_B_index" ON "_PackHeadset"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PackCamera_AB_unique" ON "_PackCamera"("A", "B");

-- CreateIndex
CREATE INDEX "_PackCamera_B_index" ON "_PackCamera"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PackScreen_AB_unique" ON "_PackScreen"("A", "B");

-- CreateIndex
CREATE INDEX "_PackScreen_B_index" ON "_PackScreen"("B");

-- AddForeignKey
ALTER TABLE "_PackClavier" ADD CONSTRAINT "_PackClavier_A_fkey" FOREIGN KEY ("A") REFERENCES "AccessoryPack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackClavier" ADD CONSTRAINT "_PackClavier_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackMouse" ADD CONSTRAINT "_PackMouse_A_fkey" FOREIGN KEY ("A") REFERENCES "AccessoryPack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackMouse" ADD CONSTRAINT "_PackMouse_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackMousePad" ADD CONSTRAINT "_PackMousePad_A_fkey" FOREIGN KEY ("A") REFERENCES "AccessoryPack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackMousePad" ADD CONSTRAINT "_PackMousePad_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackMic" ADD CONSTRAINT "_PackMic_A_fkey" FOREIGN KEY ("A") REFERENCES "AccessoryPack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackMic" ADD CONSTRAINT "_PackMic_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackHeadset" ADD CONSTRAINT "_PackHeadset_A_fkey" FOREIGN KEY ("A") REFERENCES "AccessoryPack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackHeadset" ADD CONSTRAINT "_PackHeadset_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackCamera" ADD CONSTRAINT "_PackCamera_A_fkey" FOREIGN KEY ("A") REFERENCES "AccessoryPack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackCamera" ADD CONSTRAINT "_PackCamera_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackScreen" ADD CONSTRAINT "_PackScreen_A_fkey" FOREIGN KEY ("A") REFERENCES "AccessoryPack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackScreen" ADD CONSTRAINT "_PackScreen_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
