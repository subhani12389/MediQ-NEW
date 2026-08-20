import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('YOUR_')) {
  console.log('⚠️ Supabase environment variables not set. The Express server includes built-in mock seed data that runs out-of-the-box.');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('🌱 Starting Supabase Seeding...');

  // 1. Insert Hospitals
  const { data: hospData, error: hospErr } = await supabase.from('hospitals').upsert([
    {
      name: 'City Care Super Specialty Hospital',
      location: 'Bandra West',
      city: 'Mumbai',
      address: '45 Hill Road, Bandra West, Mumbai 400050',
      specialties: ['Cardiology', 'Orthopedics', 'Neurology', 'General Medicine'],
      avg_consultation_minutes: 12
    },
    {
      name: 'Apollo Health & Research Center',
      location: 'Saket',
      city: 'Delhi',
      address: 'Press Enclave Road, Saket, New Delhi 110017',
      specialties: ['Cardiology', 'Pediatrics', 'Dermatology', 'ENT'],
      avg_consultation_minutes: 15
    }
  ]).select();

  if (hospErr) {
    console.error('Error seeding hospitals:', hospErr);
    process.exit(1);
  }

  console.log('✅ Hospitals seeded:', hospData.length);
  process.exit(0);
}

seedDatabase();
