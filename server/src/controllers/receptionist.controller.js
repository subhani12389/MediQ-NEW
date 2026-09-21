import { store } from '../data/store.js';
import { emitQueueUpdate } from '../socket/socketHandler.js';

export const getHospitalQueue = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const { departmentId, status } = req.query;

    const queue = store.getTokensByHospital(hospitalId, { departmentId, status });
    const stats = store.getQueueAnalytics(hospitalId);
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

export const pauseQueue = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const { department_id, is_paused, reason } = req.body;

    const dept = store.updateDepartmentPauseState(department_id, is_paused, reason, req.user);
    if (!dept) return res.status(404).json({ error: 'Department not found' });

    emitQueueUpdate(hospitalId, department_id, {
      type: 'QUEUE_PAUSE_TOGGLED',
      department: dept
    });

    return res.json({ message: `Queue ${is_paused ? 'paused' : 'resumed'}`, department: dept });
  } catch (error) {
    console.error('Pause queue error:', error);
    return res.status(500).json({ error: 'Failed to update queue pause state' });
  }
};

export const resetQueue = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const { departmentId } = req.body;

    store.resetQueue(hospitalId, departmentId, req.user);

    emitQueueUpdate(hospitalId, departmentId, {
      type: 'QUEUE_RESET'
    });

    return res.json({ message: 'Hospital queue reset successfully' });
  } catch (error) {
    console.error('Reset queue error:', error);
    return res.status(500).json({ error: 'Failed to reset queue' });
  }
};

export const getQueueStats = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const stats = store.getQueueAnalytics(hospitalId);
    return res.json(stats);
  } catch (error) {
    console.error('Get queue stats error:', error);
    return res.status(500).json({ error: 'Failed to fetch queue statistics' });
  }
};
