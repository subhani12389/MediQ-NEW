import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQueue } from '../context/QueueContext';
import confetti from 'canvas-confetti';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Star, 
  Clock, 
  User, 
  Stethoscope, 
  Ticket, 
  CheckCircle2, 
  X,
  ArrowLeft,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function HospitalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { generateToken, loading: queueLoading } = useQueue();

  const [hospital, setHospital] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedDept, setSelectedDept] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [patientName, setPatientName] = useState(user?.full_name || 'Rahul Sharma');
  const [patientPhone, setPatientPhone] = useState(user?.phone || '+91 9876543210');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchHospitalDetails();
  }, [id]);

  const fetchHospitalDetails = async () => {
    setLoading(true);
    try {
      const [hospRes, deptRes] = await Promise.all([
        fetch(`/api/hospitals/${id}`),
        fetch(`/api/hospitals/${id}/departments`)
      ]);

      if (hospRes.ok) {
        const hospData = await hospRes.json();
        setHospital(hospData);
      }
      if (deptRes.ok) {
        const deptData = await deptRes.json();
        setDepartments(deptData);
      }
    } catch (err) {
      console.error('Failed to fetch hospital details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTokenModal = (dept) => {
    setSelectedDept(dept);
    setShowModal(true);
  };

  const handleGenerateToken = async (e) => {
    e.preventDefault();
    if (!selectedDept || !patientName || !patientPhone) return;

    setSubmitting(true);
    const result = await generateToken({
      patient_id: user?.id || 'user-1',
      patient_name: patientName,
      patient_phone: patientPhone,
      hospital_id: id,
      department_id: selectedDept.id,
      notes: notes || 'Routine OPD Consultation'
    });

    setSubmitting(false);

    if (result.success) {
      // Confetti effect
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      setShowModal(false);
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#C81E3A] border-t-transparent animate-spin mx-auto"></div>
        <p className="text-sm text-slate-500">Loading hospital details...</p>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white dark:bg-slate-800 rounded-3xl text-center space-y-4 border">
        <AlertCircle className="w-12 h-12 text-[#C81E3A] mx-auto" />
        <h3 className="font-heading font-bold text-lg">Hospital Not Found</h3>
        <Link to="/hospitals" className="inline-block px-4 py-2 brand-gradient text-white text-xs font-semibold rounded-xl">
          Back to Hospital Search
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back Button */}
      <Link
        to="/hospitals"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Hospital List
      </Link>

      {/* Hospital Banner Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xl">
        <div className="h-56 sm:h-72 relative bg-slate-900">
          <img
            src={hospital.image || 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc'}
            alt={hospital.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{hospital.rating || 4.8} Rating</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl">
              {hospital.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-[#C81E3A]" /> {hospital.address}</span>
              <span className="flex items-center gap-1"><Phone className="w-4 h-4 text-teal-400" /> {hospital.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Select OPD Department Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-2xl text-slate-900 dark:text-white">
              Available OPD Departments
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select a doctor's department to issue your digital queue token.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {departments.map(dept => (
            <div
              key={dept.id}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-[#C81E3A] hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-[10px] font-bold uppercase tracking-wider">
                    {dept.room_no || 'OPD Desk'}
                  </span>
                  <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                    {dept.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                    <User className="w-3.5 h-3.5 text-teal-600" />
                    <span>{dept.doctor_name}</span>
                  </div>
                </div>

                <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-xl text-[#C81E3A]">
                  <Stethoscope className="w-6 h-6" />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-3 text-xs">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Avg consultation: ~{dept.avg_time_minutes} min</span>
                </div>
                <button
                  onClick={() => handleOpenTokenModal(dept)}
                  className="px-4 py-2 rounded-xl brand-gradient text-white text-xs font-semibold shadow-sm hover:opacity-95 transition-opacity flex items-center gap-1"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  Get Token
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Token Generation Modal */}
      {showModal && selectedDept && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 relative text-slate-900 dark:text-white space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl brand-gradient flex items-center justify-center text-white">
                  <Ticket className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base">Generate OPD Token</h3>
                  <p className="text-[11px] text-slate-400">{hospital.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Department Summary Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-teal-600">Department</span>
                <div className="font-heading font-bold text-sm">{selectedDept.name}</div>
                <div className="text-xs text-slate-500">{selectedDept.doctor_name} ({selectedDept.room_no})</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400">Avg Wait</span>
                <div className="font-heading font-bold text-xs text-amber-500">~{selectedDept.avg_time_minutes} min</div>
              </div>
            </div>

            {/* Token Generation Form */}
            <form onSubmit={handleGenerateToken} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Patient Full Name
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-[#C81E3A] outline-none"
                  placeholder="Enter patient name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number (SMS Alert Target)
                </label>
                <input
                  type="tel"
                  required
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-[#C81E3A] outline-none"
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Symptoms / Complaint (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-[#C81E3A] outline-none resize-none"
                  placeholder="e.g., Routine BP check, follow-up, chest pain..."
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-2xl brand-gradient text-white font-semibold text-sm shadow-lg shadow-red-900/25 hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Ticket className="w-4 h-4" />
                      <span>Confirm & Issue Token</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
