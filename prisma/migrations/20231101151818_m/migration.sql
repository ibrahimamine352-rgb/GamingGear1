-- CreateEnum
CREATE TYPE "NavLab" AS ENUM ('PCS', 'COMPONENTS', 'PEREPHRALS', 'PACKS');

-- CreateEnum
CREATE TYPE "Componenets" AS ENUM ('MOTHERBOARD', 'CPU', 'GPU', 'RAM', 'DISK', 'CASE', 'POWERSUPPLY');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL DEFAULT 'user',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dicountPrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "stock" DECIMAL(65,30) NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "template" TEXT NOT NULL DEFAULT '',
    "useTemplate" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Field" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "navLab" "NavLab" NOT NULL DEFAULT 'COMPONENTS',

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "phone" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Motherboard" (
    "id" TEXT NOT NULL,
    "manufacturerId" TEXT NOT NULL,
    "ramslotsId" TEXT NOT NULL,
    "chipsetId" TEXT NOT NULL,
    "cpusupportId" TEXT NOT NULL,
    "formatId" TEXT NOT NULL,

    CONSTRAINT "Motherboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RamSlots" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "RamSlots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MotherboardChipset" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MotherboardChipset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CPUSupport" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CPUSupport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guarantee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Guarantee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MotherboardFormat" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MotherboardFormat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manufacturer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "Manufacturer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Processor" (
    "id" TEXT NOT NULL,
    "processorModelId" TEXT NOT NULL,
    "cpusupportId" TEXT NOT NULL,

    CONSTRAINT "Processor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessorModel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ProcessorModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memory" (
    "id" TEXT NOT NULL,
    "rgb" BOOLEAN NOT NULL,
    "marqueId" TEXT NOT NULL,
    "numberId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "frequencyId" TEXT NOT NULL,

    CONSTRAINT "Memory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemoryMarque" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MemoryMarque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemoryNumber" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "MemoryNumber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemoryType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MemoryType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemoryFrequency" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MemoryFrequency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Powersupply" (
    "id" TEXT NOT NULL,
    "modularity" BOOLEAN NOT NULL,
    "certificationId" TEXT NOT NULL,
    "Power" INTEGER NOT NULL,
    "powersupplyMarqueId" TEXT NOT NULL,

    CONSTRAINT "Powersupply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PowersupplyMarque" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PowersupplyMarque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PsCertification" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PsCertification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gpu" (
    "id" TEXT NOT NULL,
    "GpuBrandId" TEXT NOT NULL,
    "gpuArchBrandId" TEXT NOT NULL,
    "graphiccardNameId" TEXT NOT NULL,

    CONSTRAINT "Gpu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GpuBrand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "GpuBrand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GpuArchBrand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "GpuArchBrand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GraphiccardName" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "GraphiccardName_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PCcase" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "caseformatiD" TEXT NOT NULL,
    "numberofFansPreinstalledId" TEXT NOT NULL,
    "rGBTypeId" TEXT NOT NULL,

    CONSTRAINT "PCcase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PCcaseBrand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PCcaseBrand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PCcaseCaseformat" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PCcaseCaseformat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PCcaseNumberofFansPreinstalled" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PCcaseNumberofFansPreinstalled_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PCcaseRGBType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PCcaseRGBType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Harddisk" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "capacityId" TEXT NOT NULL,
    "ComputerinterfaceId" TEXT NOT NULL,
    "DiscFormatId" TEXT NOT NULL,

    CONSTRAINT "Harddisk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HarddiskBrand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "HarddiskBrand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HarddiskType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "HarddiskType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HarddiskCapacity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "HarddiskCapacity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HarddiskComputerinterface" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "HarddiskComputerinterface_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HarddiskDiscFormat" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "HarddiskDiscFormat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Slide" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Slide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchQuery" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,

    CONSTRAINT "SearchQuery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompatibiltyProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "component" "Componenets" NOT NULL,

    CONSTRAINT "CompatibiltyProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductToMotherboard" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductToCPU" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductToMemory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductToPowersupply" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductToGPU" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductToPCCase" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductToStorage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CompatibiltyProfileToMotherboard" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CompatibiltyProfileToProcessor" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CompatibiltyProfileToGpu" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CompatibiltyProfileToMemory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CompatibiltyProfileToHarddisk" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CompatibiltyProfileToPCcase" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CompatibiltyProfileToPowersupply" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "Field_productId_idx" ON "Field"("productId");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");

-- CreateIndex
CREATE INDEX "Image_productId_idx" ON "Image"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToMotherboard_AB_unique" ON "_ProductToMotherboard"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToMotherboard_B_index" ON "_ProductToMotherboard"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToCPU_AB_unique" ON "_ProductToCPU"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToCPU_B_index" ON "_ProductToCPU"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToMemory_AB_unique" ON "_ProductToMemory"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToMemory_B_index" ON "_ProductToMemory"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToPowersupply_AB_unique" ON "_ProductToPowersupply"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToPowersupply_B_index" ON "_ProductToPowersupply"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToGPU_AB_unique" ON "_ProductToGPU"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToGPU_B_index" ON "_ProductToGPU"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToPCCase_AB_unique" ON "_ProductToPCCase"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToPCCase_B_index" ON "_ProductToPCCase"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToStorage_AB_unique" ON "_ProductToStorage"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToStorage_B_index" ON "_ProductToStorage"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CompatibiltyProfileToMotherboard_AB_unique" ON "_CompatibiltyProfileToMotherboard"("A", "B");

-- CreateIndex
CREATE INDEX "_CompatibiltyProfileToMotherboard_B_index" ON "_CompatibiltyProfileToMotherboard"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CompatibiltyProfileToProcessor_AB_unique" ON "_CompatibiltyProfileToProcessor"("A", "B");

-- CreateIndex
CREATE INDEX "_CompatibiltyProfileToProcessor_B_index" ON "_CompatibiltyProfileToProcessor"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CompatibiltyProfileToGpu_AB_unique" ON "_CompatibiltyProfileToGpu"("A", "B");

-- CreateIndex
CREATE INDEX "_CompatibiltyProfileToGpu_B_index" ON "_CompatibiltyProfileToGpu"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CompatibiltyProfileToMemory_AB_unique" ON "_CompatibiltyProfileToMemory"("A", "B");

-- CreateIndex
CREATE INDEX "_CompatibiltyProfileToMemory_B_index" ON "_CompatibiltyProfileToMemory"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CompatibiltyProfileToHarddisk_AB_unique" ON "_CompatibiltyProfileToHarddisk"("A", "B");

-- CreateIndex
CREATE INDEX "_CompatibiltyProfileToHarddisk_B_index" ON "_CompatibiltyProfileToHarddisk"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CompatibiltyProfileToPCcase_AB_unique" ON "_CompatibiltyProfileToPCcase"("A", "B");

-- CreateIndex
CREATE INDEX "_CompatibiltyProfileToPCcase_B_index" ON "_CompatibiltyProfileToPCcase"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CompatibiltyProfileToPowersupply_AB_unique" ON "_CompatibiltyProfileToPowersupply"("A", "B");

-- CreateIndex
CREATE INDEX "_CompatibiltyProfileToPowersupply_B_index" ON "_CompatibiltyProfileToPowersupply"("B");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Field" ADD CONSTRAINT "Field_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Motherboard" ADD CONSTRAINT "Motherboard_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Motherboard" ADD CONSTRAINT "Motherboard_ramslotsId_fkey" FOREIGN KEY ("ramslotsId") REFERENCES "RamSlots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Motherboard" ADD CONSTRAINT "Motherboard_chipsetId_fkey" FOREIGN KEY ("chipsetId") REFERENCES "MotherboardChipset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Motherboard" ADD CONSTRAINT "Motherboard_cpusupportId_fkey" FOREIGN KEY ("cpusupportId") REFERENCES "CPUSupport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Motherboard" ADD CONSTRAINT "Motherboard_formatId_fkey" FOREIGN KEY ("formatId") REFERENCES "MotherboardFormat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processor" ADD CONSTRAINT "Processor_processorModelId_fkey" FOREIGN KEY ("processorModelId") REFERENCES "ProcessorModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processor" ADD CONSTRAINT "Processor_cpusupportId_fkey" FOREIGN KEY ("cpusupportId") REFERENCES "CPUSupport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_marqueId_fkey" FOREIGN KEY ("marqueId") REFERENCES "MemoryMarque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_numberId_fkey" FOREIGN KEY ("numberId") REFERENCES "MemoryNumber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "MemoryType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_frequencyId_fkey" FOREIGN KEY ("frequencyId") REFERENCES "MemoryFrequency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Powersupply" ADD CONSTRAINT "Powersupply_certificationId_fkey" FOREIGN KEY ("certificationId") REFERENCES "PowersupplyMarque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Powersupply" ADD CONSTRAINT "Powersupply_powersupplyMarqueId_fkey" FOREIGN KEY ("powersupplyMarqueId") REFERENCES "PsCertification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gpu" ADD CONSTRAINT "Gpu_GpuBrandId_fkey" FOREIGN KEY ("GpuBrandId") REFERENCES "GpuBrand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gpu" ADD CONSTRAINT "Gpu_gpuArchBrandId_fkey" FOREIGN KEY ("gpuArchBrandId") REFERENCES "GpuArchBrand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gpu" ADD CONSTRAINT "Gpu_graphiccardNameId_fkey" FOREIGN KEY ("graphiccardNameId") REFERENCES "GraphiccardName"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PCcase" ADD CONSTRAINT "PCcase_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "PCcaseBrand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PCcase" ADD CONSTRAINT "PCcase_caseformatiD_fkey" FOREIGN KEY ("caseformatiD") REFERENCES "PCcaseCaseformat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PCcase" ADD CONSTRAINT "PCcase_numberofFansPreinstalledId_fkey" FOREIGN KEY ("numberofFansPreinstalledId") REFERENCES "PCcaseNumberofFansPreinstalled"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PCcase" ADD CONSTRAINT "PCcase_rGBTypeId_fkey" FOREIGN KEY ("rGBTypeId") REFERENCES "PCcaseRGBType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harddisk" ADD CONSTRAINT "Harddisk_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "HarddiskBrand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harddisk" ADD CONSTRAINT "Harddisk_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "HarddiskType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harddisk" ADD CONSTRAINT "Harddisk_capacityId_fkey" FOREIGN KEY ("capacityId") REFERENCES "HarddiskCapacity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harddisk" ADD CONSTRAINT "Harddisk_ComputerinterfaceId_fkey" FOREIGN KEY ("ComputerinterfaceId") REFERENCES "HarddiskComputerinterface"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harddisk" ADD CONSTRAINT "Harddisk_DiscFormatId_fkey" FOREIGN KEY ("DiscFormatId") REFERENCES "HarddiskDiscFormat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToMotherboard" ADD CONSTRAINT "_ProductToMotherboard_A_fkey" FOREIGN KEY ("A") REFERENCES "Motherboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToMotherboard" ADD CONSTRAINT "_ProductToMotherboard_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToCPU" ADD CONSTRAINT "_ProductToCPU_A_fkey" FOREIGN KEY ("A") REFERENCES "Processor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToCPU" ADD CONSTRAINT "_ProductToCPU_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToMemory" ADD CONSTRAINT "_ProductToMemory_A_fkey" FOREIGN KEY ("A") REFERENCES "Memory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToMemory" ADD CONSTRAINT "_ProductToMemory_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToPowersupply" ADD CONSTRAINT "_ProductToPowersupply_A_fkey" FOREIGN KEY ("A") REFERENCES "Powersupply"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToPowersupply" ADD CONSTRAINT "_ProductToPowersupply_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToGPU" ADD CONSTRAINT "_ProductToGPU_A_fkey" FOREIGN KEY ("A") REFERENCES "Gpu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToGPU" ADD CONSTRAINT "_ProductToGPU_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToPCCase" ADD CONSTRAINT "_ProductToPCCase_A_fkey" FOREIGN KEY ("A") REFERENCES "PCcase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToPCCase" ADD CONSTRAINT "_ProductToPCCase_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToStorage" ADD CONSTRAINT "_ProductToStorage_A_fkey" FOREIGN KEY ("A") REFERENCES "Harddisk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToStorage" ADD CONSTRAINT "_ProductToStorage_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompatibiltyProfileToMotherboard" ADD CONSTRAINT "_CompatibiltyProfileToMotherboard_A_fkey" FOREIGN KEY ("A") REFERENCES "CompatibiltyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompatibiltyProfileToMotherboard" ADD CONSTRAINT "_CompatibiltyProfileToMotherboard_B_fkey" FOREIGN KEY ("B") REFERENCES "Motherboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompatibiltyProfileToProcessor" ADD CONSTRAINT "_CompatibiltyProfileToProcessor_A_fkey" FOREIGN KEY ("A") REFERENCES "CompatibiltyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompatibiltyProfileToProcessor" ADD CONSTRAINT "_CompatibiltyProfileToProcessor_B_fkey" FOREIGN KEY ("B") REFERENCES "Processor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompatibiltyProfileToGpu" ADD CONSTRAINT "_CompatibiltyProfileToGpu_A_fkey" FOREIGN KEY ("A") REFERENCES "CompatibiltyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompatibiltyProfileToGpu" ADD CONSTRAINT "_CompatibiltyProfileToGpu_B_fkey" FOREIGN KEY ("B") REFERENCES "Gpu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompatibiltyProfileToMemory" ADD CONSTRAINT "_CompatibiltyProfileToMemory_A_fkey" FOREIGN KEY ("A") REFERENCES "CompatibiltyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompatibiltyProfileToMemory" ADD CONSTRAINT "_CompatibiltyProfileToMemory_B_fkey" FOREIGN KEY ("B") REFERENCES "Memory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompatibiltyProfileToHarddisk" ADD CONSTRAINT "_CompatibiltyProfileToHarddisk_A_fkey" FOREIGN KEY ("A") REFERENCES "CompatibiltyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompatibiltyProfileToHarddisk" ADD CONSTRAINT "_CompatibiltyProfileToHarddisk_B_fkey" FOREIGN KEY ("B") REFERENCES "Harddisk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompatibiltyProfileToPCcase" ADD CONSTRAINT "_CompatibiltyProfileToPCcase_A_fkey" FOREIGN KEY ("A") REFERENCES "CompatibiltyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompatibiltyProfileToPCcase" ADD CONSTRAINT "_CompatibiltyProfileToPCcase_B_fkey" FOREIGN KEY ("B") REFERENCES "PCcase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompatibiltyProfileToPowersupply" ADD CONSTRAINT "_CompatibiltyProfileToPowersupply_A_fkey" FOREIGN KEY ("A") REFERENCES "CompatibiltyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompatibiltyProfileToPowersupply" ADD CONSTRAINT "_CompatibiltyProfileToPowersupply_B_fkey" FOREIGN KEY ("B") REFERENCES "Powersupply"("id") ON DELETE CASCADE ON UPDATE CASCADE;
