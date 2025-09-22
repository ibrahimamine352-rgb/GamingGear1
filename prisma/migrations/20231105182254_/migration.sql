-- DropForeignKey
ALTER TABLE "CathegoryCollection" DROP CONSTRAINT "CathegoryCollection_navitemId_fkey";

-- AddForeignKey
ALTER TABLE "CathegoryCollection" ADD CONSTRAINT "CathegoryCollection_navitemId_fkey" FOREIGN KEY ("navitemId") REFERENCES "navitem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
