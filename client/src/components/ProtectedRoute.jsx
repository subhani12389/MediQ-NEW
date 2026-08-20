import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Lock, UserCheck, ArrowRight, Activity } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, demoLogin } = useAuth();
  const location = useLocation();

  // 1. Unauthenticated Check -> Redirect to Login
  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // 2. Role Authorization Check
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const targetRole = allowedRoles[0];

    return (
      <div className="max-w-xl mx-auto my-16 px-4">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-3 py-1 rounded-full border border-amber-200">
              Access Restricted
            </span>
            <h2 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
              {targetRole === 'receptionist' ? 'Hospital Receptionist Portal' : targetRole === 'admin' ? 'Admin Control Panel' : 'Patient Portal Required'}
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Your current account ({user.full_name} — <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">{user.role}</span>) does not have authorization for this section.
            </p>
          </div>

          {/* Quick Switch Demo Button */}
          <div className="pt-2 space-y-3">
            <button
              onClick={() => demoLogin(targetRole)}
              className="w-full py-3.5 rounded-2xl brand-gradient text-white font-semibold text-sm shadow-lg shadow-red-900/20 hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Switch to Demo {targetRole.toUpperCase()} Account</span>
            </button>

            <Link
              to="/login"
              className="block w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Log in with Different Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
