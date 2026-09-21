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
    role VARCHAR(20) NOT NULL CHECK (role IN ('patient', 'receptionist', 'doctor', 'admin')),
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
    status VARCHAR(20) NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'called', 'in_consultation', 'completed', 'no_show', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    called_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 7. Patient Files Table (Digital Medical File Base Profile)
CREATE TABLE IF NOT EXISTS patient_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    patient_code VARCHAR(50) UNIQUE NOT NULL,
    age INT DEFAULT 28,
    gender VARCHAR(20) DEFAULT 'Male',
    blood_group VARCHAR(10) DEFAULT 'O+',
    allergies TEXT DEFAULT 'None known',
    chronic_conditions TEXT DEFAULT 'None',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Consultations Table (Digital Patient File & Doctor Remarks History)
CREATE TABLE IF NOT EXISTS consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    doctor_name VARCHAR(200) NOT NULL,
    queue_token_id UUID REFERENCES tokens(id) ON DELETE SET NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    department_name VARCHAR(150),
    hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
    hospital_name VARCHAR(255),
    chief_complaint TEXT,
    symptoms TEXT,
    observations TEXT,
    diagnosis TEXT,
    treatment_advice TEXT,
    prescription_notes TEXT,
    follow_up_instructions TEXT,
    additional_remarks TEXT,
    visit_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Consultation Audit Logs Table
CREATE TABLE IF NOT EXISTS consultation_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for lightning fast queries & RLS evaluation
CREATE INDEX IF NOT EXISTS idx_tokens_hospital_id ON tokens(hospital_id);
CREATE INDEX IF NOT EXISTS idx_tokens_department_id ON tokens(department_id);
CREATE INDEX IF NOT EXISTS idx_tokens_patient_id ON tokens(patient_id);
CREATE INDEX IF NOT EXISTS idx_tokens_status ON tokens(status);
CREATE INDEX IF NOT EXISTS idx_consultations_patient_id ON consultations(patient_id);
CREATE INDEX IF NOT EXISTS idx_consultations_doctor_id ON consultations(doctor_id);
CREATE INDEX IF NOT EXISTS idx_patient_files_patient_id ON patient_files(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_files_patient_code ON patient_files(patient_code);

-- Enable Supabase Realtime for Tokens and Consultations
ALTER PUBLICATION supabase_realtime ADD TABLE tokens;
ALTER PUBLICATION supabase_realtime ADD TABLE consultations;

-- 10. Row Level Security (RLS) Setup
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE receptionists ENABLE ROW LEVEL SECURITY;
ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_audit_logs ENABLE ROW LEVEL SECURITY;

-- Hospitals & Departments RLS: Viewable by everyone
CREATE POLICY "Hospitals are viewable by everyone" ON hospitals FOR SELECT USING (true);
CREATE POLICY "Departments are viewable by everyone" ON departments FOR SELECT USING (true);

-- Users RLS
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Tokens RLS
CREATE POLICY "Patients can view own tokens" ON tokens FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients can generate tokens" ON tokens FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Patients can cancel own tokens" ON tokens FOR UPDATE USING (auth.uid() = patient_id AND status = 'waiting');

-- Patient Files RLS:
-- Patients can view their own file
CREATE POLICY "Patients can view own file" ON patient_files FOR SELECT USING (auth.uid() = patient_id);
-- Doctors & Admins can manage patient files
CREATE POLICY "Staff can manage patient files" ON patient_files FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = auth.uid() AND u.role IN ('doctor', 'admin')
    )
);

-- Consultations RLS:
-- Patients can view their own consultation history (read-only)
CREATE POLICY "Patients can view own consultations" ON consultations FOR SELECT USING (auth.uid() = patient_id);
-- Patients CANNOT insert, update, or delete consultations!
-- Doctors & Admins can read, create, and update consultations
CREATE POLICY "Doctors can manage consultations" ON consultations FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = auth.uid() AND u.role IN ('doctor', 'admin')
    )
);

-- Receptionists DO NOT have SELECT policy on consultations to protect medical privacy.
