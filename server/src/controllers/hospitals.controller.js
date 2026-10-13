import { store } from '../data/store.js';
import Hospital from '../models/Hospital.js';
import Department from '../models/Department.js';
import { isMongoConnected } from '../config/db.js';

export const getHospitals = async (req, res) => {
  try {
    const { city, specialty, query } = req.query;

    if (isMongoConnected()) {
      const filter = {};
      if (city) filter.city = new RegExp(`^${city}$`, 'i');
      if (specialty) filter.specialties = specialty;
      if (query) filter.name = new RegExp(query, 'i');

      const data = await Hospital.find(filter).lean();
      if (data && data.length > 0) return res.json(data);
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

    if (isMongoConnected()) {
      const hospital = await Hospital.findOne({ id }).lean();
      if (hospital) return res.json(hospital);
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

    if (isMongoConnected()) {
      const depts = await Department.find({ hospital_id: id }).lean();
      if (depts && depts.length > 0) return res.json(depts);
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

    const newHosp = store.addHospital({ name, location, city, address, specialties, avg_consultation_minutes });

    if (isMongoConnected()) {
      await Hospital.create(newHosp).catch(err => console.warn('Mongo create hospital error:', err.message));
    }

    return res.status(201).json(newHosp);
  } catch (error) {
    console.error('Create hospital error:', error);
    return res.status(500).json({ error: 'Failed to create hospital' });
  }
};
