/*
  Warnings:

  - You are about to drop the column `caseId` on the `pcTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `graphicCardId` on the `pcTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `hardDiskArray` on the `pcTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `motherBoardId` on the `pcTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `powerSupplyId` on the `pcTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `processorId` on the `pcTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `ramIdArray` on the `pcTemplate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pcTemplate" DROP COLUMN "caseId",
DROP COLUMN "graphicCardId",
DROP COLUMN "hardDiskArray",
DROP COLUMN "motherBoardId",
DROP COLUMN "powerSupplyId",
DROP COLUMN "processorId",
DROP COLUMN "ramIdArray";

-- CreateTable
CREATE TABLE "ComponentOnPcGroupeEntityProfile" (
    "id" TEXT NOT NULL,

    CONSTRAINT "ComponentOnPcGroupeEntityProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityProfile" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "ComponentOnPcGroupeEntityProfile" TEXT,

    CONSTRAINT "EntityProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RamsZ" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DisksZ" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_coolingsZ" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MotherboardsZ" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CPUsZ" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GPUsZ" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CasesZ" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PowerSuppliesZ" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RamsZ_AB_unique" ON "_RamsZ"("A", "B");

-- CreateIndex
CREATE INDEX "_RamsZ_B_index" ON "_RamsZ"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DisksZ_AB_unique" ON "_DisksZ"("A", "B");

-- CreateIndex
CREATE INDEX "_DisksZ_B_index" ON "_DisksZ"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_coolingsZ_AB_unique" ON "_coolingsZ"("A", "B");

-- CreateIndex
CREATE INDEX "_coolingsZ_B_index" ON "_coolingsZ"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MotherboardsZ_AB_unique" ON "_MotherboardsZ"("A", "B");

-- CreateIndex
CREATE INDEX "_MotherboardsZ_B_index" ON "_MotherboardsZ"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CPUsZ_AB_unique" ON "_CPUsZ"("A", "B");

-- CreateIndex
CREATE INDEX "_CPUsZ_B_index" ON "_CPUsZ"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GPUsZ_AB_unique" ON "_GPUsZ"("A", "B");

-- CreateIndex
CREATE INDEX "_GPUsZ_B_index" ON "_GPUsZ"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CasesZ_AB_unique" ON "_CasesZ"("A", "B");

-- CreateIndex
CREATE INDEX "_CasesZ_B_index" ON "_CasesZ"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PowerSuppliesZ_AB_unique" ON "_PowerSuppliesZ"("A", "B");

-- CreateIndex
CREATE INDEX "_PowerSuppliesZ_B_index" ON "_PowerSuppliesZ"("B");

-- AddForeignKey
ALTER TABLE "EntityProfile" ADD CONSTRAINT "EntityProfile_ComponentOnPcGroupeEntityProfile_fkey" FOREIGN KEY ("ComponentOnPcGroupeEntityProfile") REFERENCES "ComponentOnPcGroupeEntityProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RamsZ" ADD CONSTRAINT "_RamsZ_A_fkey" FOREIGN KEY ("A") REFERENCES "ComponentOnPcGroupeEntityProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RamsZ" ADD CONSTRAINT "_RamsZ_B_fkey" FOREIGN KEY ("B") REFERENCES "pcTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DisksZ" ADD CONSTRAINT "_DisksZ_A_fkey" FOREIGN KEY ("A") REFERENCES "ComponentOnPcGroupeEntityProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DisksZ" ADD CONSTRAINT "_DisksZ_B_fkey" FOREIGN KEY ("B") REFERENCES "pcTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_coolingsZ" ADD CONSTRAINT "_coolingsZ_A_fkey" FOREIGN KEY ("A") REFERENCES "EntityProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_coolingsZ" ADD CONSTRAINT "_coolingsZ_B_fkey" FOREIGN KEY ("B") REFERENCES "pcTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MotherboardsZ" ADD CONSTRAINT "_MotherboardsZ_A_fkey" FOREIGN KEY ("A") REFERENCES "EntityProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MotherboardsZ" ADD CONSTRAINT "_MotherboardsZ_B_fkey" FOREIGN KEY ("B") REFERENCES "pcTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CPUsZ" ADD CONSTRAINT "_CPUsZ_A_fkey" FOREIGN KEY ("A") REFERENCES "EntityProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CPUsZ" ADD CONSTRAINT "_CPUsZ_B_fkey" FOREIGN KEY ("B") REFERENCES "pcTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GPUsZ" ADD CONSTRAINT "_GPUsZ_A_fkey" FOREIGN KEY ("A") REFERENCES "EntityProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GPUsZ" ADD CONSTRAINT "_GPUsZ_B_fkey" FOREIGN KEY ("B") REFERENCES "pcTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CasesZ" ADD CONSTRAINT "_CasesZ_A_fkey" FOREIGN KEY ("A") REFERENCES "EntityProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CasesZ" ADD CONSTRAINT "_CasesZ_B_fkey" FOREIGN KEY ("B") REFERENCES "pcTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PowerSuppliesZ" ADD CONSTRAINT "_PowerSuppliesZ_A_fkey" FOREIGN KEY ("A") REFERENCES "EntityProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PowerSuppliesZ" ADD CONSTRAINT "_PowerSuppliesZ_B_fkey" FOREIGN KEY ("B") REFERENCES "pcTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
