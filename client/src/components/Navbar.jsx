import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useQueue } from '../context/QueueContext';
import { 
  Activity, 
  Search, 
  Ticket, 
  History, 
  Sun, 
  Moon, 
  Globe, 
  ChevronDown,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { lang, changeLanguage, t } = useLanguage();
  const { activeToken } = useQueue();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center text-white shadow-md shadow-red-900/20 group-hover:scale-105 transition-transform duration-200">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                Medi<span className="text-[#C81E3A]">Q</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider text-teal-600 dark:text-teal-400 ml-2 px-1.5 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800">
                Smart Queue
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Clean & Patient-Centered) */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/hospitals"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/hospitals')
                  ? 'bg-slate-100 dark:bg-slate-800 text-[#C81E3A] font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <Search className="w-4 h-4 text-teal-600" />
              {t('searchHospitals')}
            </Link>

            <Link
              to="/dashboard"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 relative ${
                isActive('/dashboard')
                  ? 'bg-slate-100 dark:bg-slate-800 text-[#C81E3A] font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <Ticket className="w-4 h-4 text-[#C81E3A]" />
              {t('myToken')}
              {activeToken && activeToken.status === 'waiting' && (
                <span className="w-2 h-2 rounded-full bg-[#C81E3A] animate-ping"></span>
              )}
            </Link>

            <Link
              to="/history"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/history')
                  ? 'bg-slate-100 dark:bg-slate-800 text-[#C81E3A] font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <History className="w-4 h-4 text-slate-500" />
              {t('history')}
            </Link>
          </div>

          {/* Right Controls & Auth State */}
          <div className="flex items-center gap-2">
            
            {/* User Profile Controls */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => { setUserDropdownOpen(!userDropdownOpen); setLangDropdownOpen(false); }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-2 hover:border-slate-300 shadow-sm"
                >
                  <div className="w-6 h-6 rounded-full brand-gradient text-white flex items-center justify-center text-[10px] font-bold">
                    {user.full_name?.charAt(0) || 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{user.full_name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 text-xs animate-in fade-in">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                      <div className="font-bold text-slate-900 dark:text-white truncate">{user.full_name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 font-semibold flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:border-slate-300 shadow-sm flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#C81E3A]" />
                  <span>Sign In</span>
                </Link>

                <Link
                  to="/signup"
                  className="hidden sm:flex px-3.5 py-1.5 rounded-xl brand-gradient text-white text-xs font-semibold shadow-md items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setLangDropdownOpen(!langDropdownOpen); setUserDropdownOpen(false); }}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm flex items-center gap-1"
                title="Change Language"
              >
                <Globe className="w-4 h-4 text-teal-600" />
                <span className="text-xs uppercase font-bold">{lang}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-50 text-xs">
                  <button
                    onClick={() => { changeLanguage('en'); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 ${lang === 'en' ? 'font-bold text-[#C81E3A]' : ''}`}
                  >
                    English (EN)
                  </button>
                  <button
                    onClick={() => { changeLanguage('hi'); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 ${lang === 'hi' ? 'font-bold text-[#C81E3A]' : ''}`}
                  >
                    हिन्दी (HI)
                  </button>
                  <button
                    onClick={() => { changeLanguage('te'); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 ${lang === 'te' ? 'font-bold text-[#C81E3A]' : ''}`}
                  >
                    తెలుగు (TE)
                  </button>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/hospitals"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Search className="w-5 h-5 text-teal-600" />
            {t('searchHospitals')}
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Ticket className="w-5 h-5 text-[#C81E3A]" />
            {t('myToken')}
          </Link>
          <Link
            to="/history"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <History className="w-5 h-5 text-slate-500" />
            {t('history')}
          </Link>
        </div>
      )}
    </nav>
  );
}
