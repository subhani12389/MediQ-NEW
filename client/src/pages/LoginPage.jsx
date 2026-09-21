import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Activity, User, Shield, Stethoscope, UserCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('patient'); // patient, receptionist, doctor, admin
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, loginWithDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || (
    activeTab === 'receptionist' ? '/receptionist' :
    activeTab === 'doctor' ? '/doctor' :
    activeTab === 'admin' ? '/admin' : '/dashboard'
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password, activeTab);
    setLoading(false);
    if (res.success) {
      navigate(from, { replace: true });
    }
  };

  const handleDemoClick = (roleKey) => {
    loginWithDemo(roleKey);
    const target = roleKey === 'receptionist' ? '/receptionist' :
                   roleKey === 'doctor' ? '/doctor' :
                   roleKey === 'admin' ? '/admin' : '/dashboard';
    navigate(target, { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 flex flex-col justify-center items-center relative overflow-hidden">
      <div className="w-full max-w-md space-y-8 relative z-10">

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-primary-600/20">
            <Activity className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h1 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
            Sign In to Medi<span className="text-primary-600">Q</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-Time Smart Hospital Queue & OPD Platform
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="grid grid-cols-4 gap-1 bg-slate-200 dark:bg-slate-800 p-1.5 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('patient')}
            className={`py-2 rounded-xl transition-all flex flex-col items-center gap-1 ${activeTab === 'patient' ? 'bg-white dark:bg-slate-900 text-primary-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
          >
            <User className="w-4 h-4" /> Patient
          </button>
          <button
            onClick={() => setActiveTab('receptionist')}
            className={`py-2 rounded-xl transition-all flex flex-col items-center gap-1 ${activeTab === 'receptionist' ? 'bg-white dark:bg-slate-900 text-primary-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
          >
            <UserCheck className="w-4 h-4" /> Reception
          </button>
          <button
            onClick={() => setActiveTab('doctor')}
            className={`py-2 rounded-xl transition-all flex flex-col items-center gap-1 ${activeTab === 'doctor' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
          >
            <Stethoscope className="w-4 h-4" /> Doctor
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`py-2 rounded-xl transition-all flex flex-col items-center gap-1 ${activeTab === 'admin' ? 'bg-white dark:bg-slate-900 text-amber-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
          >
            <Shield className="w-4 h-4" /> Admin
          </button>
        </div>

        {/* Login Form Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">

          {/* 1-Click Quick Demo Login Box */}
          <div className="bg-primary-50/60 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800/60 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary-700 dark:text-primary-300">
              <Sparkles className="w-4 h-4 text-primary-600" />
              1-Click Demo Login ({activeTab.toUpperCase()})
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Instantly log in to test the full-stack real-time queue platform without typing credentials.
            </p>
            <button
              type="button"
              onClick={() => handleDemoClick(activeTab)}
              className="w-full py-2.5 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md shadow-primary-600/20 transition-all flex items-center justify-center gap-1.5"
            >
              Sign In as Demo {activeTab.toUpperCase()} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative flex items-center justify-center text-xs">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-semibold uppercase text-[10px]">Or Credentials</span>
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={`${activeTab}@mediq.com`}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 font-bold text-xs transition-all"
            >
              Sign In
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
