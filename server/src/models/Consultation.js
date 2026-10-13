import mongoose from 'mongoose';

const ConsultationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  patient_id: { type: String, required: true, index: true },
  doctor_id: { type: String, required: true, index: true },
  doctor_name: { type: String, required: true },
  queue_token_id: { type: String, default: null },
  token_number: { type: String, default: null },
  department_id: { type: String, default: 'dept-1' },
  department_name: { type: String, default: 'General OPD' },
  hospital_id: { type: String, default: 'hosp-1' },
  hospital_name: { type: String, default: 'City Care Super Specialty Hospital' },
  visit_date: { type: Date, default: Date.now },
  chief_complaint: { type: String, default: '' },
  symptoms: { type: String, default: '' },
  observations: { type: String, default: '' },
  diagnosis: { type: String, default: 'OPD Evaluation' },
  treatment_advice: { type: String, default: '' },
  prescription_notes: { type: String, default: '' },
  follow_up_instructions: { type: String, default: '' },
  additional_remarks: { type: String, default: '' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default mongoose.models.Consultation || mongoose.model('Consultation', ConsultationSchema);
