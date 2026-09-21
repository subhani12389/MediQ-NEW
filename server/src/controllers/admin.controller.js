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
