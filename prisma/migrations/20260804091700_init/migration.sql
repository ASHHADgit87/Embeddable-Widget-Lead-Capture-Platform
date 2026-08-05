-- CreateEnum
CREATE TYPE "WidgetType" AS ENUM ('SIGNUP_FORM', 'CONTACT_FORM', 'CTA_POPOVER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "widgets" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "type" "WidgetType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "buttonText" TEXT NOT NULL DEFAULT 'Submit',
    "fields" JSONB NOT NULL,
    "displayOptions" JSONB,
    "honeypotFieldName" TEXT NOT NULL DEFAULT 'company_website',
    "bundleVersion" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "widgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL,
    "widgetId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "ipAddress" TEXT,
    "country" TEXT,
    "region" TEXT,
    "city" TEXT,
    "geoProvider" TEXT,
    "geoFailed" BOOLEAN NOT NULL DEFAULT false,
    "notifySent" BOOLEAN NOT NULL DEFAULT false,
    "notifyError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "widgets_tenantId_idx" ON "widgets"("tenantId");

-- CreateIndex
CREATE INDEX "submissions_tenantId_idx" ON "submissions"("tenantId");

-- CreateIndex
CREATE INDEX "submissions_widgetId_idx" ON "submissions"("widgetId");

-- CreateIndex
CREATE INDEX "submissions_createdAt_idx" ON "submissions"("createdAt");

-- AddForeignKey
ALTER TABLE "widgets" ADD CONSTRAINT "widgets_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_widgetId_fkey" FOREIGN KEY ("widgetId") REFERENCES "widgets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
