import { store } from '../data/store.js';
import { supabase, isSupabaseConfigured } from '../config/supabaseClient.js';

export const getHospitalQueue = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const { departmentId, status } = req.query;

    if (isSupabaseConfigured) {
      let q = supabase
        .from('tokens')
        .select('*, hospital:hospitals(name), department:departments(name, doctor_name, room_no)')
        .eq('hospital_id', hospitalId)
        .order('created_at', { ascending: true });

      if (departmentId && departmentId !== 'all') {
        q = q.eq('department_id', departmentId);
      }
      if (status && status !== 'all') {
        q = q.eq('status', status);
      }

      const { data, error } = await q;
      if (!error && data) return res.json(data);
    }

    const queue = store.getTokensByHospital(hospitalId, { departmentId, status });
    const stats = store.getQueueStats(hospitalId);

    // Decorate each token with full details
    const decoratedQueue = queue.map(t => store.getTokenById(t.id));

    return res.json({
      hospital_id: hospitalId,
      queue: decoratedQueue,
      stats
    });
  } catch (error) {
    console.error('Get hospital queue error:', error);
    return res.status(500).json({ error: 'Failed to fetch receptionist queue' });
  }
};

export const resetQueue = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const { departmentId } = req.body;

    store.resetQueue(hospitalId, departmentId);

    return res.json({ message: 'Hospital queue reset successfully' });
  } catch (error) {
    console.error('Reset queue error:', error);
    return res.status(500).json({ error: 'Failed to reset queue' });
  }
};

export const getQueueStats = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const stats = store.getQueueStats(hospitalId);
    return res.json(stats);
  } catch (error) {
    console.error('Get queue stats error:', error);
    return res.status(500).json({ error: 'Failed to fetch queue statistics' });
  }
};
