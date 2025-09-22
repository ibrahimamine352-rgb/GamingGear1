-- AlterTable
ALTER TABLE "Manette" ADD COLUMN     "Connectiviteid" TEXT;

-- CreateTable
CREATE TABLE "Connectivite" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Connectivite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Manette" ADD CONSTRAINT "Manette_Connectiviteid_fkey" FOREIGN KEY ("Connectiviteid") REFERENCES "Connectivite"("id") ON DELETE SET NULL ON UPDATE CASCADE;
