import mongoose from 'mongoose';

const HospitalSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  specialties: [{ type: String }],
  avg_consultation_minutes: { type: Number, default: 12 },
  rating: { type: Number, default: 4.8 },
  created_at: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default mongoose.models.Hospital || mongoose.model('Hospital', HospitalSchema);
