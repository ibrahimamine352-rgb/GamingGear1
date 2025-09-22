-- CreateTable
CREATE TABLE "Screen" (
    "id" TEXT NOT NULL,
    "curved" BOOLEAN NOT NULL,
    "resolutionId" TEXT NOT NULL,
    "RefreshRateId" TEXT NOT NULL,

    CONSTRAINT "Screen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resolution" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Resolution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshRate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "RefreshRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductToScreen" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToScreen_AB_unique" ON "_ProductToScreen"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToScreen_B_index" ON "_ProductToScreen"("B");

-- AddForeignKey
ALTER TABLE "Screen" ADD CONSTRAINT "Screen_resolutionId_fkey" FOREIGN KEY ("resolutionId") REFERENCES "Resolution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Screen" ADD CONSTRAINT "Screen_RefreshRateId_fkey" FOREIGN KEY ("RefreshRateId") REFERENCES "RefreshRate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToScreen" ADD CONSTRAINT "_ProductToScreen_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToScreen" ADD CONSTRAINT "_ProductToScreen_B_fkey" FOREIGN KEY ("B") REFERENCES "Screen"("id") ON DELETE CASCADE ON UPDATE CASCADE;
