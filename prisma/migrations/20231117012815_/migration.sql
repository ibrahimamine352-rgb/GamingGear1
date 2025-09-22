-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "mouseId" TEXT;

-- CreateTable
CREATE TABLE "Mouse" (
    "id" TEXT NOT NULL,
    "manufacturerId" TEXT,
    "rgb" BOOLEAN NOT NULL,
    "wirless" BOOLEAN NOT NULL,
    "sensorTypeId" TEXT,

    CONSTRAINT "Mouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SensorType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SensorType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductToMouse" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToMouse_AB_unique" ON "_ProductToMouse"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToMouse_B_index" ON "_ProductToMouse"("B");

-- AddForeignKey
ALTER TABLE "Mouse" ADD CONSTRAINT "Mouse_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mouse" ADD CONSTRAINT "Mouse_sensorTypeId_fkey" FOREIGN KEY ("sensorTypeId") REFERENCES "SensorType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToMouse" ADD CONSTRAINT "_ProductToMouse_A_fkey" FOREIGN KEY ("A") REFERENCES "Mouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToMouse" ADD CONSTRAINT "_ProductToMouse_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
