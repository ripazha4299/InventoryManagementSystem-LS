-- Migration: init

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE "Role" AS ENUM ('admin','viewer');
CREATE TYPE "ProductStatus" AS ENUM ('INVENTORY','SPORTS_COMPLEX','WITH_PERSON','DELETED');
CREATE TYPE "ProductAction" AS ENUM ('ADDED','ISSUED','RETURNED','STATUS_UPDATE','DELETED');

CREATE TABLE "User" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role "Role" NOT NULL DEFAULT 'admin',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE "AllowedEmail" (
  email VARCHAR(255) PRIMARY KEY,
  "addedBy" UUID,
  "addedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE "Sport" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) UNIQUE NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE "Holder" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255),
  roll VARCHAR(64),
  contact VARCHAR(255),
  "isClubMember" BOOLEAN DEFAULT true
);

CREATE TABLE "Product" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "sportId" UUID,
  name VARCHAR(1024) NOT NULL,
  "serialOrTag" VARCHAR(255),
  "dateAdded" TIMESTAMP,
  status "ProductStatus" NOT NULL DEFAULT 'INVENTORY',
  "currentHolderId" UUID,
  "lastUsedByHolderId" UUID,
  notes TEXT,
  "deletedAt" TIMESTAMP,
  "createdById" UUID,
  "updatedAt" TIMESTAMP
);

CREATE TABLE "ProductHistory" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "productId" UUID NOT NULL,
  action "ProductAction" NOT NULL,
  "holderId" UUID,
  "byUserId" UUID,
  notes TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE "InventoryKey" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "keyName" VARCHAR(255) NOT NULL,
  "currentHolderId" UUID,
  "lastUpdated" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE "KeyHistory" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "keyId" UUID NOT NULL,
  "fromHolderId" UUID,
  "toHolderId" UUID,
  "byUserId" UUID,
  "timestamp" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT
);

ALTER TABLE "Product" ADD CONSTRAINT fk_sport FOREIGN KEY ("sportId") REFERENCES "Sport"(id) ON DELETE SET NULL;
ALTER TABLE "Product" ADD CONSTRAINT fk_current_holder FOREIGN KEY ("currentHolderId") REFERENCES "Holder"(id);
ALTER TABLE "Product" ADD CONSTRAINT fk_last_used FOREIGN KEY ("lastUsedByHolderId") REFERENCES "Holder"(id);
ALTER TABLE "ProductHistory" ADD CONSTRAINT fk_product FOREIGN KEY ("productId") REFERENCES "Product"(id) ON DELETE CASCADE;
ALTER TABLE "ProductHistory" ADD CONSTRAINT fk_holder FOREIGN KEY ("holderId") REFERENCES "Holder"(id);
ALTER TABLE "ProductHistory" ADD CONSTRAINT fk_by_user FOREIGN KEY ("byUserId") REFERENCES "User"(id);
ALTER TABLE "InventoryKey" ADD CONSTRAINT fk_key_holder FOREIGN KEY ("currentHolderId") REFERENCES "Holder"(id);
ALTER TABLE "KeyHistory" ADD CONSTRAINT fk_key FOREIGN KEY ("keyId") REFERENCES "InventoryKey"(id) ON DELETE CASCADE;
ALTER TABLE "KeyHistory" ADD CONSTRAINT fk_key_from FOREIGN KEY ("fromHolderId") REFERENCES "Holder"(id);
ALTER TABLE "KeyHistory" ADD CONSTRAINT fk_key_to FOREIGN KEY ("toHolderId") REFERENCES "Holder"(id);
ALTER TABLE "KeyHistory" ADD CONSTRAINT fk_key_by_user FOREIGN KEY ("byUserId") REFERENCES "User"(id);

CREATE INDEX idx_product_sportId ON "Product"("sportId");
CREATE INDEX idx_product_status ON "Product"(status);
CREATE INDEX idx_producthistory_productId ON "ProductHistory"("productId");
CREATE INDEX idx_holder_roll ON "Holder"(roll);
