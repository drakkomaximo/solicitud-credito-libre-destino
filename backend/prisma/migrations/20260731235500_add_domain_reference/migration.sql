CREATE TABLE "DomainReference" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DomainReference_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DomainReference_domain_code_key" ON "DomainReference"("domain", "code");
CREATE INDEX "DomainReference_domain_isActive_idx" ON "DomainReference"("domain", "isActive");
