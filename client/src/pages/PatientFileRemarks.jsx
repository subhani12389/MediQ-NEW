import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  FileText, User, Calendar, Stethoscope, CheckCircle2, Clock, AlertCircle,
  Activity, ArrowLeft, Save, PlusCircle, ShieldAlert, FilePlus, ChevronRight, Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useQueue } from '../context/QueueContext';

export default function PatientFileRemarks() {
  const { patientId } = useParams();
  const [searchParams] = useSearchParams();
  const tokenIdParam = searchParams.get('tokenId');

  const { user, isDoctor, isAdmin } = useAuth();
  const { fetchTokenStatus, completeToken } = useQueue();
  const navigate = useNavigate();

  const [patientFile, setPatientFile] = useState(null);
  const [consultationHistory, setConsultationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  // Form Fields for Current Consultation
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [observations, setObservations] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatmentAdvice, setTreatmentAdvice] = useState('');
  const [prescriptionNotes, setPrescriptionNotes] = useState('');
  const [followUpInstructions, setFollowUpInstructions] = useState('');
  const [additionalRemarks, setAdditionalRemarks] = useState('');

  const targetPatientId = patientId || user?.id || 'user-1';
  const canEdit = isDoctor || isAdmin;

  useEffect(() => {
    fetchPatientData();
  }, [targetPatientId]);

  const fetchPatientData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/consultations/patient/${targetPatientId}`);
      if (res.ok) {
        const data = await res.json();
        setPatientFile(data.patient_file);
        setConsultationHistory(data.consultations || []);
      } else {
        // Fallback demo data
        setPatientFile({
          id: 'pf-1',
          patient_id: targetPatientId,
          patient_code: 'MED1024',
          full_name: 'Rahul Sharma',
          phone: '+91 9876543210',
          age: 24,
          gender: 'Male',
          blood_group: 'B+',
          allergies: 'Penicillin (mild rash)',
          chronic_conditions: 'Mild seasonal asthma'
        });
        setConsultationHistory([
          {
            id: 'cons-1',
            doctor_name: 'Dr. Rajesh Sharma',
            department_name: 'Cardiology',
            visit_date: '2026-09-12T10:30:00Z',
            token_number: '101',
            chief_complaint: 'Fever, mild shortness of breath during exertion',
            symptoms: 'Low-grade fever (99.8°F), fatigue, chest tightness',
            observations: 'BP: 120/80 mmHg, HR: 82 bpm, SpO2: 98%',
            diagnosis: 'Mild exertion fatigue, Normal sinus rhythm on ECG',
            treatment_advice: 'Advised rest, oral hydration',
            prescription_notes: 'Tab Paracetamol 500mg as needed',
            follow_up_instructions: 'Follow up in 2 weeks',
            additional_remarks: 'Patient reported mild stress due to work travel.'
          }
        ]);
      }
    } catch (err) {
      console.warn('Patient file fetch fallback:', err.message);
    }
    setLoading(false);
  };

  const handleSaveConsultation = async (e) => {
    e.preventDefault();
    if (!canEdit) return;

    setSaving(true);
    try {
      const payload = {
        patient_id: targetPatientId,
        doctor_id: user?.id || 'doc-user-1',
        doctor_name: user?.full_name || 'Dr. Rajesh Sharma',
        queue_token_id: tokenIdParam || 'tok-103',
        token_number: '103',
        department_id: user?.department_id || 'dept-1',
        department_name: 'Cardiology',
        hospital_id: user?.hospital_id || 'hosp-1',
        hospital_name: 'City Care Super Specialty Hospital',
        chief_complaint: chiefComplaint,
        symptoms,
        observations,
        diagnosis: diagnosis || 'OPD General Evaluation',
        treatment_advice: treatmentAdvice,
        prescription_notes: prescriptionNotes,
        follow_up_instructions: followUpInstructions,
        additional_remarks: additionalRemarks
      };

      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessMsg('Consultation remarks saved successfully! OPD Token completed.');
        setConsultationHistory(prev => [data.consultation, ...prev]);

        // Reset Form
        setChiefComplaint('');
        setSymptoms('');
        setObservations('');
        setDiagnosis('');
        setTreatmentAdvice('');
        setPrescriptionNotes('');
        setFollowUpInstructions('');
        setAdditionalRemarks('');

        if (tokenIdParam) {
          await completeToken(tokenIdParam);
        }
      }
    } catch (err) {
      alert('Error saving consultation: ' + err.message);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 flex items-center justify-center text-slate-500">
        Loading Digital Patient File...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Back Link & Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>

          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            Patient Code: {patientFile?.patient_code || 'MED1024'}
          </span>
        </div>

        {/* Success Alert Banner */}
        {successMsg && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-center justify-between text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="underline text-emerald-700">Dismiss</button>
          </div>
        )}

        {/* Patient Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-2xl">
                <User className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                    {patientFile?.full_name || 'Rahul Sharma'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                    ID: {patientFile?.patient_code || 'MED1024'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Phone: {patientFile?.phone || '+91 9876543210'} • Registered OPD File
                </p>
              </div>
            </div>

            {!canEdit && (
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" /> Patient Read-Only View
              </span>
            )}
          </div>

          {/* Vitals & Demographics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 font-medium block text-[10px] uppercase">Age / Gender</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">{patientFile?.age || 24} Yrs / {patientFile?.gender || 'Male'}</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 font-medium block text-[10px] uppercase">Blood Group</span>
              <span className="font-bold text-red-600 dark:text-red-400 text-sm">{patientFile?.blood_group || 'B+'}</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 font-medium block text-[10px] uppercase">Known Allergies</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{patientFile?.allergies || 'None known'}</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 font-medium block text-[10px] uppercase">Chronic Conditions</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{patientFile?.chronic_conditions || 'None'}</span>
            </div>
          </div>
        </div>

        {/* Current Consultation Form (Doctors & Staff Only) */}
        {canEdit && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                <FilePlus className="w-5 h-5 text-primary-600" /> Write Consultation Remarks & Diagnosis
              </h2>
              <span className="text-xs font-semibold text-slate-500">
                Doctor: {user?.full_name || 'Dr. Rajesh Sharma'}
              </span>
            </div>

            <form onSubmit={handleSaveConsultation} className="space-y-5 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Chief Complaint</label>
                  <input
                    type="text"
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    placeholder="e.g. Mild headache and chest tightness for 2 days"
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Symptoms Reported</label>
                  <input
                    type="text"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="e.g. Fatigue, low-grade fever, breathlessness"
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Clinical Observations & Vitals</label>
                  <input
                    type="text"
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="e.g. BP: 120/80 mmHg, HR: 84 bpm, Normal S1/S2"
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Diagnosis</label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="e.g. Mild exertion fatigue / Normal ECG"
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Treatment / Advice</label>
                <textarea
                  rows={2}
                  value={treatmentAdvice}
                  onChange={(e) => setTreatmentAdvice(e.target.value)}
                  placeholder="Advised adequate hydration, 8 hours sleep, avoid heavy physical strain..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Prescription Notes</label>
                  <textarea
                    rows={2}
                    value={prescriptionNotes}
                    onChange={(e) => setPrescriptionNotes(e.target.value)}
                    placeholder="Tab Paracetamol 500mg (1-0-1), Multivitamin (0-1-0)"
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Follow-up & Additional Remarks</label>
                  <textarea
                    rows={2}
                    value={additionalRemarks}
                    onChange={(e) => setAdditionalRemarks(e.target.value)}
                    placeholder="Follow up in 2 weeks or if symptoms persist. Patient advised on stress reduction."
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" /> Save Consultation &amp; Complete OPD Visit
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Previous Consultation Visits History Timeline */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-emerald-500" /> Visit History &amp; Previous Doctor Remarks ({consultationHistory.length})
            </h2>
            <span className="text-xs text-slate-500">Sorted by Visit Date</span>
          </div>

          <div className="space-y-6">
            {consultationHistory.length > 0 ? (
              consultationHistory.map((visit) => (
                <div
                  key={visit.id}
                  className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/60 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                          {visit.doctor_name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {visit.department_name} • Token #{visit.token_number}
                        </p>
                      </div>
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-primary-500" />
                      {new Date(visit.visit_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {visit.chief_complaint && (
                      <div>
                        <span className="text-slate-400 font-semibold block text-[10px] uppercase">Chief Complaint</span>
                        <p className="text-slate-800 dark:text-slate-200 font-medium">{visit.chief_complaint}</p>
                      </div>
                    )}

                    {visit.diagnosis && (
                      <div>
                        <span className="text-slate-400 font-semibold block text-[10px] uppercase">Diagnosis</span>
                        <p className="text-emerald-700 dark:text-emerald-300 font-bold">{visit.diagnosis}</p>
                      </div>
                    )}
                  </div>

                  {visit.treatment_advice && (
                    <div className="text-xs">
                      <span className="text-slate-400 font-semibold block text-[10px] uppercase">Treatment &amp; Advice</span>
                      <p className="text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        {visit.treatment_advice}
                      </p>
                    </div>
                  )}

                  {visit.prescription_notes && (
                    <div className="text-xs">
                      <span className="text-slate-400 font-semibold block text-[10px] uppercase">Prescription Notes</span>
                      <p className="text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 font-mono">
                        {visit.prescription_notes}
                      </p>
                    </div>
                  )}

                  {visit.additional_remarks && (
                    <div className="text-xs">
                      <span className="text-slate-400 font-semibold block text-[10px] uppercase">Doctor Remarks</span>
                      <p className="text-slate-600 dark:text-slate-400 italic">
                        "{visit.additional_remarks}"
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                No previous consultation history found for this patient.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
