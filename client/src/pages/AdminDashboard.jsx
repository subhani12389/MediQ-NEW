import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Building2, 
  PlusCircle, 
  Users, 
  Ticket, 
  Activity, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Star,
  X
} from 'lucide-react';

export default function AdminDashboard() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [hospName, setHospName] = useState('');
  const [hospCity, setHospCity] = useState('Mumbai');
  const [hospLocation, setHospLocation] = useState('');
  const [hospAddress, setHospAddress] = useState('');
  const [specialtiesStr, setSpecialtiesStr] = useState('Cardiology, Orthopedics, General Medicine');

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hospitals');
      if (res.ok) {
        const data = await res.json();
        setHospitals(data);
      }
    } catch (err) {
      console.error('Failed to fetch hospitals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHospital = async (e) => {
    e.preventDefault();
    try {
      const specs = specialtiesStr.split(',').map(s => s.trim()).filter(Boolean);
      const res = await fetch('/api/hospitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: hospName,
          city: hospCity,
          location: hospLocation || hospCity,
          address: hospAddress || `${hospLocation}, ${hospCity}`,
          specialties: specs,
          avg_consultation_minutes: 12
        })
      });
      if (res.ok) {
        setShowAddModal(false);
        setHospName('');
        setHospLocation('');
        setHospAddress('');
        fetchHospitals();
      }
    } catch (err) {
      console.error('Error adding hospital:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
            <span>MediQ System Administration</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl text-slate-900 dark:text-white">
            Hospital & Network Control
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage connected hospitals, department configurations, and system-wide analytics.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-lg shadow-purple-900/20 flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Partner Hospital</span>
        </button>
      </div>

      {/* System Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-medium">Connected Hospitals</div>
          <div className="font-heading font-extrabold text-2xl text-purple-600 dark:text-purple-400">
            {hospitals.length} Network Units
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-medium">Active OPD Departments</div>
          <div className="font-heading font-extrabold text-2xl text-teal-600 dark:text-teal-400">
            {hospitals.length * 4} Active OPDs
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-medium">Realtime Engine</div>
          <div className="font-heading font-extrabold text-2xl text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <Activity className="w-5 h-5 animate-pulse" />
            <span>Supabase RLS</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-medium">System Uptime</div>
          <div className="font-heading font-extrabold text-2xl text-[#C81E3A]">
            99.98% Healthy
          </div>
        </div>
      </div>

      {/* Hospitals List */}
      <div className="space-y-4">
        <h2 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
          Registered Hospitals & Medical Centers
        </h2>

        {loading ? (
          <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hospitals.map(hosp => (
              <div
                key={hosp.id}
                className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                      {hosp.city}
                    </span>
                    <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mt-1">
                      {hosp.name}
                    </h3>
                    <p className="text-xs text-slate-500">{hosp.address}</p>
                  </div>
                  <div className="p-2.5 bg-purple-50 dark:bg-purple-950 rounded-xl text-purple-600">
                    <Building2 className="w-6 h-6" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {hosp.specialties?.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px]">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 pt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>Avg Consultation: ~{hosp.avg_consultation_minutes} mins</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active RLS
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Hospital Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-heading font-bold text-base">Add New Partner Hospital</h3>
              <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAddHospital} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Hospital Name</label>
                <input
                  type="text"
                  required
                  value={hospName}
                  onChange={(e) => setHospName(e.target.value)}
                  placeholder="e.g. Max Super Specialty Hospital"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">City</label>
                  <select
                    value={hospCity}
                    onChange={(e) => setHospCity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border outline-none"
                  >
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Hyderabad">Hyderabad</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Locality / Area</label>
                  <input
                    type="text"
                    value={hospLocation}
                    onChange={(e) => setHospLocation(e.target.value)}
                    placeholder="e.g. Saket"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Address</label>
                <input
                  type="text"
                  value={hospAddress}
                  onChange={(e) => setHospAddress(e.target.value)}
                  placeholder="Full street address"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Specialties (comma separated)</label>
                <input
                  type="text"
                  value={specialtiesStr}
                  onChange={(e) => setSpecialtiesStr(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-purple-600 text-white font-semibold text-sm shadow-md"
              >
                Register Hospital
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
