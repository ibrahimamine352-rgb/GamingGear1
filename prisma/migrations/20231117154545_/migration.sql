-- CreateTable
CREATE TABLE "PreBuiltPcmodel" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "pcTemplateId" TEXT NOT NULL,

    CONSTRAINT "PreBuiltPcmodel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PreBuiltPcmodel_productId_key" ON "PreBuiltPcmodel"("productId");

-- AddForeignKey
ALTER TABLE "PreBuiltPcmodel" ADD CONSTRAINT "PreBuiltPcmodel_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreBuiltPcmodel" ADD CONSTRAINT "PreBuiltPcmodel_pcTemplateId_fkey" FOREIGN KEY ("pcTemplateId") REFERENCES "pcTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
