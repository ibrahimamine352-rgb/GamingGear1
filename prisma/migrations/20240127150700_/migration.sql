-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "numbers" SET NOT NULL,
ALTER COLUMN "numbers" SET DEFAULT '',
ALTER COLUMN "numbers" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "prodNumber" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "number" TEXT NOT NULL,

    CONSTRAINT "prodNumber_pkey" PRIMARY KEY ("id")
);
