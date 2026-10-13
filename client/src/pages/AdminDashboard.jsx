import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, Activity, Clock, FileText, CheckCircle2, AlertTriangle, 
  TrendingUp, Filter, Plus, UserPlus, Building, Stethoscope, PauseCircle, PlayCircle, RefreshCw
} from 'lucide-react';
import { apiFetch } from '../lib/api';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [activeTab, setActiveTab] = useState('analytics');
  const [loading, setLoading] = useState(true);

  // Modal / Form States
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ full_name: '', email: '', phone: '', role: 'patient' });

  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [newDocForm, setNewDocForm] = useState({ name: '', specialty: 'Cardiology', department_id: 'dept-1' });

  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [newDeptForm, setNewDeptForm] = useState({ name: '', doctor_name: '', room_no: 'OPD-101', avg_time_minutes: 15 });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [resAnalytics, resAudit, resUsers, resDoctors, resDepartments] = await Promise.all([
        apiFetch('/api/admin/analytics?hospitalId=hosp-1'),
        apiFetch('/api/admin/audit-logs?limit=50'),
        apiFetch('/api/admin/users'),
        apiFetch('/api/admin/doctors'),
        apiFetch('/api/admin/departments')
      ]);

      if (resAnalytics.ok) setAnalytics(await resAnalytics.json());
      if (resAudit.ok) setAuditLogs(await resAudit.json());
      if (resUsers.ok) setUsersList(await resUsers.json());
      if (resDoctors.ok) setDoctorsList(await resDoctors.json());
      if (resDepartments.ok) setDepartmentsList(await resDepartments.json());
    } catch (err) {
      console.warn('Admin fetch fallback:', err.message);
      // Fallback data
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
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const res = await apiFetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        const updated = await res.json();
        setUsersList(prev => prev.map(u => u.id === userId ? updated : u));
      }
    } catch (e) {
      alert('Failed to update role: ' + e.message);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(newUserForm)
      });
      if (res.ok) {
        const created = await res.json();
        setUsersList(prev => [...prev, created]);
        setShowAddUserModal(false);
        setNewUserForm({ full_name: '', email: '', phone: '', role: 'patient' });
      }
    } catch (e) {
      alert('Failed to create user: ' + e.message);
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/api/admin/doctors', {
        method: 'POST',
        body: JSON.stringify(newDocForm)
      });
      if (res.ok) {
        const created = await res.json();
        setDoctorsList(prev => [...prev, created]);
        setShowAddDocModal(false);
        setNewDocForm({ name: '', specialty: 'Cardiology', department_id: 'dept-1' });
      }
    } catch (e) {
      alert('Failed to add doctor: ' + e.message);
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/api/admin/departments', {
        method: 'POST',
        body: JSON.stringify(newDeptForm)
      });
      if (res.ok) {
        const created = await res.json();
        setDepartmentsList(prev => [...prev, created]);
        setShowAddDeptModal(false);
        setNewDeptForm({ name: '', doctor_name: '', room_no: 'OPD-101', avg_time_minutes: 15 });
      }
    } catch (e) {
      alert('Failed to add department: ' + e.message);
    }
  };

  const handleToggleDeptPause = async (deptId, currentPaused) => {
    try {
      const reason = currentPaused ? '' : window.prompt('Enter reason for pausing this department queue:', 'Staff meeting / Sanitization');
      if (!currentPaused && reason === null) return;

      const res = await apiFetch(`/api/admin/departments/${deptId}/pause`, {
        method: 'PATCH',
        body: JSON.stringify({ is_paused: !currentPaused, reason: reason || null })
      });
      if (res.ok) {
        const updated = await res.json();
        setDepartmentsList(prev => prev.map(d => d.id === deptId ? updated : d));
      }
    } catch (e) {
      alert('Failed to toggle department pause state: ' + e.message);
    }
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
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'analytics' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-extrabold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold'}`}
            >
              Operational Analytics
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'users' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-extrabold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold'}`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('doctors')}
              className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'doctors' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-extrabold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold'}`}
            >
              Doctors Roster
            </button>
            <button
              onClick={() => setActiveTab('departments')}
              className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'departments' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-extrabold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold'}`}
            >
              Departments
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'audit' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-extrabold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold'}`}
            >
              Audit Trail
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

            {/* Hourly Traffic Bar Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary-600" /> Hourly Token Generation Volume
                </h2>
                <span className="text-xs font-semibold text-slate-500">Today's OPD Distribution</span>
              </div>

              <div className="h-48 flex items-end justify-between gap-4 pt-8 px-4">
                {analytics.hourlyTraffic?.map((item, idx) => {
                  const maxTokens = 50;
                  const heightPercent = Math.round((item.tokens / maxTokens) * 100);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.tokens}
                      </span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-[#C81E3A] hover:bg-red-700 rounded-t-lg transition-all"
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

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#C81E3A]" /> Registered System Users &amp; Roles
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Manage permissions across Patients, Receptionists, Doctors, and Administrators</p>
              </div>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <UserPlus className="w-4 h-4" /> Add User
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3">Name</th>
                    <th className="py-3 px-3">Email</th>
                    <th className="py-3 px-3">Phone</th>
                    <th className="py-3 px-3">Current Role</th>
                    <th className="py-3 px-3">Change Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                        {u.full_name}
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        {u.email}
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        {u.phone || 'N/A'}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'admin' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                          u.role === 'doctor' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          u.role === 'receptionist' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                          className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        >
                          <option value="patient">Patient</option>
                          <option value="receptionist">Receptionist</option>
                          <option value="doctor">Doctor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Doctors Roster Tab */}
        {activeTab === 'doctors' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-emerald-600" /> Hospital Doctors &amp; OPD Duty Roster
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Manage doctor availability, specialty assignments, and duty status</p>
              </div>
              <button
                onClick={() => setShowAddDocModal(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Doctor
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctorsList.map((doc) => (
                <div key={doc.id} className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{doc.name}</h4>
                      <span className="text-xs text-[#C81E3A] font-semibold">{doc.specialty}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      doc.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                      doc.status === 'ON_BREAK' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                      'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Dept: {departmentsList.find(d => d.id === doc.department_id)?.name || 'General OPD'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Departments Tab */}
        {activeTab === 'departments' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-600" /> Clinical Departments &amp; Queue Control
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Control active OPD rooms, queue pause states, and consultation times</p>
              </div>
              <button
                onClick={() => setShowAddDeptModal(true)}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Department
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departmentsList.map((dept) => (
                <div key={dept.id} className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{dept.name}</h4>
                      <p className="text-xs text-slate-500">Room: {dept.room_no} • {dept.doctor_name}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      dept.is_paused ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {dept.is_paused ? 'PAUSED' : 'ACTIVE'}
                    </span>
                  </div>

                  {dept.is_paused && dept.pause_reason && (
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded">
                      Reason: {dept.pause_reason}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700 text-xs">
                    <span className="text-slate-500">Avg Time: {dept.avg_time_minutes}m</span>
                    <button
                      onClick={() => handleToggleDeptPause(dept.id, dept.is_paused)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        dept.is_paused
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      {dept.is_paused ? 'Resume Queue' : 'Pause Queue'}
                    </button>
                  </div>
                </div>
              ))}
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

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Create New User</h3>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserForm.full_name}
                  onChange={e => setNewUserForm({ ...newUserForm, full_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newUserForm.email}
                  onChange={e => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Phone</label>
                <input
                  type="text"
                  value={newUserForm.phone}
                  onChange={e => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Role</label>
                <select
                  value={newUserForm.role}
                  onChange={e => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="patient">Patient</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#C81E3A] text-white font-bold"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Doctor Modal */}
      {showAddDocModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Add Doctor</h3>
            <form onSubmit={handleAddDoctor} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Doctor Name</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. ..."
                  value={newDocForm.name}
                  onChange={e => setNewDocForm({ ...newDocForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Specialty</label>
                <input
                  type="text"
                  required
                  value={newDocForm.specialty}
                  onChange={e => setNewDocForm({ ...newDocForm, specialty: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Department</label>
                <select
                  value={newDocForm.department_id}
                  onChange={e => setNewDocForm({ ...newDocForm, department_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {departmentsList.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddDocModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold"
                >
                  Add Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {showAddDeptModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Add Clinical Department</h3>
            <form onSubmit={handleAddDepartment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pediatrics"
                  value={newDeptForm.name}
                  onChange={e => setNewDeptForm({ ...newDeptForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Duty Doctor</label>
                <input
                  type="text"
                  placeholder="Dr. ..."
                  value={newDeptForm.doctor_name}
                  onChange={e => setNewDeptForm({ ...newDeptForm, doctor_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Room Number</label>
                <input
                  type="text"
                  value={newDeptForm.room_no}
                  onChange={e => setNewDeptForm({ ...newDeptForm, room_no: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Avg Time Per Patient (Mins)</label>
                <input
                  type="number"
                  value={newDeptForm.avg_time_minutes}
                  onChange={e => setNewDeptForm({ ...newDeptForm, avg_time_minutes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddDeptModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold"
                >
                  Add Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
