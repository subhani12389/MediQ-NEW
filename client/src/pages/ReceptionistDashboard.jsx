import React, { useState } from 'react';
import {
  Users, UserPlus, Play, CheckCircle2, UserX, PauseCircle, PlayCircle,
  Volume2, Search, QrCode, AlertTriangle, ShieldAlert, Sparkles, Phone, Clock, Navigation
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';

export default function ReceptionistDashboard() {
  const {
    hospitalQueue, queueStats, isDeptPaused, pauseReason,
    callNextPatient, startConsultation, completeToken, skipToken, cancelToken,
    createWalkInToken, togglePauseQueue, assignTokenPriority, fetchTokenStatus
  } = useQueue();

  const [selectedDept, setSelectedDept] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [showPriorityModal, setShowPriorityModal] = useState(null);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showQRScanModal, setShowQRScanModal] = useState(false);
  const [qrRefInput, setQrRefInput] = useState('');
  const [scannedTokenResult, setScannedTokenResult] = useState(null);

  // Form States
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinDept, setWalkinDept] = useState('dept-1');
  const [walkinPriority, setWalkinPriority] = useState('NORMAL');
  const [walkinNotes, setWalkinNotes] = useState('');

  const [priorityLevel, setPriorityLevel] = useState('PRIORITY');
  const [priorityReason, setPriorityReason] = useState('');
  const [pauseInputReason, setPauseInputReason] = useState('');

  const [loading, setLoading] = useState(false);

  // Filter Queue
  const filteredQueue = hospitalQueue.filter(t => {
    if (selectedDept !== 'all' && t.department_id !== selectedDept) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  const activeInConsultation = hospitalQueue.find(t => t.status === 'in_consultation');
  const activeCalled = hospitalQueue.find(t => t.status === 'called');

  const handleCallNext = async () => {
    setLoading(true);
    await callNextPatient('hosp-1', selectedDept);
    setLoading(false);
  };

  const handleCreateWalkin = async (e) => {
    e.preventDefault();
    setLoading(true);
    await createWalkInToken({
      patient_name: walkinName,
      patient_phone: walkinPhone,
      hospital_id: 'hosp-1',
      department_id: walkinDept,
      priority: walkinPriority,
      notes: walkinNotes
    });
    setShowWalkInModal(false);
    setWalkinName('');
    setWalkinPhone('');
    setWalkinNotes('');
    setLoading(false);
  };

  const handleAssignPriority = async (e) => {
    e.preventDefault();
    if (!showPriorityModal) return;
    setLoading(true);
    await assignTokenPriority(showPriorityModal.id, priorityLevel, priorityReason);
    setShowPriorityModal(null);
    setPriorityReason('');
    setLoading(false);
  };

  const handleTogglePause = async (e) => {
    e.preventDefault();
    setLoading(true);
    await togglePauseQueue('hosp-1', 'dept-1', !isDeptPaused, pauseInputReason);
    setShowPauseModal(false);
    setPauseInputReason('');
    setLoading(false);
  };

  const handleQRSearch = async (e) => {
    e.preventDefault();
    if (!qrRefInput) return;
    try {
      const res = await fetch(`/api/tokens/ref/${qrRefInput.trim()}`);
      if (res.ok) {
        const data = await res.json();
        setScannedTokenResult(data);
      } else {
        alert('Reference ID not found');
      }
    } catch (err) {
      alert('Search failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Dashboard Header Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                Reception Queue Management Desk
              </h1>
              {isDeptPaused && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white animate-pulse">
                  QUEUE PAUSED
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              City Care Super Specialty Hospital • Real-Time Unified Queue Control
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowQRScanModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <QrCode className="w-4 h-4" /> Scan QR Ref
            </button>

            <button
              onClick={() => setShowPauseModal(true)}
              className={`px-3.5 py-2 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-colors ${
                isDeptPaused
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 hover:bg-amber-200'
              }`}
            >
              {isDeptPaused ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
              {isDeptPaused ? 'Resume Queue' : 'Pause Queue'}
            </button>

            <button
              onClick={() => setShowWalkInModal(true)}
              className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md shadow-primary-600/20 transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" /> Create Walk-in Token
            </button>
          </div>
        </div>

        {/* Real-time Queue Counters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-500">Waiting</span>
            <div className="text-2xl font-extrabold font-heading text-blue-600 dark:text-blue-400">
              {hospitalQueue.filter(t => t.status === 'waiting').length}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-500">In OPD Room</span>
            <div className="text-2xl font-extrabold font-heading text-emerald-600 dark:text-emerald-400">
              {activeInConsultation ? `#${activeInConsultation.token_number}` : 'None'}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-500">Completed Today</span>
            <div className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
              {queueStats.completedTokens || hospitalQueue.filter(t => t.status === 'completed').length}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-500">Cancelled</span>
            <div className="text-2xl font-extrabold font-heading text-red-500">
              {hospitalQueue.filter(t => t.status === 'cancelled').length}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-500">No-Shows</span>
            <div className="text-2xl font-extrabold font-heading text-amber-500">
              {hospitalQueue.filter(t => t.status === 'no_show').length}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-500">Avg Wait Time</span>
            <div className="text-2xl font-extrabold font-heading text-slate-800 dark:text-slate-200">
              {queueStats.avgWaitMinutes || 14}m
            </div>
          </div>
        </div>

        {/* Primary Call Next Action Hero Banner */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-primary-600/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 text-white px-3 py-1 rounded-full">
              Live Queue Audio Dispatcher
            </span>
            <h2 className="text-2xl font-extrabold font-heading mt-2">
              Currently Serving: {activeInConsultation ? `Token #${activeInConsultation.token_number}` : activeCalled ? `Token #${activeCalled.token_number} (Called)` : 'None'}
            </h2>
            <p className="text-xs text-primary-100 mt-1 max-w-lg">
              Clicking "Call Next Patient" selects the highest priority waiting token (EMERGENCY &gt; PRIORITY &gt; NORMAL) and broadcasts audio chime &amp; socket alerts.
            </p>
          </div>

          <button
            onClick={handleCallNext}
            disabled={loading || isDeptPaused}
            className="w-full md:w-auto py-4 px-8 rounded-2xl bg-white text-primary-600 hover:bg-primary-50 font-extrabold text-base shadow-xl flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            <Volume2 className="w-5 h-5 text-primary-600" /> Call Next Patient
          </button>
        </div>

        {/* Unified Queue Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white">
              Unified Patient Queue ({filteredQueue.length})
            </h2>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="all">All Departments</option>
                <option value="dept-1">Cardiology</option>
                <option value="dept-2">Orthopedics</option>
                <option value="dept-3">General Medicine</option>
                <option value="dept-4">Neurology</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="waiting">Waiting</option>
                <option value="called">Called</option>
                <option value="in_consultation">In Consultation</option>
                <option value="completed">Completed</option>
                <option value="no_show">No Show</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Token #</th>
                  <th className="py-3 px-3">Patient Name</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-3">Intent Status</th>
                  <th className="py-3 px-3">Queue Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredQueue.length > 0 ? (
                  filteredQueue.map((token) => (
                    <tr key={token.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3 font-extrabold text-slate-900 dark:text-white font-heading text-sm">
                        #{token.token_number}
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {token.patient_name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-normal">
                          {token.patient_phone} • {token.notes || 'General OPD'}
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          token.patient_type === 'walkin'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        }`}>
                          {token.patient_type}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <button
                          onClick={() => setShowPriorityModal(token)}
                          className="flex items-center gap-1 group"
                        >
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            token.priority === 'EMERGENCY' ? 'bg-red-600 text-white animate-pulse' :
                            token.priority === 'PRIORITY' ? 'bg-amber-500 text-white' :
                            'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                            {token.priority}
                          </span>
                        </button>
                      </td>

                      <td className="py-3.5 px-3">
                        {token.intent_status === 'on_my_way' ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                            <Navigation className="w-3.5 h-3.5" /> On the way
                          </span>
                        ) : token.intent_status === 'cant_come' ? (
                          <span className="text-red-500 font-semibold text-[11px]">Can't come</span>
                        ) : token.intent_status === 'arrived' ? (
                          <span className="text-slate-600 dark:text-slate-400 font-medium text-[11px]">Arrived</span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Not specified</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          token.status === 'in_consultation' ? 'bg-emerald-600 text-white animate-pulse' :
                          token.status === 'called' ? 'bg-amber-500 text-white animate-pulse' :
                          token.status === 'waiting' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                          token.status === 'completed' ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300' :
                          'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                        }`}>
                          {token.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {token.status === 'waiting' && (
                            <button
                              onClick={() => startConsultation(token.id)}
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 transition-colors"
                              title="Start Consultation"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          )}
                          {(token.status === 'called' || token.status === 'in_consultation') && (
                            <button
                              onClick={() => completeToken(token.id)}
                              className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                              title="Complete"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          {token.status !== 'completed' && token.status !== 'cancelled' && (
                            <button
                              onClick={() => skipToken(token.id)}
                              className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 transition-colors"
                              title="Skip / No Show"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No tokens found matching selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modal: Create Walk-In Token */}
      {showWalkInModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
              Create Walk-in OPD Token
            </h3>

            <form onSubmit={handleCreateWalkin} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={walkinPhone}
                  onChange={(e) => setWalkinPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Department</label>
                <select
                  value={walkinDept}
                  onChange={(e) => setWalkinDept(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="dept-1">Cardiology (Dr. Rajesh Sharma)</option>
                  <option value="dept-2">Orthopedics (Dr. Anita Desai)</option>
                  <option value="dept-3">General Medicine (Dr. Vikram Patel)</option>
                  <option value="dept-4">Neurology (Dr. Sanjay Verma)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                <select
                  value={walkinPriority}
                  onChange={(e) => setWalkinPriority(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="NORMAL">NORMAL</option>
                  <option value="PRIORITY">PRIORITY</option>
                  <option value="EMERGENCY">EMERGENCY</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Notes / Complaint</label>
                <input
                  type="text"
                  value={walkinNotes}
                  onChange={(e) => setWalkinNotes(e.target.value)}
                  placeholder="e.g. Chest pain complaint"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWalkInModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold"
                >
                  Generate Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Assign Priority */}
      {showPriorityModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
              Assign Token Priority
            </h3>
            <p className="text-xs text-slate-500">
              Assigning high priority automatically shifts Token #{showPriorityModal.token_number} ahead in the OPD queue.
            </p>

            <form onSubmit={handleAssignPriority} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Priority Classification</label>
                <select
                  value={priorityLevel}
                  onChange={(e) => setPriorityLevel(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="NORMAL">NORMAL</option>
                  <option value="PRIORITY">PRIORITY</option>
                  <option value="EMERGENCY">EMERGENCY (Top Priority)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Reason / Clinical Note</label>
                <input
                  type="text"
                  required
                  value={priorityReason}
                  onChange={(e) => setPriorityReason(e.target.value)}
                  placeholder="e.g. Acute hypertension or elderly patient"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPriorityModal(null)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold"
                >
                  Confirm Priority
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Pause / Resume Queue */}
      {showPauseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
              {isDeptPaused ? 'Resume OPD Queue' : 'Pause OPD Queue'}
            </h3>

            <form onSubmit={handleTogglePause} className="space-y-4 text-xs font-semibold">
              {!isDeptPaused && (
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Pause Reason</label>
                  <input
                    type="text"
                    value={pauseInputReason}
                    onChange={(e) => setPauseInputReason(e.target.value)}
                    placeholder="e.g. Doctor emergency rounds / lunch break"
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPauseModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-3 rounded-xl font-bold text-white ${isDeptPaused ? 'bg-emerald-600' : 'bg-amber-600'}`}
                >
                  {isDeptPaused ? 'Resume' : 'Pause'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Scan / Enter QR Reference */}
      {showQRScanModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
              <QrCode className="w-6 h-6 text-primary-600" /> Scan or Enter QR Reference
            </h3>

            <form onSubmit={handleQRSearch} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">QR Reference ID / Token Number</label>
                <input
                  type="text"
                  required
                  value={qrRefInput}
                  onChange={(e) => setQrRefInput(e.target.value)}
                  placeholder="e.g. REF-MEDIQ-103-CARD or 103"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-primary-600 text-white font-bold"
              >
                Lookup Patient Token
              </button>
            </form>

            {scannedTokenResult && (
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 space-y-2 border border-slate-200 dark:border-slate-700 text-xs">
                <div className="font-extrabold text-base text-slate-900 dark:text-white">
                  Token #{scannedTokenResult.token_number}
                </div>
                <div>Patient: <span className="font-bold">{scannedTokenResult.patient_name}</span></div>
                <div>Status: <span className="font-bold uppercase text-primary-600">{scannedTokenResult.status}</span></div>
                <div>Department: {scannedTokenResult.department_name}</div>
              </div>
            )}

            <button
              onClick={() => { setShowQRScanModal(false); setScannedTokenResult(null); }}
              className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
