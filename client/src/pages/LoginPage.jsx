import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, 
  Mail, 
  Lock, 
  ArrowRight, 
  UserCheck, 
  ShieldCheck, 
  User, 
  Building2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function LoginPage() {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const [roleTab, setRoleTab] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email address and password.');
      return;
    }

    setErrorMsg('');
    setSubmitting(true);

    const res = await login(email, password, roleTab);
    setSubmitting(false);

    if (res.success) {
      const target = roleTab === 'receptionist' ? '/receptionist' : roleTab === 'admin' ? '/admin' : redirectUrl;
      navigate(target);
    } else {
      setErrorMsg(res.error || 'Login failed. Please check your credentials.');
    }
  };

  const handleQuickDemo = (role) => {
    demoLogin(role);
    const target = role === 'receptionist' ? '/receptionist' : role === 'admin' ? '/admin' : '/dashboard';
    navigate(target);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      
      {/* Page Title & Brand Logo */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl brand-gradient flex items-center justify-center text-white mx-auto shadow-lg shadow-red-900/20">
          <Activity className="w-7 h-7" />
        </div>
        <h1 className="font-heading font-extrabold text-3xl text-slate-900 dark:text-white">
          Sign In to Medi<span className="text-[#C81E3A]">Q</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Access your digital OPD tokens, live hospital queue, or hospital receptionist desk.
        </p>
      </div>

      {/* 🚀 QUICK DEMO LOGIN BOX (HIGHLIGHTED FOR EVALUATION) */}
      <div className="bg-gradient-to-br from-red-50 to-teal-50 dark:from-slate-800 dark:to-slate-900 p-5 rounded-3xl border border-red-200 dark:border-slate-700 shadow-md space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C81E3A]">
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>Quick 1-Click Demo Login</span>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-400">
          Click any button below to instantly authenticate and evaluate MediQ role capabilities:
        </p>

        <div className="space-y-2 pt-1">
          <button
            onClick={() => handleQuickDemo('patient')}
            className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#C81E3A] text-slate-800 dark:text-slate-200 text-xs font-bold shadow-sm flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C81E3A]"></span>
              <span>Patient (Rahul Sharma)</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => handleQuickDemo('receptionist')}
            className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 text-slate-800 dark:text-slate-200 text-xs font-bold shadow-sm flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
              <span>Receptionist (Priya - City Care OPD)</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => handleQuickDemo('admin')}
            className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-500 text-slate-800 dark:text-slate-200 text-xs font-bold shadow-sm flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span>System Administrator</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Regular Credentials Login Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xl space-y-5">
        
        {/* Role Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setRoleTab('patient')}
            className={`py-2 rounded-xl transition-all ${roleTab === 'patient' ? 'bg-white dark:bg-slate-800 text-[#C81E3A] shadow-sm font-bold' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Patient
          </button>
          <button
            type="button"
            onClick={() => setRoleTab('receptionist')}
            className={`py-2 rounded-xl transition-all ${roleTab === 'receptionist' ? 'bg-white dark:bg-slate-800 text-teal-600 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Receptionist
          </button>
          <button
            type="button"
            onClick={() => setRoleTab('admin')}
            className={`py-2 rounded-xl transition-all ${roleTab === 'admin' ? 'bg-white dark:bg-slate-800 text-purple-600 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Admin
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-2xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={roleTab === 'receptionist' ? 'receptionist@cityhospital.com' : roleTab === 'admin' ? 'admin@mediq.com' : 'patient@mediq.com'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-[#C81E3A] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-[#C81E3A] outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-2xl brand-gradient text-white font-semibold text-sm shadow-lg shadow-red-900/25 hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? 'Authenticating...' : `Sign In as ${roleTab.toUpperCase()}`}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-700">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-[#C81E3A] hover:underline">
            Register New Patient
          </Link>
        </div>

      </div>

    </div>
  );
}
