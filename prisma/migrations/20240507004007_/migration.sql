-- CreateTable
CREATE TABLE "PackOrder" (
    "id" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "reduction" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "packId" TEXT NOT NULL,
    "packTitle" TEXT NOT NULL,
    "packImage" TEXT NOT NULL,

    CONSTRAINT "PackOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OrderPackClavier" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_OrderPackMouse" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_OrderPackMousePad" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_OrderPackMic" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_OrderPackHeadset" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_OrderPackCamera" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_OrderPackScreen" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_OrderPackSpeaker" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_OrderPackManette" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_OrderPackChair" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OrderPackClavier_AB_unique" ON "_OrderPackClavier"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderPackClavier_B_index" ON "_OrderPackClavier"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OrderPackMouse_AB_unique" ON "_OrderPackMouse"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderPackMouse_B_index" ON "_OrderPackMouse"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OrderPackMousePad_AB_unique" ON "_OrderPackMousePad"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderPackMousePad_B_index" ON "_OrderPackMousePad"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OrderPackMic_AB_unique" ON "_OrderPackMic"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderPackMic_B_index" ON "_OrderPackMic"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OrderPackHeadset_AB_unique" ON "_OrderPackHeadset"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderPackHeadset_B_index" ON "_OrderPackHeadset"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OrderPackCamera_AB_unique" ON "_OrderPackCamera"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderPackCamera_B_index" ON "_OrderPackCamera"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OrderPackScreen_AB_unique" ON "_OrderPackScreen"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderPackScreen_B_index" ON "_OrderPackScreen"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OrderPackSpeaker_AB_unique" ON "_OrderPackSpeaker"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderPackSpeaker_B_index" ON "_OrderPackSpeaker"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OrderPackManette_AB_unique" ON "_OrderPackManette"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderPackManette_B_index" ON "_OrderPackManette"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OrderPackChair_AB_unique" ON "_OrderPackChair"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderPackChair_B_index" ON "_OrderPackChair"("B");

-- AddForeignKey
ALTER TABLE "_OrderPackClavier" ADD CONSTRAINT "_OrderPackClavier_A_fkey" FOREIGN KEY ("A") REFERENCES "PackOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderPackClavier" ADD CONSTRAINT "_OrderPackClavier_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderPackMouse" ADD CONSTRAINT "_OrderPackMouse_A_fkey" FOREIGN KEY ("A") REFERENCES "PackOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderPackMouse" ADD CONSTRAINT "_OrderPackMouse_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderPackMousePad" ADD CONSTRAINT "_OrderPackMousePad_A_fkey" FOREIGN KEY ("A") REFERENCES "PackOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderPackMousePad" ADD CONSTRAINT "_OrderPackMousePad_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderPackMic" ADD CONSTRAINT "_OrderPackMic_A_fkey" FOREIGN KEY ("A") REFERENCES "PackOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderPackMic" ADD CONSTRAINT "_OrderPackMic_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderPackHeadset" ADD CONSTRAINT "_OrderPackHeadset_A_fkey" FOREIGN KEY ("A") REFERENCES "PackOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderPackHeadset" ADD CONSTRAINT "_OrderPackHeadset_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderPackCamera" ADD CONSTRAINT "_OrderPackCamera_A_fkey" FOREIGN KEY ("A") REFERENCES "PackOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderPackCamera" ADD CONSTRAINT "_OrderPackCamera_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderPackScreen" ADD CONSTRAINT "_OrderPackScreen_A_fkey" FOREIGN KEY ("A") REFERENCES "PackOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderPackScreen" ADD CONSTRAINT "_OrderPackScreen_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderPackSpeaker" ADD CONSTRAINT "_OrderPackSpeaker_A_fkey" FOREIGN KEY ("A") REFERENCES "PackOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderPackSpeaker" ADD CONSTRAINT "_OrderPackSpeaker_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderPackManette" ADD CONSTRAINT "_OrderPackManette_A_fkey" FOREIGN KEY ("A") REFERENCES "PackOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderPackManette" ADD CONSTRAINT "_OrderPackManette_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderPackChair" ADD CONSTRAINT "_OrderPackChair_A_fkey" FOREIGN KEY ("A") REFERENCES "PackOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderPackChair" ADD CONSTRAINT "_OrderPackChair_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
