import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, CheckCircle2, Hospital, User, Calendar, ShieldCheck, Download } from 'lucide-react';

export default function QRCodeModal({ token, onClose }) {
  if (!token) return null;

  const qrData = JSON.stringify({
    token_id: token.id,
    token_number: token.token_number,
    hospital: token.hospital_name,
    patient: token.patient_name,
    created_at: token.created_at
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 relative text-slate-900 dark:text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl brand-gradient text-white mb-2 shadow-lg shadow-red-900/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-extrabold text-lg">Hospital Entry Pass</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Show this QR code at hospital OPD desk</p>
        </div>

        {/* QR Code Canvas Card */}
        <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center mb-5">
          <div className="p-3 bg-white rounded-xl shadow-inner mb-3">
            <QRCodeSVG value={qrData} size={160} level="H" includeMargin={true} />
          </div>
          <div className="text-center">
            <span className="font-heading text-2xl font-black tracking-wider text-[#C81E3A]">
              #{token.token_number}
            </span>
            <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Digital Pass</span>
            </div>
          </div>
        </div>

        {/* Ticket Details */}
        <div className="space-y-2 text-xs border-t border-slate-100 dark:border-slate-700 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 flex items-center gap-1"><Hospital className="w-3.5 h-3.5 text-teal-600" /> Hospital</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{token.hospital_name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 flex items-center gap-1"><User className="w-3.5 h-3.5 text-slate-400" /> Patient</span>
            <span className="font-medium">{token.patient_name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Date</span>
            <span className="font-mono">{new Date(token.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 rounded-xl brand-gradient text-white font-semibold text-sm shadow-md hover:opacity-95 transition-opacity"
        >
          Close Pass
        </button>

      </div>
    </div>
  );
}
