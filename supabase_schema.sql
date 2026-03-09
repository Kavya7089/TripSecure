-- Supabase Database Schema for TripSecure

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    "passwordHash" VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'TOURIST',
    "walletAddress" VARCHAR(255),
    "aadhaarNumber" VARCHAR(100),
    "passportNumber" VARCHAR(100),
    "blockchainTouristId" VARCHAR(255),
    "pushToken" text,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tourists Table
CREATE TABLE IF NOT EXISTS tourists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID REFERENCES users(id) ON DELETE CASCADE,
    "blockchainId" VARCHAR(255),
    "kycCid" VARCHAR(255),
    "kycHash" VARCHAR(255),
    "validUntil" TIMESTAMPTZ,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- e.g., 'panic', 'geofence', 'restricted'
    location JSONB, -- { latitude: float, longitude: float }
    description TEXT,
    zone VARCHAR(255),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Risk Areas Table
CREATE TABLE IF NOT EXISTS "riskAreas" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    radius DOUBLE PRECISION NOT NULL, -- in meters
    description TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Trips Table
-- Dynamic fields can be accepted via Supabase depending on what the frontend passes, but we enforce basic structure
CREATE TABLE IF NOT EXISTS trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tourist UUID REFERENCES users(id) ON DELETE CASCADE,
    destination VARCHAR(255),
    "startDate" TIMESTAMPTZ,
    "endDate" TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'upcoming',
    budget NUMERIC DEFAULT 0,
    expenses JSONB DEFAULT '[]'::JSONB,
    members JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Incidents Table (Optional, for web authority dashboards)
CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tourist UUID REFERENCES users(id) ON DELETE CASCADE,
    reporter UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255),
    description TEXT,
    severity VARCHAR(50) DEFAULT 'low',
    status VARCHAR(50) DEFAULT 'reported',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) - Best Practice to enable later if connecting clients directly.
-- For now, backend uses Service Role / Anon with Server Logic.
