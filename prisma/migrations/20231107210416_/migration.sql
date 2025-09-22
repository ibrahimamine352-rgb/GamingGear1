-- CreateTable
CREATE TABLE "Cooling" (
    "id" TEXT NOT NULL,
    "Rgb" BOOLEAN NOT NULL,
    "CoolingMarkId" TEXT NOT NULL,
    "CoolingTypeId" TEXT NOT NULL,
    "FansNumberId" TEXT NOT NULL,
    "CPUSupportId" TEXT NOT NULL,

    CONSTRAINT "Cooling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoolingMark" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CoolingMark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoolingType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CoolingType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FansNumber" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "FansNumber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductToCooling" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToCooling_AB_unique" ON "_ProductToCooling"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToCooling_B_index" ON "_ProductToCooling"("B");

-- AddForeignKey
ALTER TABLE "Cooling" ADD CONSTRAINT "Cooling_CoolingMarkId_fkey" FOREIGN KEY ("CoolingMarkId") REFERENCES "CoolingMark"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cooling" ADD CONSTRAINT "Cooling_CoolingTypeId_fkey" FOREIGN KEY ("CoolingTypeId") REFERENCES "CoolingType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cooling" ADD CONSTRAINT "Cooling_FansNumberId_fkey" FOREIGN KEY ("FansNumberId") REFERENCES "FansNumber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cooling" ADD CONSTRAINT "Cooling_CPUSupportId_fkey" FOREIGN KEY ("CPUSupportId") REFERENCES "CPUSupport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToCooling" ADD CONSTRAINT "_ProductToCooling_A_fkey" FOREIGN KEY ("A") REFERENCES "Cooling"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToCooling" ADD CONSTRAINT "_ProductToCooling_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
