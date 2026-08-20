import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueue } from '../context/QueueContext';
import { useAuth } from '../context/AuthContext';
import QRCodeModal from '../components/QRCodeModal';
import { 
  Ticket, 
  Clock, 
  Users, 
  Navigation, 
  QrCode, 
  BellRing, 
  XCircle, 
  CheckCircle2, 
  AlertTriangle,
  Hospital,
  User,
  Stethoscope,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function PatientDashboard() {
  const { activeToken, updateTokenStatus, selectActiveToken } = useQueue();
  const { user } = useAuth();
  const [showQrModal, setShowQrModal] = useState(false);
  const [simulatingSms, setSimulatingSms] = useState(false);
  const [smsResult, setSmsResult] = useState(null);

  const handleCancelToken = async () => {
    if (!activeToken) return;
    if (window.confirm('Are you sure you want to cancel your digital token?')) {
      await updateTokenStatus(activeToken.id, 'cancel');
    }
  };

  const handleSimulateSmsAlert = async () => {
    if (!activeToken) return;
    setSimulatingSms(true);
    try {
      const res = await fetch('/api/notifications/send-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: activeToken.patient_phone || user?.phone,
          email: user?.email,
          token_number: activeToken.token_number,
          estimated_wait_minutes: activeToken.estimated_wait_minutes,
          message_type: 'SMS_SMART_LEAVE_ALERT'
        })
      });
      const data = await res.json();
      setSmsResult(data);
      setTimeout(() => setSmsResult(null), 5000);
    } catch (err) {
      console.error('SMS simulation failed:', err);
    } finally {
      setSimulatingSms(false);
    }
  };

  if (!activeToken) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-[#C81E3A] flex items-center justify-center mx-auto shadow-inner">
          <Ticket className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="font-heading font-extrabold text-3xl text-slate-900 dark:text-white">
            No Active OPD Token Found
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            You don't have an active hospital token right now. Select a hospital to issue a digital token from home.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/hospitals"
            className="px-6 py-3 rounded-2xl brand-gradient text-white text-sm font-semibold shadow-lg shadow-red-900/20 flex items-center gap-2"
          >
            <Hospital className="w-4 h-4" />
            <span>Search Hospitals & Issue Token</span>
          </Link>
          <button
            onClick={() => selectActiveToken('tok-103')}
            className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold shadow-sm hover:bg-slate-50"
          >
            Load Demo Token (#A-103)
          </button>
        </div>
      </div>
    );
  }

  // Calculate live badge parameters
  const isCalled = activeToken.status === 'called';
  const isCompleted = activeToken.status === 'completed';
  const isCancelled = activeToken.status === 'cancelled' || activeToken.status === 'no_show';
  const isLeaveNow = activeToken.status === 'waiting' && activeToken.people_ahead <= 2 && activeToken.people_ahead >= 1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Title & User Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-[#C81E3A] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Token Tracker</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl text-slate-900 dark:text-white">
            Hello, {activeToken.patient_name || user?.full_name || 'Patient'}
          </h1>
        </div>

        {/* Action button to load demo or view history */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQrModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4 text-[#C81E3A]" />
            <span>View QR Pass</span>
          </button>
          <Link
            to="/history"
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Token History
          </Link>
        </div>
      </div>

      {/* Smart "Leave Now" Alert Banner */}
      {isLeaveNow && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-xl flex items-start gap-4 animate-pulse">
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shrink-0">
            <Navigation className="w-7 h-7 text-white animate-bounce" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading font-extrabold text-lg flex items-center gap-2">
              <span>🚗 Smart Leave Alert: Time to Head Out!</span>
            </h3>
            <p className="text-xs text-white/90 leading-relaxed">
              Only <strong className="text-white underline">{activeToken.people_ahead} person</strong> ahead of you. Estimated wait is ~{activeToken.estimated_wait_minutes} minutes. Please start traveling to {activeToken.hospital_name} now so you arrive right on time.
            </p>
          </div>
        </div>
      )}

      {/* Called Banner */}
      {isCalled && (
        <div className="p-4 rounded-3xl bg-emerald-600 text-white shadow-xl flex items-center gap-4 animate-bounce">
          <div className="p-3 bg-white/20 rounded-2xl">
            <BellRing className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-lg">🎉 Your Token is Called!</h3>
            <p className="text-xs text-white/90">
              Please enter <strong>{activeToken.room_no || 'OPD Room 102'}</strong> to meet {activeToken.doctor_name}.
            </p>
          </div>
        </div>
      )}

      {/* Main Token Status Display Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 sm:p-8 space-y-8 relative overflow-hidden">
        
        {/* Card Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              {activeToken.department_name} OPD • Room {activeToken.room_no || 'OPD-102'}
            </span>
            <h2 className="font-heading font-extrabold text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <Hospital className="w-5 h-5 text-[#C81E3A]" />
              <span>{activeToken.hospital_name}</span>
            </h2>
            <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
              <span>Attending: {activeToken.doctor_name}</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="self-start sm:self-auto">
            <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${
              isCalled
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300'
                : isCompleted
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                : isCancelled
                ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                : isLeaveNow
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-400 animate-pulse'
                : 'bg-red-50 dark:bg-red-950/80 text-[#C81E3A] border border-red-200 dark:border-red-800'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isCalled ? 'bg-emerald-500 animate-ping' : isLeaveNow ? 'bg-amber-500 animate-ping' : 'bg-[#C81E3A]'}`}></span>
              {isCalled
                ? 'CALLED — ENTER ROOM'
                : isCompleted
                ? 'COMPLETED'
                : isCancelled
                ? 'CANCELLED'
                : isLeaveNow
                ? 'ALMOST YOUR TURN'
                : 'WAITING IN QUEUE'}
            </span>
          </div>
        </div>

        {/* Distinctive Live Token Counter Component */}
        <div className="flex flex-col items-center justify-center py-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 relative">
          
          {/* Animated Pulsing Ring Counter */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border-8 border-red-500/20 flex flex-col items-center justify-center animate-pulse-ring bg-white dark:bg-slate-800 shadow-2xl">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">
              Token Number
            </span>
            <span className="font-heading font-black text-5xl sm:text-6xl tracking-widest text-[#C81E3A] my-1">
              #{activeToken.token_number}
            </span>
            <span className="text-[11px] font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/80 px-2.5 py-0.5 rounded-full">
              OPD Pass
            </span>
          </div>

          <div className="mt-4 text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Generated at {new Date(activeToken.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

        </div>

        {/* Live Queue Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Current Serving Token */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center space-y-1">
            <div className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1">
              <Ticket className="w-3.5 h-3.5 text-teal-600" />
              <span>Current Serving</span>
            </div>
            <div className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
              #{activeToken.current_serving_token || 'None'}
            </div>
            <div className="text-[11px] text-slate-500">Live Doctor Desk</div>
          </div>

          {/* People Ahead */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center space-y-1">
            <div className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1">
              <Users className="w-3.5 h-3.5 text-amber-500" />
              <span>People Ahead</span>
            </div>
            <div className="font-heading font-extrabold text-2xl text-amber-600 dark:text-amber-400">
              {activeToken.people_ahead} {activeToken.people_ahead === 1 ? 'Person' : 'People'}
            </div>
            <div className="text-[11px] text-slate-500">Ahead in Queue</div>
          </div>

          {/* Estimated Wait Time */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center space-y-1">
            <div className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#C81E3A]" />
              <span>Est. Wait Time</span>
            </div>
            <div className="font-heading font-extrabold text-2xl text-[#C81E3A]">
              ~{activeToken.estimated_wait_minutes} Mins
            </div>
            <div className="text-[11px] text-slate-500">Based on ~{activeToken.avg_time_minutes}m/patient</div>
          </div>

        </div>

        {/* Action Buttons & SMS Simulation */}
        <div className="border-t border-slate-100 dark:border-slate-700 pt-6 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQrModal(true)}
              className="px-5 py-2.5 rounded-xl brand-gradient text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
            >
              <QrCode className="w-4 h-4" />
              <span>Show QR Entry Pass</span>
            </button>

            <button
              onClick={handleSimulateSmsAlert}
              disabled={simulatingSms}
              className="px-4 py-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-semibold hover:bg-teal-100 flex items-center gap-1.5"
            >
              <BellRing className="w-4 h-4 text-teal-600" />
              <span>{simulatingSms ? 'Sending Alert...' : 'Simulate SMS Alert'}</span>
            </button>
          </div>

          {!isCompleted && !isCancelled && (
            <button
              onClick={handleCancelToken}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-red-600 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              <span>Cancel Token</span>
            </button>
          )}

        </div>

        {/* Simulated SMS Alert Delivery Message */}
        {smsResult && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              SMS Alert dispatched to {smsResult.details?.recipient || 'patient'}: "MediQ Alert: Turn is ~{smsResult.details?.estimated_wait_minutes} mins away for Token #{smsResult.details?.token_number}"
            </span>
          </div>
        )}

      </div>

      {/* Entry Pass Modal */}
      {showQrModal && (
        <QRCodeModal token={activeToken} onClose={() => setShowQrModal(false)} />
      )}

    </div>
  );
}
