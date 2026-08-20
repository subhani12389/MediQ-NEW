import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  Search, 
  MapPin, 
  Clock, 
  Stethoscope, 
  Star, 
  Building2, 
  ChevronRight, 
  Users, 
  SlidersHorizontal,
  Phone
} from 'lucide-react';

export default function HospitalSearch() {
  const { t } = useLanguage();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const cities = ['All', 'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad'];
  const specialties = ['All', 'Cardiology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Neurology', 'Dermatology'];

  useEffect(() => {
    fetchHospitals();
  }, [selectedCity, selectedSpecialty]);

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      let url = '/api/hospitals?';
      if (selectedCity !== 'All') url += `city=${encodeURIComponent(selectedCity)}&`;
      if (selectedSpecialty !== 'All') url += `specialty=${encodeURIComponent(selectedSpecialty)}&`;
      
      const res = await fetch(url);
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

  const filteredHospitals = hospitals.filter(h => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      h.name.toLowerCase().includes(q) ||
      h.location.toLowerCase().includes(q) ||
      h.city.toLowerCase().includes(q) ||
      h.specialties.some(s => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="space-y-3">
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Find Hospitals & Book <span className="text-[#C81E3A]">OPD Token</span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Search partner hospitals by city or specialty. Generate a digital queue token instantly without stepping out of your house.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg space-y-4">
        
        {/* Search Input Box */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by hospital name, locality, or doctor specialty..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C81E3A] transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-700">
          
          {/* City Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
              <MapPin className="w-3.5 h-3.5" /> City:
            </span>
            {cities.map(city => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCity === city
                    ? 'brand-gradient text-white shadow-md shadow-red-900/20'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Specialty Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
              <Stethoscope className="w-3.5 h-3.5" /> Specialty:
            </span>
            {specialties.map(spec => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedSpecialty === spec
                    ? 'teal-gradient text-white shadow-md shadow-teal-900/20'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Hospital List Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredHospitals.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 space-y-3">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-heading font-bold text-lg text-slate-700 dark:text-slate-200">No Hospitals Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or reset city/specialty filters.
          </p>
          <button
            onClick={() => { setSelectedCity('All'); setSelectedSpecialty('All'); setSearchQuery(''); }}
            className="px-4 py-2 rounded-xl brand-gradient text-white text-xs font-semibold shadow-md"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredHospitals.map(hospital => (
            <div
              key={hospital.id}
              className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              
              {/* Top Banner Image & Rating */}
              <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-900">
                <img
                  src={hospital.image}
                  alt={hospital.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 dark:text-white shadow-md flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{hospital.rating || 4.8}</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C81E3A]" />
                  <span>{hospital.location}, {hospital.city}</span>
                </div>
              </div>

              {/* Hospital Information Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-extrabold text-xl text-slate-900 dark:text-white group-hover:text-[#C81E3A] transition-colors">
                    {hospital.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {hospital.address}
                  </p>
                </div>

                {/* Specialties Pill Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {hospital.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-[11px] font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Metrics Footer */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>Avg Wait: ~{hospital.avg_consultation_minutes} min/patient</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Phone className="w-4 h-4 text-teal-500" />
                    <span>{hospital.phone || 'Emergency Ready'}</span>
                  </div>
                </div>

                {/* Select & Generate Token Button */}
                <Link
                  to={`/hospitals/${hospital.id}`}
                  className="mt-2 w-full py-3 rounded-2xl brand-gradient text-white font-semibold text-sm shadow-md shadow-red-900/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-2 group-hover:translate-x-0.5"
                >
                  <span>View Departments & Book Token</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
