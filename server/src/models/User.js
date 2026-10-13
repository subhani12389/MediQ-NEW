import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, default: null },
  role: { 
    type: String, 
    enum: ['patient', 'receptionist', 'doctor', 'admin'], 
    default: 'patient',
    index: true 
  },
  password: { type: String, default: null }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
