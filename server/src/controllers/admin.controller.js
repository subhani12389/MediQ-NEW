import { store } from '../data/store.js';

export const getAnalytics = async (req, res) => {
  try {
    const { hospitalId = 'hosp-1' } = req.query;
    const analytics = store.getQueueAnalytics(hospitalId);
    return res.json(analytics);
  } catch (error) {
    console.error('Get analytics error:', error);
    return res.status(500).json({ error: 'Failed to fetch operational analytics' });
  }
};

export const getAuditLogs = async (req, res) => {
  try {
    const { limit, action, userRole } = req.query;
    const logs = store.getAuditLogs({ limit: parseInt(limit) || 100, action, userRole });
    return res.json(logs);
  } catch (error) {
    console.error('Get audit logs error:', error);
    return res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
};

export const getDoctorsList = async (req, res) => {
  try {
    const doctors = store.getDoctors();
    return res.json(doctors);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch doctors list' });
  }
};

export const addDoctor = async (req, res) => {
  try {
    const { name, specialty, department_id, hospital_id = 'hosp-1' } = req.body;
    if (!name || !specialty) {
      return res.status(400).json({ error: 'Doctor name and specialty are required' });
    }
    const doctor = store.addDoctor({ name, specialty, department_id, hospital_id });
    return res.status(201).json(doctor);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add doctor' });
  }
};

export const getUsersList = async (req, res) => {
  try {
    const users = store.getAllUsers();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch users list' });
  }
};

export const createUser = async (req, res) => {
  try {
    const { email, phone, role = 'patient' } = req.body;
    const full_name = req.body.full_name || req.body.fullName;
    if (!full_name || !email) {
      return res.status(400).json({ error: 'Full name and email are required' });
    }
    const user = store.addUser({ full_name, email, phone, role });
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create user' });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!role) return res.status(400).json({ error: 'Role is required' });
    const user = store.updateUserRole(id, role);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update user role' });
  }
};

export const getDepartmentsList = async (req, res) => {
  try {
    const departments = store.getAllDepartments();
    return res.json(departments);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch departments list' });
  }
};

export const addDepartment = async (req, res) => {
  try {
    const { name, doctor_name, room_no, avg_time_minutes, hospital_id = 'hosp-1' } = req.body;
    if (!name) return res.status(400).json({ error: 'Department name is required' });
    const dept = store.addDepartment({ name, doctor_name, room_no, avg_time_minutes, hospital_id });
    return res.status(201).json(dept);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add department' });
  }
};

export const toggleDepartmentPause = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_paused, reason } = req.body;
    const dept = store.updateDepartmentPauseState(id, is_paused, reason, req.user);
    if (!dept) return res.status(404).json({ error: 'Department not found' });
    return res.json(dept);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to toggle department pause state' });
  }
};
