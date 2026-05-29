-- CreateEnum
CREATE TYPE "EntityRole" AS ENUM ('DONO_DE_OBRA', 'FISCALIZACAO', 'PROJETISTA', 'ENTIDADE_EXECUTANTE');

-- CreateEnum
CREATE TYPE "IssueStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED');

-- CreateTable
CREATE TABLE "construction_sites" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "construction_sites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "minutes" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "sourceDocumentUrl" TEXT,
    "sourceDocumentName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "minutes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entities" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "role" "EntityRole" NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "issues" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "minuteId" TEXT NOT NULL,
    "sequenceNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "observations" TEXT,
    "status" "IssueStatus" NOT NULL DEFAULT 'PENDING',
    "raisedInMinuteId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "issues_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "construction_sites_code_key" ON "construction_sites"("code");

-- CreateIndex
CREATE INDEX "construction_sites_code_idx" ON "construction_sites"("code");

-- CreateIndex
CREATE INDEX "minutes_siteId_idx" ON "minutes"("siteId");

-- CreateIndex
CREATE UNIQUE INDEX "minutes_siteId_number_key" ON "minutes"("siteId", "number");

-- CreateIndex
CREATE INDEX "entities_siteId_idx" ON "entities"("siteId");

-- CreateIndex
CREATE UNIQUE INDEX "entities_siteId_role_key" ON "entities"("siteId", "role");

-- CreateIndex
CREATE INDEX "issues_siteId_idx" ON "issues"("siteId");

-- CreateIndex
CREATE INDEX "issues_entityId_idx" ON "issues"("entityId");

-- CreateIndex
CREATE INDEX "issues_minuteId_idx" ON "issues"("minuteId");

-- CreateIndex
CREATE INDEX "issues_status_idx" ON "issues"("status");

-- CreateIndex
CREATE UNIQUE INDEX "issues_entityId_sequenceNumber_key" ON "issues"("entityId", "sequenceNumber");

-- AddForeignKey
ALTER TABLE "minutes" ADD CONSTRAINT "minutes_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "construction_sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entities" ADD CONSTRAINT "entities_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "construction_sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issues" ADD CONSTRAINT "issues_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "construction_sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issues" ADD CONSTRAINT "issues_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issues" ADD CONSTRAINT "issues_minuteId_fkey" FOREIGN KEY ("minuteId") REFERENCES "minutes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
