import { store } from '../data/store.js';
import { supabase, isSupabaseConfigured } from '../config/supabaseClient.js';

export const getHospitals = async (req, res) => {
  try {
    const { city, specialty, query } = req.query;

    if (isSupabaseConfigured) {
      let supabaseQuery = supabase.from('hospitals').select('*');
      if (city) supabaseQuery = supabaseQuery.eq('city', city);
      if (specialty) supabaseQuery = supabaseQuery.contains('specialties', [specialty]);
      if (query) supabaseQuery = supabaseQuery.ilike('name', `%${query}%`);

      const { data, error } = await supabaseQuery;
      if (!error && data) return res.json(data);
    }

    const list = store.getHospitals({ city, specialty, query });
    return res.json(list);
  } catch (error) {
    console.error('Get hospitals error:', error);
    return res.status(500).json({ error: 'Failed to fetch hospitals' });
  }
};

export const getHospitalById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) return res.json(data);
    }

    const hospital = store.getHospitalById(id);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }
    return res.json(hospital);
  } catch (error) {
    console.error('Get hospital by ID error:', error);
    return res.status(500).json({ error: 'Failed to fetch hospital details' });
  }
};

export const getDepartmentsByHospitalId = async (req, res) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('hospital_id', id);
      if (!error && data) return res.json(data);
    }

    const depts = store.getDepartmentsByHospitalId(id);
    return res.json(depts);
  } catch (error) {
    console.error('Get departments error:', error);
    return res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

export const createHospital = async (req, res) => {
  try {
    const { name, location, city, address, specialties, avg_consultation_minutes } = req.body;
    if (!name || !city) {
      return res.status(400).json({ error: 'Hospital name and city are required' });
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('hospitals')
        .insert([{ name, location, city, address, specialties: specialties || [], avg_consultation_minutes: avg_consultation_minutes || 12 }])
        .select()
        .single();
      if (!error && data) return res.status(201).json(data);
    }

    const newHosp = store.addHospital({ name, location, city, address, specialties, avg_consultation_minutes });
    return res.status(201).json(newHosp);
  } catch (error) {
    console.error('Create hospital error:', error);
    return res.status(500).json({ error: 'Failed to create hospital' });
  }
};
