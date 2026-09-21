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
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-md shadow-primary-600/20 group-hover:scale-105 transition-transform">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-xl tracking-tight text-slate-900 dark:text-white leading-none">
              Medi<span className="text-primary-600">Q</span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase">
              Smart OPD Platform
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/hospitals" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            {t('findHospitals')}
          </Link>
          {isAuthenticated && (
            <>
              {user.role === 'patient' && (
                <>
                  <Link to="/dashboard" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {t('liveQueue')}
                  </Link>
                  <Link to="/history" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {t('myTokens')}
                  </Link>
                </>
              )}
              {user.role === 'receptionist' && (
                <Link to="/receptionist" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Reception Desk
                </Link>
              )}
              {user.role === 'doctor' && (
                <Link to="/doctor" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Stethoscope className="w-4 h-4" /> Doctor OPD Desk
                </Link>
              )}
              {user.role === 'admin' && (
                <>
                  <Link to="/receptionist" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    Reception Portal
                  </Link>
                  <Link to="/doctor" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    Doctor Portal
                  </Link>
                  <Link to="/admin" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1">
                    <Shield className="w-4 h-4 text-amber-500" /> Admin
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* Right Actions: Language, Theme & User Auth State */}
        <div className="flex items-center gap-3">
          
          {/* Language Picker */}
          <div className="relative flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 ml-1.5 mr-1" />
            <select
              value={currentLanguage}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-transparent text-slate-700 dark:text-slate-300 font-medium focus:outline-none pr-1 cursor-pointer"
            >
              <option value="en">EN</option>
              <option value="hi">HI (हिंदी)</option>
              <option value="te">TE (తెలుగు)</option>
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* User Auth Info / Buttons */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                  {user.full_name}
                </span>
                <span className="text-[10px] capitalize text-primary-600 dark:text-primary-400 font-medium">
                  {user.role}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white px-3.5 py-2 rounded-lg shadow-sm shadow-primary-600/20 transition-all"
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
