/*
  Warnings:

  - Added the required column `rgb` to the `Headset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wireless` to the `Headset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rgb` to the `Mic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wireless` to the `Mic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rgb` to the `Mousepad` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Headset" ADD COLUMN     "headsetInterfaceAvecOrdinateurId" TEXT,
ADD COLUMN     "headsetModelId" TEXT,
ADD COLUMN     "headsetSonSurroundId" TEXT,
ADD COLUMN     "rgb" BOOLEAN NOT NULL,
ADD COLUMN     "wireless" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Mic" ADD COLUMN     "micInterfaceAvecOrdinateurId" TEXT,
ADD COLUMN     "micModelId" TEXT,
ADD COLUMN     "micSonSurroundId" TEXT,
ADD COLUMN     "rgb" BOOLEAN NOT NULL,
ADD COLUMN     "wireless" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Mousepad" ADD COLUMN     "mousepadModelId" TEXT,
ADD COLUMN     "mousepadSizeId" TEXT,
ADD COLUMN     "rgb" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "HeadsetModel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "HeadsetModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeadsetInterfaceAvecOrdinateur" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "HeadsetInterfaceAvecOrdinateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeadsetSonSurround" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "HeadsetSonSurround_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MicModel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MicModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MicInterfaceAvecOrdinateur" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MicInterfaceAvecOrdinateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MicSonSurround" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MicSonSurround_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MousepadModel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MousepadModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MousepadSize" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MousepadSize_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Headset" ADD CONSTRAINT "Headset_headsetModelId_fkey" FOREIGN KEY ("headsetModelId") REFERENCES "HeadsetModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Headset" ADD CONSTRAINT "Headset_headsetSonSurroundId_fkey" FOREIGN KEY ("headsetSonSurroundId") REFERENCES "HeadsetSonSurround"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Headset" ADD CONSTRAINT "Headset_headsetInterfaceAvecOrdinateurId_fkey" FOREIGN KEY ("headsetInterfaceAvecOrdinateurId") REFERENCES "HeadsetInterfaceAvecOrdinateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mic" ADD CONSTRAINT "Mic_micModelId_fkey" FOREIGN KEY ("micModelId") REFERENCES "MicModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mic" ADD CONSTRAINT "Mic_micInterfaceAvecOrdinateurId_fkey" FOREIGN KEY ("micInterfaceAvecOrdinateurId") REFERENCES "MicInterfaceAvecOrdinateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mic" ADD CONSTRAINT "Mic_micSonSurroundId_fkey" FOREIGN KEY ("micSonSurroundId") REFERENCES "MicSonSurround"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mousepad" ADD CONSTRAINT "Mousepad_mousepadModelId_fkey" FOREIGN KEY ("mousepadModelId") REFERENCES "MousepadModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mousepad" ADD CONSTRAINT "Mousepad_mousepadSizeId_fkey" FOREIGN KEY ("mousepadSizeId") REFERENCES "MousepadSize"("id") ON DELETE SET NULL ON UPDATE CASCADE;
