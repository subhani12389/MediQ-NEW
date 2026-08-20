import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQueue } from '../context/QueueContext';
import { 
  History, 
  Hospital, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Ticket,
  ChevronRight,
  Stethoscope
} from 'lucide-react';

export default function PatientHistory() {
  const { user } = useAuth();
  const { selectActiveToken } = useQueue();
  const navigate = useNavigate();

  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const patientId = user?.id || 'user-1';
      const res = await fetch(`/api/tokens/patient/${patientId}`);
      if (res.ok) {
        const data = await res.json();
        setTokens(data);
      }
    } catch (err) {
      console.error('Failed to fetch patient history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackToken = (tokenId) => {
    selectActiveToken(tokenId);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-7 h-7 text-[#C81E3A]" />
            <span>OPD Visit & Token History</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review your past digital hospital tokens, consultation dates, and status.
          </p>
        </div>

        <Link
          to="/hospitals"
          className="px-4 py-2.5 rounded-2xl brand-gradient text-white text-xs font-semibold shadow-md flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Ticket className="w-4 h-4" />
          <span>Issue New OPD Token</span>
        </Link>
      </div>

      {/* History List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : tokens.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-700 space-y-4">
          <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-heading font-bold text-lg text-slate-700 dark:text-slate-200">No Visit History Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You haven't generated any hospital OPD tokens yet.
          </p>
          <Link
            to="/hospitals"
            className="inline-block px-5 py-2.5 rounded-xl brand-gradient text-white text-xs font-semibold shadow-md"
          >
            Find Hospitals & Get Token
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {tokens.map(token => (
            <div
              key={token.id}
              className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-black text-xl text-[#C81E3A]">
                    #{token.token_number}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    token.status === 'completed'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : token.status === 'called' || token.status === 'in_progress'
                      ? 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300'
                      : token.status === 'cancelled' || token.status === 'no_show'
                      ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                  }`}>
                    {token.status}
                  </span>
                </div>

                <div className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Hospital className="w-4 h-4 text-teal-600" />
                  <span>{token.hospital_name || token.hospital?.name || 'Hospital OPD'}</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                    {token.department_name || token.department?.name || 'General OPD'} ({token.doctor_name || 'Duty Doctor'})
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(token.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleTrackToken(token.id)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-[#C81E3A] hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1 shrink-0"
              >
                <span>Track / View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
