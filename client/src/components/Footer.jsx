import React from 'react';
import { Activity, ShieldCheck, Heart, Clock, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center text-white">
                <Activity className="w-5 h-5" />
              </div>
              <span className="font-heading font-extrabold text-2xl text-white">
                Medi<span className="text-[#C81E3A]">Q</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed">
              Smart Hospital Queue & Digital Token Management System. Skip hospital waiting rooms by tracking live token status from home.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Supabase Realtime & RLS Protected</span>
            </div>
          </div>

          {/* Core Features */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Patient Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-white transition-colors cursor-pointer">Find Nearby Hospitals</li>
              <li className="hover:text-white transition-colors cursor-pointer">Generate Digital OPD Token</li>
              <li className="hover:text-white transition-colors cursor-pointer">Smart "Leave Now" Alerts</li>
              <li className="hover:text-white transition-colors cursor-pointer">Live Estimated Wait Timer</li>
              <li className="hover:text-white transition-colors cursor-pointer">Digital Token History & Rebooking</li>
            </ul>
          </div>

          {/* Receptionist Portal */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Hospital Operations
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-white transition-colors cursor-pointer">Receptionist Dashboard</li>
              <li className="hover:text-white transition-colors cursor-pointer">One-Click Patient Call Next</li>
              <li className="hover:text-white transition-colors cursor-pointer">Walk-in Token Generation</li>
              <li className="hover:text-white transition-colors cursor-pointer">Live Queue Analytics</li>
              <li className="hover:text-white transition-colors cursor-pointer">Multi-Department Queue Control</li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Emergency & Support
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C81E3A]" />
                <span>24/7 Helpline: 1800-123-MEDI</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-400" />
                <span>OPD Hours: 8:00 AM – 8:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Connected across Mumbai, Delhi, Bengaluru & Hyderabad</span>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MediQ Technologies. Built with React, Express & Supabase.</p>
          <div className="flex items-center gap-1 mt-2 sm:mt-0">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#C81E3A] fill-[#C81E3A]" />
            <span>for better healthcare access</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
