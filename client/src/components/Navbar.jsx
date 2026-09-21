import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Shield, LogOut, Sun, Moon, Globe, UserCheck, Stethoscope } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#C81E3A] dark:bg-slate-900/95 backdrop-blur-md border-b border-[#A0182E] dark:border-slate-800 text-white dark:text-slate-100 shadow-md shadow-red-900/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-white text-[#C81E3A] dark:bg-primary-600 dark:text-white flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-xl tracking-tight text-white dark:text-white leading-none">
              Medi<span className="text-red-200 dark:text-primary-400">Q</span>
            </span>
            <span className="text-[10px] text-red-100 dark:text-slate-400 font-medium tracking-wider uppercase">
              Smart OPD Platform
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/hospitals"
            className="text-xs font-semibold text-white/90 hover:text-white hover:bg-white/10 dark:text-slate-300 dark:hover:text-primary-400 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
          >
            {t('findHospitals')}
          </Link>

          {isAuthenticated && (
            <>
              {user.role === 'patient' && (
                <>
                  <Link
                    to="/dashboard"
                    className="text-xs font-semibold text-white/90 hover:text-white hover:bg-white/10 dark:text-slate-300 dark:hover:text-primary-400 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {t('liveQueue')}
                  </Link>
                  <Link
                    to="/history"
                    className="text-xs font-semibold text-white/90 hover:text-white hover:bg-white/10 dark:text-slate-300 dark:hover:text-primary-400 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {t('myTokens')}
                  </Link>
                </>
              )}

              {user.role === 'receptionist' && (
                <Link
                  to="/receptionist"
                  className="text-xs font-semibold text-white/90 hover:text-white hover:bg-white/10 dark:text-slate-300 dark:hover:text-primary-400 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Reception Desk
                </Link>
              )}

              {user.role === 'doctor' && (
                <Link
                  to="/doctor"
                  className="text-xs font-bold text-white bg-white/15 hover:bg-white/20 dark:bg-emerald-950/60 dark:text-emerald-400 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Stethoscope className="w-3.5 h-3.5" /> Doctor OPD Desk
                </Link>
              )}

              {user.role === 'admin' && (
                <>
                  <Link
                    to="/receptionist"
                    className="text-xs font-semibold text-white/90 hover:text-white hover:bg-white/10 dark:text-slate-300 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Reception Portal
                  </Link>
                  <Link
                    to="/doctor"
                    className="text-xs font-semibold text-white/90 hover:text-white hover:bg-white/10 dark:text-slate-300 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Doctor Portal
                  </Link>
                  <Link
                    to="/admin"
                    className="text-xs font-bold text-amber-200 hover:text-amber-100 hover:bg-white/10 dark:text-amber-400 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Shield className="w-3.5 h-3.5" /> Admin
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* Right Actions: Language, Theme & User Auth State */}
        <div className="flex items-center gap-3">
          
          {/* Language Picker */}
          <div className="relative flex items-center bg-white/15 dark:bg-slate-800 rounded-lg p-1 text-xs border border-white/20 dark:border-slate-700">
            <Globe className="w-3.5 h-3.5 text-white/80 dark:text-slate-400 ml-1.5 mr-1" />
            <select
              value={currentLanguage}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-transparent text-white dark:text-slate-300 font-semibold focus:outline-none pr-1 cursor-pointer [&>option]:text-slate-900"
            >
              <option value="en">EN</option>
              <option value="hi">HI (हिंदी)</option>
              <option value="te">TE (తెలుగు)</option>
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-white/90 hover:bg-white/15 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-white" />}
          </button>

          {/* User Auth Info / Buttons */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3 pl-2 border-l border-white/20 dark:border-slate-800">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-white dark:text-white leading-tight">
                  {user.full_name}
                </span>
                <span className="text-[10px] capitalize text-red-100 dark:text-primary-400 font-medium">
                  {user.role}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-white/90 hover:text-white hover:bg-white/15 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-semibold text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-xs font-bold bg-white text-[#C81E3A] hover:bg-red-50 dark:bg-primary-600 dark:text-white dark:hover:bg-primary-700 px-3.5 py-2 rounded-lg shadow-sm transition-all"
              >
                Get Started
              </Link>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
}
