import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Hospital from './src/models/Hospital.js';
import Department from './src/models/Department.js';
import Doctor from './src/models/Doctor.js';
import User from './src/models/User.js';
import PatientFile from './src/models/PatientFile.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mediq';

async function seedDatabase() {
  console.log('🌱 Starting MediQ MongoDB Database Seeding...');
  console.log(`Connecting to: ${MONGODB_URI}`);

  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB.');

    // 1. Seed Hospitals
    const hospitals = [
      {
        id: 'hosp-1',
        name: 'City Care Super Specialty Hospital',
        location: 'Bandra West',
        city: 'Mumbai',
        address: '45 Hill Road, Bandra West, Mumbai, Maharashtra 400050',
        specialties: ['Cardiology', 'Orthopedics', 'Neurology', 'General Medicine'],
        avg_consultation_minutes: 12,
        rating: 4.8
      },
      {
        id: 'hosp-2',
        name: 'Apollo Health & Research Center',
        location: 'Saket',
        city: 'Delhi',
        address: 'Press Enclave Road, Saket, New Delhi 110017',
        specialties: ['Cardiology', 'Pediatrics', 'Dermatology', 'ENT'],
        avg_consultation_minutes: 15,
        rating: 4.9
      }
    ];

    for (const hosp of hospitals) {
      await Hospital.findOneAndUpdate({ id: hosp.id }, hosp, { upsert: true, new: true });
    }
    console.log(`✅ Seeded ${hospitals.length} Hospitals.`);

    // 2. Seed Departments
    const departments = [
      {
        id: 'dept-1',
        hospital_id: 'hosp-1',
        name: 'Cardiology',
        doctor_name: 'Dr. Rajesh Sharma',
        avg_time_minutes: 12,
        room_no: 'OPD-102',
        is_paused: false
      },
      {
        id: 'dept-2',
        hospital_id: 'hosp-1',
        name: 'Orthopedics',
        doctor_name: 'Dr. Sunita Rao',
        avg_time_minutes: 15,
        room_no: 'OPD-104',
        is_paused: false
      },
      {
        id: 'dept-3',
        hospital_id: 'hosp-2',
        name: 'Pediatrics',
        doctor_name: 'Dr. Arvind Verma',
        avg_time_minutes: 10,
        room_no: 'OPD-201',
        is_paused: false
      }
    ];

    for (const dept of departments) {
      await Department.findOneAndUpdate({ id: dept.id }, dept, { upsert: true, new: true });
    }
    console.log(`✅ Seeded ${departments.length} Clinical Departments.`);

    // 3. Seed Users
    const users = [
      {
        id: 'user-1',
        full_name: 'Rahul Sharma',
        email: 'patient@mediq.com',
        phone: '+91 9876543210',
        role: 'patient'
      },
      {
        id: 'rec-user-1',
        full_name: 'Priya Singh',
        email: 'priya@citycare.com',
        phone: '+91 9876543211',
        role: 'receptionist'
      },
      {
        id: 'doc-user-1',
        full_name: 'Dr. Rajesh Sharma',
        email: 'dr.sharma@citycare.com',
        phone: '+91 9876543212',
        role: 'doctor'
      },
      {
        id: 'admin-user-1',
        full_name: 'Vikram Mehta',
        email: 'admin@citycare.com',
        phone: '+91 9876543213',
        role: 'admin'
      }
    ];

    for (const u of users) {
      await User.findOneAndUpdate({ email: u.email }, u, { upsert: true, new: true });
    }
    console.log(`✅ Seeded ${users.length} System Users (Patient, Receptionist, Doctor, Admin).`);

    // 4. Seed Patient File
    const patientFiles = [
      {
        id: 'pf-1',
        patient_id: 'user-1',
        patient_code: 'MED1024',
        full_name: 'Rahul Sharma',
        phone: '+91 9876543210',
        age: 24,
        gender: 'Male',
        blood_group: 'B+',
        allergies: 'Penicillin (mild rash)',
        chronic_conditions: 'Mild seasonal asthma'
      }
    ];

    for (const pf of patientFiles) {
      await PatientFile.findOneAndUpdate({ patient_id: pf.patient_id }, pf, { upsert: true, new: true });
    }
    console.log(`✅ Seeded ${patientFiles.length} Digital Patient Files.`);

    console.log('\n🎉 MongoDB database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB Seeding Error:', error.message);
    process.exit(1);
  }
}

seedDatabase();
