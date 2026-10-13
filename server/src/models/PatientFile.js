import mongoose from 'mongoose';

const PatientFileSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  patient_id: { type: String, required: true, unique: true, index: true },
  patient_code: { type: String, required: true, unique: true, index: true },
  full_name: { type: String, required: true },
  phone: { type: String, default: null },
  age: { type: Number, default: 28 },
  gender: { type: String, default: 'Unspecified' },
  blood_group: { type: String, default: 'Unknown' },
  allergies: { type: String, default: 'None reported' },
  chronic_conditions: { type: String, default: 'None reported' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default mongoose.models.PatientFile || mongoose.model('PatientFile', PatientFileSchema);
