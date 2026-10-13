import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  user_id: { type: String, default: null },
  user_name: { type: String, default: 'System' },
  user_role: { type: String, default: 'system' },
  action: { type: String, required: true },
  token_id: { type: String, default: null },
  token_number: { type: String, default: null },
  previous_status: { type: String, default: null },
  new_status: { type: String, default: null },
  details: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
