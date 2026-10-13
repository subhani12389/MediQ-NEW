import mongoose from 'mongoose';

const TokenSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  token_number: { type: String, required: true, index: true },
  ref_id: { type: String, required: true, unique: true, index: true },
  patient_id: { type: String, required: true, index: true },
  patient_name: { type: String, required: true },
  patient_phone: { type: String, default: null },
  patient_type: { type: String, enum: ['online', 'walkin'], default: 'online' },
  hospital_id: { type: String, required: true, index: true },
  department_id: { type: String, required: true, index: true },
  status: { 
    type: String, 
    enum: ['waiting', 'called', 'in_consultation', 'completed', 'no_show', 'cancelled'], 
    default: 'waiting',
    index: true
  },
  priority: { 
    type: String, 
    enum: ['NORMAL', 'PRIORITY', 'EMERGENCY'], 
    default: 'NORMAL',
    index: true
  },
  priority_reason: { type: String, default: null },
  intent_status: { 
    type: String, 
    enum: ['waiting', 'on_my_way', 'arrived', 'cant_come'], 
    default: 'waiting' 
  },
  notes: { type: String, default: null },
  created_at: { type: Date, default: Date.now },
  called_at: { type: Date, default: null },
  consultation_started_at: { type: Date, default: null },
  completed_at: { type: Date, default: null },
  consultation_duration_minutes: { type: Number, default: null }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default mongoose.models.Token || mongoose.model('Token', TokenSchema);
