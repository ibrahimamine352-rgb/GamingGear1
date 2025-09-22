-- CreateTable
CREATE TABLE "navitem" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "CathegoryCollectionId" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "navitem_pkey" PRIMARY KEY ("id")
);
