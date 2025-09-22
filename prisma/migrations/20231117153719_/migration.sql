-- CreateTable
CREATE TABLE "pcTemplate" (
    "id" TEXT NOT NULL,
    "motherBoardId" TEXT NOT NULL,
    "processorId" TEXT NOT NULL,
    "graphicCardId" TEXT NOT NULL,
    "powerSupplyId" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "ramIdArray" TEXT[],
    "hardDiskArray" TEXT[],

    CONSTRAINT "pcTemplate_pkey" PRIMARY KEY ("id")
);
