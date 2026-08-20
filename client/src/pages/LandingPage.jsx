import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useQueue } from '../context/QueueContext';
import { 
  Activity, 
  Search, 
  Ticket, 
  Clock, 
  Navigation, 
  Building2, 
  ShieldCheck, 
  ArrowRight,
  UserCheck,
  Smartphone,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  const { t } = useLanguage();
  const { activeToken } = useQueue();

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 lg:pt-20 pb-12">
        {/* Soft background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 dark:bg-red-500/5 blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-teal-500/10 dark:bg-teal-500/5 blur-3xl rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-[#C81E3A] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Smart Hospital OPD Queue Management</span>
              </div>

              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white leading-[1.1]">
                Skip the <span className="text-[#C81E3A]">queue</span>, <br className="hidden sm:inline" />
                not the <span className="text-teal-600 dark:text-teal-400">care</span>.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Generate a digital OPD token from home, track your queue position in real time with Supabase live sync, and arrive at the hospital right when your turn is 10 minutes away.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/hospitals"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl brand-gradient text-white font-semibold text-base shadow-xl shadow-red-900/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
                >
                  <Search className="w-5 h-5" />
                  <span>Find Hospital & Get Token</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-base shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <Ticket className="w-5 h-5 text-[#C81E3A]" />
                  <span>Track Active Token</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <div className="font-heading font-extrabold text-xl text-slate-900 dark:text-white">85%</div>
                  <div className="text-xs text-slate-500">Less OPD Wait Time</div>
                </div>
                <div>
                  <div className="font-heading font-extrabold text-xl text-[#C81E3A]">Realtime</div>
                  <div className="text-xs text-slate-500">Live Supabase Sync</div>
                </div>
                <div>
                  <div className="font-heading font-extrabold text-xl text-teal-600 dark:text-teal-400">Zero</div>
                  <div className="text-xs text-slate-500">Crowded Waiting Rooms</div>
                </div>
              </div>

            </div>

            {/* Right Hero Visual Card — Interactive Token Widget Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-6 relative overflow-hidden">
                
                {/* Decorative Pill Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Live Queue Monitor
                    </span>
                  </div>
                  <span className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full text-slate-600 dark:text-slate-300">
                    City Care Hospital
                  </span>
                </div>

                {/* Animated Token Counter Circle */}
                <div className="relative flex flex-col items-center justify-center py-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="relative w-36 h-36 rounded-full border-4 border-red-500/30 flex flex-col items-center justify-center animate-pulse-ring bg-white dark:bg-slate-800 shadow-inner">
                    <span className="text-xs text-slate-400 font-medium">Your Token</span>
                    <span className="font-heading font-black text-4xl text-[#C81E3A] tracking-wider">
                      {activeToken ? activeToken.token_number : 'A-103'}
                    </span>
                    <span className="text-[10px] text-teal-600 font-bold uppercase mt-0.5">Cardiology</span>
                  </div>
                </div>

                {/* Live Stats Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                    <div className="text-xs text-slate-400">Current Serving</div>
                    <div className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
                      {activeToken ? activeToken.current_serving_token : 'A-102'}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                    <div className="text-xs text-slate-400">People Ahead</div>
                    <div className="font-heading font-extrabold text-lg text-teal-600 dark:text-teal-400">
                      {activeToken ? activeToken.people_ahead : '1 Person'}
                    </div>
                  </div>
                </div>

                {/* Smart Leave Banner Preview */}
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center gap-3 text-xs text-amber-800 dark:text-amber-300">
                  <Navigation className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 animate-bounce" />
                  <div>
                    <span className="font-bold block">"Leave Now" Smart Alert</span>
                    <span>Est. Wait: 12 min — Time to head to hospital!</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How MediQ Works Step-by-Step */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
            How MediQ Keeps You Safe & Queue-Free
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
            Seamless 4-step digital OPD journey designed for ultimate patient comfort.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 text-[#C81E3A] flex items-center justify-center font-bold font-heading">
              01
            </div>
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              Search & Select
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Find hospitals by location or specialty (Cardiology, Orthopedics, Pediatrics, etc.) and check live queue length.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center font-bold font-heading">
              02
            </div>
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              Generate Digital Token
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Get an instant digital OPD token from home without standing in physical lines or registering at counters.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold font-heading">
              03
            </div>
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              Track Live Wait Timer
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Watch current serving tokens move forward in real time. Get smart alerts when your turn is 10–15 mins away.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold font-heading">
              04
            </div>
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              Direct Consultation
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Arrive right on time, show your QR token pass to security/reception, and walk straight into the doctor's room.
            </p>
          </div>

        </div>
      </section>

      {/* Dual Persona Showcase: Patient App vs Receptionist Portal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 lg:p-12 text-white shadow-2xl space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-800">
              Complete Hospital Ecosystem
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              Tailored for Patients & Hospital Receptionists
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              MediQ features distinct, specialized interfaces for seamless public convenience and rapid hospital queue operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            
            {/* Patient Card */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center text-white">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">Patient Experience</h3>
                  <span className="text-xs text-slate-400">Calm, reassuring & mobile-first</span>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" /> Search hospitals by city & specialty</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" /> Animated live token counter</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" /> "Leave Now" smart notifications</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" /> QR Code entry verification pass</li>
              </ul>
              <Link
                to="/hospitals"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#C81E3A] hover:underline pt-2"
              >
                Try Patient Flow <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Receptionist Card */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl teal-gradient flex items-center justify-center text-white">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">Receptionist Control</h3>
                  <span className="text-xs text-slate-400">Data-dense, operational queue dashboard</span>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> One-click "Call Next Patient" with audio chime</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Add Walk-in tokens directly at OPD desk</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Filter queue by department & status</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Daily stats: completed tokens & wait metrics</li>
              </ul>
              <Link
                to="/receptionist"
                className="inline-flex items-center gap-2 text-xs font-semibold text-teal-400 hover:underline pt-2"
              >
                Open Receptionist Portal <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
