import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Play, CheckCircle2, UserX, Clock, AlertTriangle, Coffee, ShieldAlert, Sparkles, FileText, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useQueue } from '../context/QueueContext';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const { hospitalQueue, queueStats, doctorStatus, updateDoctorStatus, startConsultation, completeToken, skipToken } = useQueue();
  const [loadingAction, setLoadingAction] = useState(false);

  const activeInConsultation = hospitalQueue.find(t => t.status === 'in_consultation');
  const activeCalled = hospitalQueue.find(t => t.status === 'called');
  const waitingPatients = hospitalQueue.filter(t => t.status === 'waiting');

  const handleStatusToggle = async (newStatus) => {
    await updateDoctorStatus(user.doctor_id || 'doc-1', newStatus);
  };

  const handleStartConsultation = async (tokenId) => {
    setLoadingAction(true);
    await startConsultation(tokenId);
    setLoadingAction(false);
  };

  const handleCompleteConsultation = async (tokenId) => {
    setLoadingAction(true);
    await completeToken(tokenId);
    setLoadingAction(false);
  };

  const handleSkip = async (tokenId) => {
    setLoadingAction(true);
    await skipToken(tokenId);
    setLoadingAction(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Doctor Header & Availability Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-2xl">
              <Stethoscope className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                  {user?.full_name || 'Dr. Rajesh Sharma'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Cardiology OPD-102
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                City Care Super Specialty Hospital • Real-Time Consultation Desk
              </p>
            </div>
          </div>

          {/* Availability Status Selector */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl text-xs font-semibold">
            <span className="text-slate-500 dark:text-slate-400 px-2">OPD Status:</span>
            <button
              onClick={() => handleStatusToggle('AVAILABLE')}
              className={`px-3 py-1.5 rounded-lg transition-all ${doctorStatus === 'AVAILABLE' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
              Available
            </button>
            <button
              onClick={() => handleStatusToggle('ON_BREAK')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${doctorStatus === 'ON_BREAK' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
              <Coffee className="w-3.5 h-3.5" /> On Break
            </button>
            <button
              onClick={() => handleStatusToggle('UNAVAILABLE')}
              className={`px-3 py-1.5 rounded-lg transition-all ${doctorStatus === 'UNAVAILABLE' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
              Unavailable
            </button>
          </div>
        </div>

        {/* Current Consultation Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Active Patient Consultation Card */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" /> Active Consultation
              </h2>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Room OPD-102
              </span>
            </div>

            {activeInConsultation ? (
              <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Currently In Consultation
                    </span>
                    <div className="text-4xl font-extrabold font-heading text-slate-900 dark:text-white mt-1">
                      Token #{activeInConsultation.token_number}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                      {activeInConsultation.patient_name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Phone: {activeInConsultation.patient_phone} • Type: <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">{activeInConsultation.patient_type}</span>
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white animate-pulse">
                      IN CONSULTATION
                    </span>
                    {activeInConsultation.priority !== 'NORMAL' && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                        {activeInConsultation.priority} PRIORITY
                      </span>
                    )}
                  </div>
                </div>

                {activeInConsultation.notes && (
                  <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-3 border border-emerald-100 dark:border-emerald-900/40 text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-white">Chief Complaint / Notes:</span> {activeInConsultation.notes}
                  </div>
                )}

                {/* Consultation Control Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <Link
                    to={`/patient-file/${activeInConsultation.patient_id || 'user-1'}?tokenId=${activeInConsultation.id}`}
                    className="w-full sm:w-auto py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-primary-600/20 transition-all"
                  >
                    <FileText className="w-5 h-5" /> Open Patient File &amp; Remarks
                  </Link>

                  <button
                    onClick={() => handleCompleteConsultation(activeInConsultation.id)}
                    disabled={loadingAction}
                    className="w-full sm:w-auto py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <CheckCircle2 className="w-5 h-5" /> Complete
                  </button>

                  <button
                    onClick={() => handleSkip(activeInConsultation.id)}
                    disabled={loadingAction}
                    className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all"
                  >
                    Mark No-Show
                  </button>
                </div>
              </div>
            ) : activeCalled ? (
              <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Patient Called to OPD Door
                    </span>
                    <div className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white mt-1">
                      Token #{activeCalled.token_number}
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                      {activeCalled.patient_name}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleStartConsultation(activeCalled.id)}
                    disabled={loadingAction}
                    className="py-3 px-6 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-primary-600/20 transition-all"
                  >
                    <Play className="w-5 h-5" /> Start Consultation
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-700 dark:text-slate-300">No Patient In Consultation</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  When a patient is called or enters OPD-102, click "Start Consultation" to begin tracking duration.
                </p>
              </div>
            )}
          </div>

          {/* Quick Doctor Stats Widget */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
              OPD Summary
            </h2>

            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Avg Consultation</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {queueStats.avgConsultationMinutes || 12} mins
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Completed Today</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {queueStats.completedTokens || 0} Patients
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserX className="w-5 h-5 text-amber-500" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Waiting Queue</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {waitingPatients.length} Patients
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Waiting OPD Queue List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white">
              Upcoming OPD Queue ({waitingPatients.length})
            </h2>
            <span className="text-xs text-slate-500">Sorted by Priority & Time</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {waitingPatients.length > 0 ? (
              waitingPatients.map((token, idx) => (
                <div key={token.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-300">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          Token #{token.token_number}
                        </span>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {token.patient_name}
                        </span>
                        {token.priority === 'EMERGENCY' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white animate-pulse">
                            EMERGENCY
                          </span>
                        )}
                        {token.priority === 'PRIORITY' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white">
                            PRIORITY
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Chief Complaint: {token.notes || 'General OPD Consultation'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/patient-file/${token.patient_id || 'user-1'}?tokenId=${token.id}`}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5 text-primary-500" /> File &amp; Remarks
                    </Link>

                    <button
                      onClick={() => handleStartConsultation(token.id)}
                      className="px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs transition-colors flex items-center gap-1"
                    >
                      <Play className="w-3.5 h-3.5" /> Call In
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-xs text-slate-500">No waiting patients in queue.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
