import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Activity, Shield, LogOut, Sun, Moon, Bell, UserCheck, Stethoscope, 
  Check, Trash2, Info, Menu, X, Ticket, History, Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { socket } from '../lib/socket';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Real-Time Socket.IO Notification Listener
  useEffect(() => {
    const handleQueueEvent = (event) => {
      let title = 'Queue Update';
      let message = 'OPD queue status has updated.';
      let type = 'info';

      if (event.type === 'TOKEN_CALLED') {
        title = '🔔 Patient Called to OPD Room';
        message = `Token #${event.token?.token_number || ''} is now called for consultation.`;
        type = 'called';
      } else if (event.type === 'PRIORITY_ASSIGNED') {
        title = '⚠️ High Priority Assigned';
        message = `Token #${event.token?.token_number || ''} assigned ${event.token?.priority || 'PRIORITY'}.`;
        type = 'priority';
      } else if (event.type === 'CONSULTATION_STARTED') {
        title = '🩺 Doctor Consultation In Progress';
        message = `Doctor started consultation with Token #${event.token?.token_number || ''}.`;
      } else if (event.type === 'CONSULTATION_COMPLETED' || event.type === 'CONSULTATION_SAVED_AND_COMPLETED') {
        title = '✅ Consultation Completed';
        message = `Token #${event.token?.token_number || ''} finished OPD consultation.`;
      } else if (event.type === 'TOKEN_CREATED' || event.type === 'WALKIN_TOKEN_CREATED') {
        title = '🎫 New OPD Token Generated';
        message = `Token #${event.token?.token_number || ''} issued in OPD queue.`;
      }

      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          title,
          message,
          time: 'Just now',
          read: false,
          type
        },
        ...prev.slice(0, 19)
      ]);
    };

    socket.on('queue_updated', handleQueueEvent);
    socket.on('global_queue_event', handleQueueEvent);
    socket.on('token_status_changed', handleQueueEvent);

    return () => {
      socket.off('queue_updated', handleQueueEvent);
      socket.off('global_queue_event', handleQueueEvent);
      socket.off('token_status_changed', handleQueueEvent);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#C81E3A] dark:bg-slate-900/95 backdrop-blur-md border-b border-[#A0182E] dark:border-slate-800 text-white dark:text-slate-100 shadow-md shadow-red-900/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo - Vibrant Green Icon Box */}
        <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-2.5 group">
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

        {/* Center Nav Links (Desktop) */}
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

        {/* Right Actions: Real-Time Notifications Bell, Theme, User State & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Notifications Bell */}
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

          {/* User Auth Info / Buttons (Desktop) */}
          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-3 pl-2 border-l border-white/25 dark:border-slate-800">
              <div className="flex flex-col text-right">
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
            <div className="hidden sm:flex items-center gap-2">
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

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-white/95 hover:bg-white/15 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Menu Drawer (Screens < 768px) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#B51731] dark:bg-slate-900 border-t border-[#A0182E] dark:border-slate-800 px-4 pt-3 pb-6 space-y-3 shadow-xl transition-all">
          <div className="flex flex-col space-y-1 text-sm font-semibold">
            <Link
              to="/hospitals"
              onClick={closeMobileMenu}
              className="px-3 py-2 rounded-xl text-white/95 hover:bg-white/15 dark:hover:bg-slate-800 transition-colors"
            >
              Find Hospitals
            </Link>

            {isAuthenticated ? (
              <>
                {user.role === 'patient' && (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={closeMobileMenu}
                      className="px-3 py-2 rounded-xl text-white/95 hover:bg-white/15 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                    >
                      <Ticket className="w-4 h-4 text-amber-300" /> Live Queue Tracker
                    </Link>
                    <Link
                      to="/history"
                      onClick={closeMobileMenu}
                      className="px-3 py-2 rounded-xl text-white/95 hover:bg-white/15 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                    >
                      <History className="w-4 h-4 text-emerald-300" /> My Tokens &amp; History
                    </Link>
                  </>
                )}

                {user.role === 'receptionist' && (
                  <Link
                    to="/receptionist"
                    onClick={closeMobileMenu}
                    className="px-3 py-2 rounded-xl text-white/95 hover:bg-white/15 dark:hover:bg-slate-800 transition-colors"
                  >
                    Reception Control Desk
                  </Link>
                )}

                {user.role === 'doctor' && (
                  <Link
                    to="/doctor"
                    onClick={closeMobileMenu}
                    className="px-3 py-2 rounded-xl bg-white/20 text-white font-bold flex items-center gap-2"
                  >
                    <Stethoscope className="w-4 h-4" /> Doctor OPD Desk
                  </Link>
                )}

                {user.role === 'admin' && (
                  <>
                    <Link
                      to="/receptionist"
                      onClick={closeMobileMenu}
                      className="px-3 py-2 rounded-xl text-white/95 hover:bg-white/15 dark:hover:bg-slate-800 transition-colors"
                    >
                      Reception Portal
                    </Link>
                    <Link
                      to="/doctor"
                      onClick={closeMobileMenu}
                      className="px-3 py-2 rounded-xl text-white/95 hover:bg-white/15 dark:hover:bg-slate-800 transition-colors"
                    >
                      Doctor Portal
                    </Link>
                    <Link
                      to="/admin"
                      onClick={closeMobileMenu}
                      className="px-3 py-2 rounded-xl text-amber-300 font-bold flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" /> Admin Console
                    </Link>
                  </>
                )}

                <div className="pt-3 border-t border-white/20 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">{user.full_name}</p>
                    <p className="text-[10px] text-red-200 capitalize">{user.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-bold flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-3 border-t border-white/20 dark:border-slate-800 flex items-center gap-2">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="flex-1 py-2 text-center rounded-xl bg-white/15 text-white font-bold text-xs"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={closeMobileMenu}
                  className="flex-1 py-2 text-center rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-md"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
