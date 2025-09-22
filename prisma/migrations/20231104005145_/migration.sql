-- DropForeignKey
ALTER TABLE "Cathegorilab" DROP CONSTRAINT "Cathegorilab_CathegoryCollectionId_fkey";

-- AddForeignKey
ALTER TABLE "Cathegorilab" ADD CONSTRAINT "Cathegorilab_CathegoryCollectionId_fkey" FOREIGN KEY ("CathegoryCollectionId") REFERENCES "CathegoryCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
