-- DropForeignKey
ALTER TABLE "Powersupply" DROP CONSTRAINT "Powersupply_certificationId_fkey";

-- DropForeignKey
ALTER TABLE "Powersupply" DROP CONSTRAINT "Powersupply_powersupplyMarqueId_fkey";

-- AddForeignKey
ALTER TABLE "Powersupply" ADD CONSTRAINT "Powersupply_certificationId_fkey" FOREIGN KEY ("certificationId") REFERENCES "PsCertification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Powersupply" ADD CONSTRAINT "Powersupply_powersupplyMarqueId_fkey" FOREIGN KEY ("powersupplyMarqueId") REFERENCES "PowersupplyMarque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
