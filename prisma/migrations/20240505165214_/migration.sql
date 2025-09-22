-- AlterTable
ALTER TABLE "AccessoryPack" ADD COLUMN     "DefaultChair" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "DefaultManette" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "DefaultSpeaker" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "discountOnPack" DECIMAL(65,30) NOT NULL DEFAULT 0;
