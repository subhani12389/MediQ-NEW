import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQueue } from '../context/QueueContext';
import { playChimeAlert } from '../utils/audioAlert';
import { 
  UserCheck, 
  BellRing, 
  CheckCircle2, 
  XCircle, 
  PlusCircle, 
  RotateCcw, 
  Search, 
  Filter, 
  Clock, 
  Users, 
  Hospital, 
  Stethoscope, 
  Phone, 
  User, 
  X,
  Sparkles,
  Ticket
} from 'lucide-react';

export default function ReceptionistDashboard() {
  const { user } = useAuth();
  const { hospitalQueue, queueStats, callNext, updateTokenStatus, fetchHospitalQueue } = useQueue();

  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Walk-in modal state
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInDept, setWalkInDept] = useState('dept-1');
  const [walkInNotes, setWalkInNotes] = useState('');
  const [submittingWalkIn, setSubmittingWalkIn] = useState(false);

  // Selected Patient Details Drawer
  const [activePatientDrawer, setActivePatientDrawer] = useState(null);

  const hospitalId = user?.hospital_id || 'hosp-1';

  useEffect(() => {
    fetchHospitalQueue(hospitalId, selectedDept, selectedStatus);
  }, [hospitalId, selectedDept, selectedStatus, fetchHospitalQueue]);

  // Handle Call Next Patient
  const handleCallNext = async () => {
    const res = await callNext(hospitalId, selectedDept);
    if (res.success) {
      playChimeAlert('call');
    }
  };

  // Handle Walk-in Token Submission
  const handleCreateWalkIn = async (e) => {
    e.preventDefault();
    setSubmittingWalkIn(true);
    try {
      const res = await fetch('/api/tokens/walkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_name: walkInName || 'Walk-in Patient',
          patient_phone: walkInPhone || '+91 9999900000',
          hospital_id: hospitalId,
          department_id: walkInDept,
          notes: walkInNotes
        })
      });
      if (res.ok) {
        setShowWalkInModal(false);
        setWalkInName('');
        setWalkInPhone('');
        setWalkInNotes('');
        await fetchHospitalQueue(hospitalId, selectedDept, selectedStatus);
      }
    } catch (err) {
      console.error('Failed to create walk-in token:', err);
    } finally {
      setSubmittingWalkIn(false);
    }
  };

  // Handle Reset Queue
  const handleResetQueue = async () => {
    if (window.confirm('Are you sure you want to reset today\'s queue for this hospital? All waiting tokens will be cleared.')) {
      try {
        await fetch(`/api/receptionist/${hospitalId}/reset`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ departmentId: selectedDept })
        });
        await fetchHospitalQueue(hospitalId, selectedDept, selectedStatus);
      } catch (err) {
        console.error('Reset queue error:', err);
      }
    }
  };

  // Filter queue by search query
  const filteredQueue = hospitalQueue.filter(t => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.patient_name.toLowerCase().includes(q) ||
      t.token_number.toLowerCase().includes(q) ||
      (t.patient_phone && t.patient_phone.includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Main Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
            <UserCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Hospital OPD Reception Portal</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl text-slate-900 dark:text-white flex items-center gap-2">
            <span>{user?.hospital_name || 'City Care Super Specialty Hospital'}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage live patient queues, call next tokens with instant audio chimes, mark complete, and issue walk-in tokens.
          </p>
        </div>

        {/* Primary Operational Actions */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Call Next Button */}
          <button
            onClick={handleCallNext}
            className="px-6 py-3 rounded-2xl brand-gradient text-white font-extrabold text-sm shadow-xl shadow-red-900/25 hover:scale-105 transition-all flex items-center gap-2"
          >
            <BellRing className="w-5 h-5 animate-pulse" />
            <span>CALL NEXT PATIENT</span>
          </button>

          {/* Add Walk-in Token */}
          <button
            onClick={() => setShowWalkInModal(true)}
            className="px-4 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Walk-in Token</span>
          </button>

          {/* Reset Queue */}
          <button
            onClick={handleResetQueue}
            className="px-3.5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-red-600 text-xs font-semibold transition-colors flex items-center gap-1"
            title="Reset Queue"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>

        </div>
      </div>

      {/* Daily Performance Statistics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-medium">Total Issued Today</div>
          <div className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
            {queueStats.total} Tokens
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-medium">Waiting in Line</div>
          <div className="font-heading font-extrabold text-2xl text-amber-600 dark:text-amber-400">
            {queueStats.waiting} Patients
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-medium">In Progress / Called</div>
          <div className="font-heading font-extrabold text-2xl text-[#C81E3A]">
            {queueStats.inProgress} Active
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-medium">Completed OPDs</div>
          <div className="font-heading font-extrabold text-2xl text-emerald-600 dark:text-emerald-400">
            {queueStats.completed} Patients
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1 col-span-2 md:col-span-1">
          <div className="text-xs text-slate-400 font-medium">Avg Consultation</div>
          <div className="font-heading font-extrabold text-2xl text-teal-600 dark:text-teal-400">
            ~{queueStats.avgWaitMinutes} Mins
          </div>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient name, phone, or token #"
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          <div className="flex items-center gap-1.5 text-xs">
            <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value="all">All Departments</option>
              <option value="dept-1">Cardiology (Dr. Rajesh)</option>
              <option value="dept-2">Orthopedics (Dr. Anita)</option>
              <option value="dept-3">General Medicine (Dr. Vikram)</option>
              <option value="dept-4">Neurology (Dr. Sanjay)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="waiting">Waiting Only</option>
              <option value="called">Called / In Progress</option>
              <option value="completed">Completed Only</option>
              <option value="no_show">Skipped / No-Show</option>
            </select>
          </div>

        </div>
      </div>

      {/* Live Queue Table Component */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            
            <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase font-mono tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Token #</th>
                <th className="px-6 py-4 font-semibold">Patient Info</th>
                <th className="px-6 py-4 font-semibold">Department & Doctor</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Time Created</th>
                <th className="px-6 py-4 font-semibold text-right">Quick Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredQueue.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    No active tokens match the filter. Click "CALL NEXT PATIENT" or "Add Walk-in Token".
                  </td>
                </tr>
              ) : (
                filteredQueue.map(token => (
                  <tr key={token.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors">
                    
                    {/* Token # */}
                    <td className="px-6 py-4">
                      <span className="font-heading font-black text-lg text-[#C81E3A]">
                        #{token.token_number}
                      </span>
                    </td>

                    {/* Patient Info */}
                    <td className="px-6 py-4">
                      <div
                        onClick={() => setActivePatientDrawer(token)}
                        className="cursor-pointer group"
                      >
                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{token.patient_name}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{token.patient_phone}</span>
                        </div>
                      </div>
                    </td>

                    {/* Dept */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {token.department_name || 'Cardiology'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {token.doctor_name || 'Dr. Rajesh'} ({token.room_no || 'OPD-102'})
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        token.status === 'called' || token.status === 'in_progress'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 animate-pulse'
                          : token.status === 'completed'
                          ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          : token.status === 'no_show' || token.status === 'cancelled'
                          ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                      }`}>
                        {token.status}
                      </span>
                    </td>

                    {/* Time */}
                    <td className="px-6 py-4 text-slate-500 font-mono">
                      {new Date(token.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {token.status === 'waiting' && (
                          <button
                            onClick={async () => {
                              await updateTokenStatus(token.id, 'call');
                              playChimeAlert('call');
                            }}
                            className="px-2.5 py-1.5 rounded-lg brand-gradient text-white font-bold text-[11px] hover:opacity-95 flex items-center gap-1 shadow-sm"
                            title="Call Patient"
                          >
                            <BellRing className="w-3.5 h-3.5" />
                            <span>Call</span>
                          </button>
                        )}

                        {(token.status === 'called' || token.status === 'in_progress' || token.status === 'waiting') && (
                          <button
                            onClick={() => updateTokenStatus(token.id, 'complete')}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm"
                            title="Mark Complete"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Complete</span>
                          </button>
                        )}

                        {token.status === 'waiting' && (
                          <button
                            onClick={() => updateTokenStatus(token.id, 'skip')}
                            className="px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-red-600 font-medium text-[11px]"
                            title="Mark No-Show / Skip"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Walk-in Token Modal */}
      {showWalkInModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4 text-slate-900 dark:text-white">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl teal-gradient flex items-center justify-center text-white">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-bold text-base">Add Walk-in OPD Token</h3>
              </div>
              <button onClick={() => setShowWalkInModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWalkIn} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Patient Name</label>
                <input
                  type="text"
                  required
                  value={walkInName}
                  onChange={(e) => setWalkInName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={walkInPhone}
                  onChange={(e) => setWalkInPhone(e.target.value)}
                  placeholder="+91 9800000000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Target Department</label>
                <select
                  value={walkInDept}
                  onChange={(e) => setWalkInDept(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 outline-none font-medium"
                >
                  <option value="dept-1">Cardiology (Dr. Rajesh)</option>
                  <option value="dept-2">Orthopedics (Dr. Anita)</option>
                  <option value="dept-3">General Medicine (Dr. Vikram)</option>
                  <option value="dept-4">Neurology (Dr. Sanjay)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Reception Notes</label>
                <input
                  type="text"
                  value={walkInNotes}
                  onChange={(e) => setWalkInNotes(e.target.value)}
                  placeholder="Walk-in desk issue"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submittingWalkIn}
                  className="w-full py-3 rounded-2xl teal-gradient text-white font-semibold shadow-md hover:opacity-95 transition-opacity"
                >
                  {submittingWalkIn ? 'Issuing...' : 'Issue Walk-in Token'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Patient Detail Drawer */}
      {activePatientDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl border space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-heading font-bold text-base">Patient OPD Details</h3>
              <button onClick={() => setActivePatientDrawer(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-2 text-xs">
              <div><span className="text-slate-400">Token Number:</span> <strong className="text-[#C81E3A] font-heading font-extrabold text-base">#{activePatientDrawer.token_number}</strong></div>
              <div><span className="text-slate-400">Full Name:</span> <strong>{activePatientDrawer.patient_name}</strong></div>
              <div><span className="text-slate-400">Phone:</span> {activePatientDrawer.patient_phone}</div>
              <div><span className="text-slate-400">Department:</span> {activePatientDrawer.department_name} ({activePatientDrawer.doctor_name})</div>
              <div><span className="text-slate-400">Notes:</span> {activePatientDrawer.notes || 'Routine consultation'}</div>
            </div>
            <button
              onClick={() => setActivePatientDrawer(null)}
              className="w-full py-2 bg-slate-100 dark:bg-slate-700 font-semibold text-xs rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
