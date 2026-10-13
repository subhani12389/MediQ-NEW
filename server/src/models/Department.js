import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  hospital_id: { type: String, required: true, index: true },
  name: { type: String, required: true },
  doctor_name: { type: String, default: 'Duty Doctor' },
  avg_time_minutes: { type: Number, default: 15 },
  room_no: { type: String, default: 'OPD-101' },
  is_paused: { type: Boolean, default: false },
  pause_reason: { type: String, default: null }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default mongoose.models.Department || mongoose.model('Department', DepartmentSchema);
