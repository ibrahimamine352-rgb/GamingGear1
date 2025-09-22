/*
  Warnings:

  - Added the required column `rgb` to the `keyboard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wireless` to the `keyboard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "keyboard" ADD COLUMN     "keyboarButtonsNumberId" TEXT,
ADD COLUMN     "keyboarFormatId" TEXT,
ADD COLUMN     "keyboarTouchTypeId" TEXT,
ADD COLUMN     "keyboarbrandId" TEXT,
ADD COLUMN     "rgb" BOOLEAN NOT NULL,
ADD COLUMN     "wireless" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "keyboarbrand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "keyboarbrand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keyboarFormat" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "keyboarFormat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keyboarButtonsNumber" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "keyboarButtonsNumber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keyboarTouchType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "keyboarTouchType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "keyboard" ADD CONSTRAINT "keyboard_keyboarbrandId_fkey" FOREIGN KEY ("keyboarbrandId") REFERENCES "keyboarbrand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "keyboard" ADD CONSTRAINT "keyboard_keyboarFormatId_fkey" FOREIGN KEY ("keyboarFormatId") REFERENCES "keyboarFormat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "keyboard" ADD CONSTRAINT "keyboard_keyboarButtonsNumberId_fkey" FOREIGN KEY ("keyboarButtonsNumberId") REFERENCES "keyboarButtonsNumber"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "keyboard" ADD CONSTRAINT "keyboard_keyboarTouchTypeId_fkey" FOREIGN KEY ("keyboarTouchTypeId") REFERENCES "keyboarTouchType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
