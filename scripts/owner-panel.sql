-- Panel propietario / comercios reclamados
-- Pensado para Matecito SQL Editor: no usa extensiones ni information_schema.

CREATE TABLE IF NOT EXISTS owner_listings (
  id TEXT PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text),
  "ownerId" TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('comercio', 'hospedaje')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paused')),
  name TEXT NOT NULL,
  category TEXT,
  type TEXT,
  address TEXT,
  phone TEXT,
  whatsapp TEXT,
  price TEXT,
  "priceMax" TEXT,
  capacity TEXT,
  description TEXT,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  "evidenceText" TEXT,
  "verificationStatus" TEXT NOT NULL DEFAULT 'none',
  "publishedRecordId" TEXT,
  "adminNotes" TEXT,
  "reviewedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS owner_claims (
  id TEXT PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text),
  "ownerId" TEXT NOT NULL,
  "sourceCollection" TEXT NOT NULL CHECK ("sourceCollection" IN ('comercios', 'hospedajes')),
  "sourceRecordId" TEXT NOT NULL,
  "businessName" TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  "evidenceType" TEXT NOT NULL DEFAULT 'other',
  "evidenceText" TEXT,
  "contactPhone" TEXT,
  "contactEmail" TEXT,
  notes TEXT,
  "adminNotes" TEXT,
  "reviewedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS owner_change_requests (
  id TEXT PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text),
  "ownerId" TEXT NOT NULL,
  "sourceCollection" TEXT NOT NULL CHECK ("sourceCollection" IN ('comercios', 'hospedajes')),
  "sourceRecordId" TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  changes JSONB NOT NULL DEFAULT '{}'::jsonb,
  reason TEXT,
  "adminNotes" TEXT,
  "reviewedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS owner_listings_owner_idx ON owner_listings ("ownerId");
CREATE INDEX IF NOT EXISTS owner_listings_status_idx ON owner_listings (status);
CREATE INDEX IF NOT EXISTS owner_claims_owner_idx ON owner_claims ("ownerId");
CREATE INDEX IF NOT EXISTS owner_claims_status_idx ON owner_claims (status);
CREATE INDEX IF NOT EXISTS owner_change_requests_owner_idx ON owner_change_requests ("ownerId");
CREATE INDEX IF NOT EXISTS owner_change_requests_status_idx ON owner_change_requests (status);
