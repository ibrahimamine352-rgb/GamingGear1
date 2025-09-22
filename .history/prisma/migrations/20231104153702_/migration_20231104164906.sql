-- AlterTable
ALTER TABLE "Screen" ADD COLUMN     "MarkId" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "Mark" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Mark_pkey" PRIMARY KEY ("id")
);
