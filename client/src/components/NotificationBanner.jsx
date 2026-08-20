import React from 'react';
import { useQueue } from '../context/QueueContext';
import { Bell, Navigation, Sparkles, X } from 'lucide-react';

export default function NotificationBanner() {
  const { lastNotification, clearNotification } = useQueue();

  if (!lastNotification) return null;

  const isLeaveAlert = lastNotification.type === 'leave_now';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-5">
      <div className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3 relative text-white ${
        isLeaveAlert 
          ? 'bg-gradient-to-r from-amber-500 to-red-600 border-amber-400'
          : 'bg-gradient-to-r from-teal-600 to-emerald-700 border-teal-400'
      }`}>
        <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white shrink-0">
          {isLeaveAlert ? <Navigation className="w-6 h-6 animate-bounce" /> : <Bell className="w-6 h-6 animate-pulse" />}
        </div>
        
        <div className="flex-1 pr-6">
          <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-white/90">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lastNotification.title}</span>
          </div>
          <p className="text-xs font-medium text-white leading-relaxed mt-1">
            {lastNotification.message}
          </p>
        </div>

        <button
          onClick={clearNotification}
          className="absolute top-3 right-3 p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
