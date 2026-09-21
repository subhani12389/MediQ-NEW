import React, { useState, useEffect } from 'react';
import { Shield, Users, Activity, Clock, FileText, CheckCircle2, AlertTriangle, TrendingUp, Filter } from 'lucide-react';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('analytics');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [resAnalytics, resAudit] = await Promise.all([
        fetch('/api/admin/analytics?hospitalId=hosp-1'),
        fetch('/api/admin/audit-logs?limit=50')
      ]);

      if (resAnalytics.ok) setAnalytics(await resAnalytics.json());
      if (resAudit.ok) setAuditLogs(await resAudit.json());
    } catch (err) {
      console.warn('Admin fetch fallback:', err.message);
      // Fallback mock
      setAnalytics({
        totalTokens: 124,
        completedTokens: 87,
        waitingTokens: 24,
        inConsultationTokens: 3,
        cancelledTokens: 6,
        noShowTokens: 4,
        avgWaitMinutes: 14,
        avgConsultationMinutes: 12,
        peakHour: '10:00 AM – 11:00 AM',
        hourlyTraffic: [
          { hour: '08:00 AM', tokens: 12 },
          { hour: '09:00 AM', tokens: 28 },
          { hour: '10:00 AM', tokens: 42 },
          { hour: '11:00 AM', tokens: 35 },
          { hour: '12:00 PM', tokens: 22 },
          { hour: '02:00 PM', tokens: 30 },
          { hour: '03:00 PM', tokens: 25 }
        ]
      });
      setAuditLogs([
        {
          id: 'audit-1',
          user_name: 'Priya Singh',
          user_role: 'receptionist',
          action: 'CREATE_WALKIN_TOKEN',
          token_number: '102',
          previous_status: null,
          new_status: 'waiting',
          details: 'Created walk-in token for Priya Nair',
          timestamp: new Date().toISOString()
        },
        {
          id: 'audit-2',
          user_name: 'Dr. Rajesh Sharma',
          user_role: 'doctor',
          action: 'START_CONSULTATION',
          token_number: '102',
          previous_status: 'called',
          new_status: 'in_consultation',
          details: 'Doctor started consultation for Token #102',
          timestamp: new Date().toISOString()
        }
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Admin Header */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Shield className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                Hospital Queue Operations & Audit Console
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                City Care Super Specialty Hospital • Admin Governance & Analytics
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'analytics' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Operational Analytics
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'audit' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Immutable Audit Logs
            </button>
          </div>
        </div>

        {/* Analytics Tab Content */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-6">

            {/* Core Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-xs font-semibold text-slate-500">Total OPD Tokens</span>
                <div className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
                  {analytics.totalTokens}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-xs font-semibold text-slate-500">Completed Rate</span>
                <div className="text-3xl font-extrabold font-heading text-emerald-600">
                  {Math.round((analytics.completedTokens / (analytics.totalTokens || 1)) * 100)}%
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-xs font-semibold text-slate-500">Avg Waiting Time</span>
                <div className="text-3xl font-extrabold font-heading text-primary-600">
                  {analytics.avgWaitMinutes} mins
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-xs font-semibold text-slate-500">Peak OPD Hours</span>
                <div className="text-lg font-bold font-heading text-slate-800 dark:text-slate-200">
                  {analytics.peakHour}
                </div>
              </div>
            </div>

            {/* SVG Visual Hourly Traffic Bar Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary-600" /> Hourly Token Generation Volume
                </h2>
                <span className="text-xs font-semibold text-slate-500">Today's OPD Distribution</span>
              </div>

              <div className="h-48 flex items-end justify-between gap-4 pt-8 px-4">
                {analytics.hourlyTraffic.map((item, idx) => {
                  const maxTokens = 50;
                  const heightPercent = Math.round((item.tokens / maxTokens) * 100);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.tokens}
                      </span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-primary-600/80 hover:bg-primary-600 rounded-t-lg transition-all"
                      />
                      <span className="text-[10px] text-slate-500 font-medium truncate w-full text-center">
                        {item.hour}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* Audit Log Tab Content */}
        {activeTab === 'audit' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" /> Immutable System Audit Trail
              </h2>
              <span className="text-xs text-slate-500">Recording All Queue State Transitions</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3">Timestamp</th>
                    <th className="py-3 px-3">Staff / User</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Action</th>
                    <th className="py-3 px-3">Token #</th>
                    <th className="py-3 px-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 text-slate-500 text-[11px]">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                        {log.user_name}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {log.user_role}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-primary-600 dark:text-primary-400">
                        {log.action}
                      </td>
                      <td className="py-3 px-3 font-extrabold text-slate-900 dark:text-white">
                        {log.token_number ? `#${log.token_number}` : '-'}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
