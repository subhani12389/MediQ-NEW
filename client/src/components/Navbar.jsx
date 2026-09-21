import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Shield, LogOut, Sun, Moon, Bell, UserCheck, Stethoscope, Check, Trash2, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: '🚗 Smart Leave Alert',
      message: 'Token #103 at City Care Hospital is ~15-25 mins away! Time to head to OPD.',
      time: '5 mins ago',
      read: false,
      type: 'leave_now'
    },
    {
      id: 'notif-2',
      title: '🔔 Patient Called to OPD-102',
      message: 'Token #102 is now in consultation with Dr. Rajesh Sharma.',
      time: '15 mins ago',
      read: true,
      type: 'info'
    },
    {
      id: 'notif-3',
      title: '📌 Emergency Priority',
      message: 'Acute tachycardia patient assigned EMERGENCY priority in Cardiology.',
      time: '25 mins ago',
      read: true,
      type: 'priority'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#C81E3A] dark:bg-slate-900/95 backdrop-blur-md border-b border-[#A0182E] dark:border-slate-800 text-white dark:text-slate-100 shadow-md shadow-red-900/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo - Vibrant Green Icon Box */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white dark:bg-emerald-600 dark:text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-xl tracking-tight text-white dark:text-white leading-none">
              Medi<span className="text-amber-300 dark:text-primary-400">Q</span>
            </span>
            <span className="text-[10px] text-white/90 dark:text-slate-400 font-extrabold tracking-widest uppercase">
              Smart OPD Platform
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/hospitals"
            className="text-xs font-bold text-white/95 hover:text-white hover:bg-white/15 dark:text-slate-300 dark:hover:text-primary-400 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
          >
            Find Hospitals
          </Link>

          {isAuthenticated && (
            <>
              {user.role === 'patient' && (
                <>
                  <Link
                    to="/dashboard"
                    className="text-xs font-bold text-white/95 hover:text-white hover:bg-white/15 dark:text-slate-300 dark:hover:text-primary-400 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Live Queue Tracker
                  </Link>
                  <Link
                    to="/history"
                    className="text-xs font-bold text-white/95 hover:text-white hover:bg-white/15 dark:text-slate-300 dark:hover:text-primary-400 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    My Tokens &amp; History
                  </Link>
                </>
              )}

              {user.role === 'receptionist' && (
                <Link
                  to="/receptionist"
                  className="text-xs font-bold text-white/95 hover:text-white hover:bg-white/15 dark:text-slate-300 dark:hover:text-primary-400 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Reception Control Desk
                </Link>
              )}

              {user.role === 'doctor' && (
                <Link
                  to="/doctor"
                  className="text-xs font-bold text-white bg-white/20 hover:bg-white/30 dark:bg-emerald-950/60 dark:text-emerald-400 px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Stethoscope className="w-4 h-4" /> Doctor OPD Desk
                </Link>
              )}

              {user.role === 'admin' && (
                <>
                  <Link
                    to="/receptionist"
                    className="text-xs font-bold text-white/95 hover:text-white hover:bg-white/15 dark:text-slate-300 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Reception Portal
                  </Link>
                  <Link
                    to="/doctor"
                    className="text-xs font-bold text-white/95 hover:text-white hover:bg-white/15 dark:text-slate-300 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Doctor Portal
                  </Link>
                  <Link
                    to="/admin"
                    className="text-xs font-bold text-amber-300 hover:text-amber-200 hover:bg-white/15 dark:text-amber-400 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Shield className="w-3.5 h-3.5" /> Admin
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* Right Actions: Real-Time Notifications Bell, Theme & User State */}
        <div className="flex items-center gap-3">
          
          {/* Notifications Bell (Replaces Language Selector) */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-white/95 hover:bg-white/15 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              )}
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-300 font-bold text-[9px] flex items-center justify-center text-slate-900" />
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 z-50">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-primary-600" />
                    <h4 className="font-bold text-sm font-heading">OPD Alerts &amp; Notifications</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] text-primary-600 dark:text-primary-400 font-bold hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={clearNotifications}
                      className="text-slate-400 hover:text-red-500"
                      title="Clear All"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 rounded-xl border text-xs space-y-1 transition-colors ${
                          !n.read
                            ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-[11px]">{n.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No recent notifications
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-white/95 hover:bg-white/15 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-white" />}
          </button>

          {/* User Auth Info / Buttons */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3 pl-2 border-l border-white/25 dark:border-slate-800">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-extrabold text-white dark:text-white leading-tight">
                  {user.full_name}
                </span>
                <span className="text-[10px] capitalize text-red-100 dark:text-primary-400 font-bold">
                  {user.role}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-white/95 hover:text-white hover:bg-white/15 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-bold text-white/95 hover:text-white hover:bg-white/15 px-3 py-2 rounded-xl transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-xs font-extrabold bg-emerald-500 hover:bg-emerald-600 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 px-3.5 py-2 rounded-xl shadow-md shadow-emerald-500/20 transition-all"
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
