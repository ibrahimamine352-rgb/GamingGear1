-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "numbers" TEXT[] DEFAULT ARRAY[]::TEXT[];
