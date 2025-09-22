-- CreateTable
CREATE TABLE "CathegoryCollection" (
    "id" TEXT NOT NULL,
    "Label" TEXT NOT NULL,

    CONSTRAINT "CathegoryCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToCathegoryCollection" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToCathegoryCollection_AB_unique" ON "_CategoryToCathegoryCollection"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToCathegoryCollection_B_index" ON "_CategoryToCathegoryCollection"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToCathegoryCollection" ADD CONSTRAINT "_CategoryToCathegoryCollection_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToCathegoryCollection" ADD CONSTRAINT "_CategoryToCathegoryCollection_B_fkey" FOREIGN KEY ("B") REFERENCES "CathegoryCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
