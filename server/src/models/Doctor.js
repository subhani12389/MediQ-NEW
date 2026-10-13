import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  hospital_id: { type: String, required: true, index: true },
  department_id: { type: String, required: true, index: true },
  user_id: { type: String, default: null },
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['AVAILABLE', 'ON_BREAK', 'UNAVAILABLE', 'IN_OPD'], 
    default: 'AVAILABLE' 
  },
  room_no: { type: String, default: 'OPD-101' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);
