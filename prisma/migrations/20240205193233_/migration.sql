-- CreateTable
CREATE TABLE "Camera" (
    "id" TEXT NOT NULL,
    "manufacturerId" TEXT,
    "mousepadModelId" TEXT,

    CONSTRAINT "Camera_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CameraType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CameraType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hautparleur" (
    "id" TEXT NOT NULL,
    "manufacturerId" TEXT,
    "RgbTypeId" TEXT,
    "SonsurroundId" TEXT,

    CONSTRAINT "Hautparleur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RgbType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "RgbType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sonsurround" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Sonsurround_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chaisegaming" (
    "id" TEXT NOT NULL,
    "manufacturerId" TEXT,
    "RgbTypeId" TEXT,

    CONSTRAINT "Chaisegaming_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manette" (
    "id" TEXT NOT NULL,
    "manufacturerId" TEXT,
    "RgbTypeId" TEXT,

    CONSTRAINT "Manette_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pack" (
    "id" TEXT NOT NULL,
    "manufacturerId" TEXT,

    CONSTRAINT "Pack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductToCamera" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductToHautparleur" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductToChaisegaming" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductsToPack" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToCamera_AB_unique" ON "_ProductToCamera"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToCamera_B_index" ON "_ProductToCamera"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToHautparleur_AB_unique" ON "_ProductToHautparleur"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToHautparleur_B_index" ON "_ProductToHautparleur"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToChaisegaming_AB_unique" ON "_ProductToChaisegaming"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToChaisegaming_B_index" ON "_ProductToChaisegaming"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductsToPack_AB_unique" ON "_ProductsToPack"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductsToPack_B_index" ON "_ProductsToPack"("B");

-- AddForeignKey
ALTER TABLE "Camera" ADD CONSTRAINT "Camera_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Camera" ADD CONSTRAINT "Camera_mousepadModelId_fkey" FOREIGN KEY ("mousepadModelId") REFERENCES "CameraType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hautparleur" ADD CONSTRAINT "Hautparleur_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hautparleur" ADD CONSTRAINT "Hautparleur_RgbTypeId_fkey" FOREIGN KEY ("RgbTypeId") REFERENCES "RgbType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hautparleur" ADD CONSTRAINT "Hautparleur_SonsurroundId_fkey" FOREIGN KEY ("SonsurroundId") REFERENCES "Sonsurround"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chaisegaming" ADD CONSTRAINT "Chaisegaming_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chaisegaming" ADD CONSTRAINT "Chaisegaming_RgbTypeId_fkey" FOREIGN KEY ("RgbTypeId") REFERENCES "RgbType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manette" ADD CONSTRAINT "Manette_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manette" ADD CONSTRAINT "Manette_RgbTypeId_fkey" FOREIGN KEY ("RgbTypeId") REFERENCES "RgbType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pack" ADD CONSTRAINT "Pack_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToCamera" ADD CONSTRAINT "_ProductToCamera_A_fkey" FOREIGN KEY ("A") REFERENCES "Camera"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToCamera" ADD CONSTRAINT "_ProductToCamera_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToHautparleur" ADD CONSTRAINT "_ProductToHautparleur_A_fkey" FOREIGN KEY ("A") REFERENCES "Hautparleur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToHautparleur" ADD CONSTRAINT "_ProductToHautparleur_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToChaisegaming" ADD CONSTRAINT "_ProductToChaisegaming_A_fkey" FOREIGN KEY ("A") REFERENCES "Chaisegaming"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToChaisegaming" ADD CONSTRAINT "_ProductToChaisegaming_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductsToPack" ADD CONSTRAINT "_ProductsToPack_A_fkey" FOREIGN KEY ("A") REFERENCES "Pack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductsToPack" ADD CONSTRAINT "_ProductsToPack_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
