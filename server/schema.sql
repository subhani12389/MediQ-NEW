-- MediQ Supabase Database Schema & Row Level Security (RLS) Policies

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Hospitals Table
CREATE TABLE IF NOT EXISTS hospitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    specialties TEXT[] DEFAULT '{}',
    avg_consultation_minutes INT DEFAULT 12,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    doctor_name VARCHAR(150),
    avg_time_minutes INT DEFAULT 15,
    room_no VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Users Table (Extends Supabase Auth auth.users)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(200) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('patient', 'receptionist', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Receptionists Table
CREATE TABLE IF NOT EXISTS receptionists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tokens Table
CREATE TABLE IF NOT EXISTS tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_number VARCHAR(20) NOT NULL,
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'called', 'in_progress', 'completed', 'no_show', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    called_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for lightning fast realtime queries
CREATE INDEX IF NOT EXISTS idx_tokens_hospital_id ON tokens(hospital_id);
CREATE INDEX IF NOT EXISTS idx_tokens_department_id ON tokens(department_id);
CREATE INDEX IF NOT EXISTS idx_tokens_patient_id ON tokens(patient_id);
CREATE INDEX IF NOT EXISTS idx_tokens_status ON tokens(status);

-- Enable Supabase Realtime for Tokens Table
ALTER PUBLICATION supabase_realtime ADD TABLE tokens;

-- 7. Row Level Security (RLS) Setup
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE receptionists ENABLE ROW LEVEL SECURITY;
ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;

-- Hospitals RLS: Publicly readable by all
CREATE POLICY "Hospitals are viewable by everyone" ON hospitals FOR SELECT USING (true);

-- Departments RLS: Publicly readable by all
CREATE POLICY "Departments are viewable by everyone" ON departments FOR SELECT USING (true);

-- Users RLS: Users can view and edit their own profiles
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Tokens RLS:
-- Patients can read their own tokens
CREATE POLICY "Patients can view own tokens" ON tokens
    FOR SELECT USING (auth.uid() = patient_id);

-- Patients can insert their own tokens
CREATE POLICY "Patients can generate tokens" ON tokens
    FOR INSERT WITH CHECK (auth.uid() = patient_id);

-- Patients can cancel their own tokens
CREATE POLICY "Patients can cancel own tokens" ON tokens
    FOR UPDATE USING (auth.uid() = patient_id AND status = 'waiting');

-- Receptionists can view and update all tokens for their hospital
CREATE POLICY "Receptionists can manage hospital tokens" ON tokens
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM receptionists r
            WHERE r.user_id = auth.uid()
            AND r.hospital_id = tokens.hospital_id
        )
    );
