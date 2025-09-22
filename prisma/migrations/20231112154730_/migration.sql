-- CreateTable
CREATE TABLE "Laptop" (
    "id" TEXT NOT NULL,
    "TouchScreen" BOOLEAN NOT NULL,
    "SystemId" TEXT,
    "ProcesseurId" TEXT,
    "ProcesseurReId" TEXT,
    "GraphiccardId" TEXT,
    "GraphiccardRefId" TEXT,
    "ScreenSizeId" TEXT,
    "ScreenTypeId" TEXT,
    "HardiskIdId" TEXT,
    "memoryId" TEXT,
    "networkId" TEXT,
    "SoundId" TEXT,
    "CameraId" TEXT,
    "RefreshRateId" TEXT,
    "manufacturerId" TEXT,

    CONSTRAINT "Laptop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LapSystem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "LapSystem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LapProcesseur" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "LapProcesseur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LapProcesseurRe" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "LapProcesseurRe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LapGraphiccard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "LapGraphiccard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LapGraphiccardRef" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "LapGraphiccardRef_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LapScreenSize" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "LapScreenSize_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LapScreenType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "LapScreenType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LapHardiskId" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "LapHardiskId_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lapmemory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Lapmemory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lapnetwork" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Lapnetwork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LapSound" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "LapSound_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LapCamera" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "LapCamera_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LapRefreshRate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "LapRefreshRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keyboard" (
    "id" TEXT NOT NULL,
    "manufacturerId" TEXT,

    CONSTRAINT "keyboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Headset" (
    "id" TEXT NOT NULL,
    "manufacturerId" TEXT,

    CONSTRAINT "Headset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mic" (
    "id" TEXT NOT NULL,
    "manufacturerId" TEXT,

    CONSTRAINT "Mic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mousepad" (
    "id" TEXT NOT NULL,
    "manufacturerId" TEXT,

    CONSTRAINT "Mousepad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductTokeyboard" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductToLaptop" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductToHeadset" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductToMic" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductToMousepad" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductTokeyboard_AB_unique" ON "_ProductTokeyboard"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductTokeyboard_B_index" ON "_ProductTokeyboard"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToLaptop_AB_unique" ON "_ProductToLaptop"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToLaptop_B_index" ON "_ProductToLaptop"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToHeadset_AB_unique" ON "_ProductToHeadset"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToHeadset_B_index" ON "_ProductToHeadset"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToMic_AB_unique" ON "_ProductToMic"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToMic_B_index" ON "_ProductToMic"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToMousepad_AB_unique" ON "_ProductToMousepad"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToMousepad_B_index" ON "_ProductToMousepad"("B");

-- AddForeignKey
ALTER TABLE "Laptop" ADD CONSTRAINT "Laptop_SystemId_fkey" FOREIGN KEY ("SystemId") REFERENCES "LapSystem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laptop" ADD CONSTRAINT "Laptop_ProcesseurId_fkey" FOREIGN KEY ("ProcesseurId") REFERENCES "LapProcesseur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laptop" ADD CONSTRAINT "Laptop_ProcesseurReId_fkey" FOREIGN KEY ("ProcesseurReId") REFERENCES "LapProcesseurRe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laptop" ADD CONSTRAINT "Laptop_GraphiccardId_fkey" FOREIGN KEY ("GraphiccardId") REFERENCES "LapGraphiccard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laptop" ADD CONSTRAINT "Laptop_GraphiccardRefId_fkey" FOREIGN KEY ("GraphiccardRefId") REFERENCES "LapGraphiccardRef"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laptop" ADD CONSTRAINT "Laptop_ScreenSizeId_fkey" FOREIGN KEY ("ScreenSizeId") REFERENCES "LapScreenSize"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laptop" ADD CONSTRAINT "Laptop_ScreenTypeId_fkey" FOREIGN KEY ("ScreenTypeId") REFERENCES "LapScreenType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laptop" ADD CONSTRAINT "Laptop_HardiskIdId_fkey" FOREIGN KEY ("HardiskIdId") REFERENCES "LapHardiskId"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laptop" ADD CONSTRAINT "Laptop_memoryId_fkey" FOREIGN KEY ("memoryId") REFERENCES "Lapmemory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laptop" ADD CONSTRAINT "Laptop_networkId_fkey" FOREIGN KEY ("networkId") REFERENCES "Lapnetwork"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laptop" ADD CONSTRAINT "Laptop_SoundId_fkey" FOREIGN KEY ("SoundId") REFERENCES "LapSound"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laptop" ADD CONSTRAINT "Laptop_CameraId_fkey" FOREIGN KEY ("CameraId") REFERENCES "LapCamera"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laptop" ADD CONSTRAINT "Laptop_RefreshRateId_fkey" FOREIGN KEY ("RefreshRateId") REFERENCES "LapRefreshRate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laptop" ADD CONSTRAINT "Laptop_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "keyboard" ADD CONSTRAINT "keyboard_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Headset" ADD CONSTRAINT "Headset_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mic" ADD CONSTRAINT "Mic_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mousepad" ADD CONSTRAINT "Mousepad_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductTokeyboard" ADD CONSTRAINT "_ProductTokeyboard_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductTokeyboard" ADD CONSTRAINT "_ProductTokeyboard_B_fkey" FOREIGN KEY ("B") REFERENCES "keyboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToLaptop" ADD CONSTRAINT "_ProductToLaptop_A_fkey" FOREIGN KEY ("A") REFERENCES "Laptop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToLaptop" ADD CONSTRAINT "_ProductToLaptop_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToHeadset" ADD CONSTRAINT "_ProductToHeadset_A_fkey" FOREIGN KEY ("A") REFERENCES "Headset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToHeadset" ADD CONSTRAINT "_ProductToHeadset_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToMic" ADD CONSTRAINT "_ProductToMic_A_fkey" FOREIGN KEY ("A") REFERENCES "Mic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToMic" ADD CONSTRAINT "_ProductToMic_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToMousepad" ADD CONSTRAINT "_ProductToMousepad_A_fkey" FOREIGN KEY ("A") REFERENCES "Mousepad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToMousepad" ADD CONSTRAINT "_ProductToMousepad_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
