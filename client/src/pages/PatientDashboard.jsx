import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock, Navigation, XCircle, QrCode, AlertTriangle, CheckCircle2,
  Bell, MapPin, Building, Activity, Info, PhoneCall
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useQueue } from '../context/QueueContext';
import QRCodeModal from '../components/QRCodeModal';
import NotificationBanner from '../components/NotificationBanner';

export default function PatientDashboard() {
  const { user } = useAuth();
  const { activeToken, updatePatientIntent, cancelToken, isDeptPaused, pauseReason, doctorStatus } = useQueue();
  const [showQRModal, setShowQRModal] = useState(false);
  const [intentLoading, setIntentLoading] = useState(false);

  if (!activeToken) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-600 flex items-center justify-center mx-auto">
            <Activity className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">No Active Token</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            You don't have an active hospital token generated for today. Select a hospital to get your OPD token from home.
          </p>
          <Link
            to="/hospitals"
            className="inline-flex items-center justify-center w-full py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-md shadow-primary-600/20 transition-all"
          >
            Find Hospital & Book OPD Token
          </Link>
        </div>
      </div>
    );
  }

  const handleIntent = async (intentStatus) => {
    setIntentLoading(true);
    await updatePatientIntent(activeToken.id, intentStatus);
    setIntentLoading(false);
  };

  const handleCancelToken = async () => {
    if (window.confirm('Are you sure you want to cancel your token?')) {
      await cancelToken(activeToken.id);
    }
  };

  const isTurnApproaching = activeToken.people_ahead <= 2 && activeToken.status === 'waiting';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Smart Leave Now Notification Alert */}
        {isTurnApproaching && (
          <NotificationBanner
            title="🚗 Time to Start Heading to OPD!"
            message={`Your token #${activeToken.token_number} is only ${activeToken.people_ahead} patients away! Estimated wait: ${activeToken.estimated_wait_range}.`}
            type="warning"
          />
        )}

        {/* Queue Paused / Doctor Break Alert */}
        {isDeptPaused && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-center gap-3 text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-6 h-6 shrink-0 text-amber-500 animate-bounce" />
            <div>
              <h4 className="font-bold text-sm">OPD Queue Currently Paused</h4>
              <p className="text-xs">Reason: {pauseReason || 'Doctor on temporary consultation break'}. Your position is preserved.</p>
            </div>
          </div>
        )}

        {/* Token Card Hero */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-8 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Hospital & Department Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div>
              <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 tracking-wider uppercase">
                {activeToken.department_name} • Room {activeToken.room_no}
              </span>
              <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mt-0.5">
                {activeToken.hospital_name}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5" /> Bandra West, Mumbai • Doctor: {activeToken.doctor_name}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowQRModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors"
              >
                <QrCode className="w-4 h-4" /> QR Pass
              </button>
            </div>
          </div>

          {/* Token Counter & Position Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center">

            {/* Patients Ahead */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Patients Ahead</span>
              <div className="text-4xl font-extrabold font-heading text-slate-900 dark:text-white">
                {activeToken.people_ahead}
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">in waiting queue</span>
            </div>

            {/* Token Number Counter Ring */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-36 h-36 rounded-full bg-primary-50 dark:bg-primary-950/40 border-4 border-primary-600 flex items-center justify-center shadow-lg shadow-primary-600/10">
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-primary-600 dark:text-primary-400 tracking-wider">Your Token</span>
                  <div className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
                    #{activeToken.token_number}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                  activeToken.status === 'in_consultation' ? 'bg-emerald-600 text-white animate-pulse' :
                  activeToken.status === 'called' ? 'bg-amber-500 text-white animate-pulse' :
                  activeToken.status === 'waiting' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                  'bg-slate-200 text-slate-700'
                }`}>
                  {activeToken.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Currently Serving Token & Estimated Wait Range */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Currently Serving</span>
              <div className="text-3xl font-extrabold font-heading text-primary-600 dark:text-primary-400">
                {activeToken.current_serving_token}
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 mt-2">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Estimated Wait Range</span>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-primary-500" /> {activeToken.estimated_wait_range}
                </div>
              </div>
            </div>

          </div>

          {/* Disclaimer on Estimated Time */}
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Info className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
            <span>Estimated waiting time is calculated from recent OPD consultation durations. Please arrive 10 minutes prior to your estimated turn.</span>
          </div>

          {/* Patient Intent Actions: "I'm on my way" / "I can't come" */}
          {activeToken.status === 'waiting' && (
            <div className="bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Update OPD Attendance Intent
                </h4>
                {activeToken.intent_status === 'on_my_way' && (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Receptionist notified: On the way
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleIntent('on_my_way')}
                  disabled={intentLoading || activeToken.intent_status === 'on_my_way'}
                  className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
                    activeToken.intent_status === 'on_my_way'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                  }`}
                >
                  <Navigation className="w-4 h-4" /> I'm On My Way
                </button>

                <button
                  onClick={() => handleIntent('cant_come')}
                  disabled={intentLoading}
                  className="py-3 px-4 rounded-xl bg-red-100 hover:bg-red-200 text-red-900 dark:bg-red-950/60 dark:hover:bg-red-950/80 font-bold text-xs border border-red-300 dark:border-red-900/60 transition-all flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" /> I Can't Come
                </button>
              </div>
            </div>
          )}

          {/* Cancel Token Action */}
          {activeToken.status === 'waiting' && (
            <div className="text-center pt-2">
              <button
                onClick={handleCancelToken}
                className="text-xs text-slate-400 hover:text-red-500 underline transition-colors"
              >
                Cancel Token Registration
              </button>
            </div>
          )}
        </div>

      </div>

      {/* QR Code Entry Pass Modal */}
      {showQRModal && (
        <QRCodeModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          token={activeToken}
        />
      )}
    </div>
  );
}
