import { store } from '../data/store.js';
import { emitQueueUpdate } from '../socket/socketHandler.js';

export const getDoctorQueue = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doc = store.getDoctorById(doctorId);
    if (!doc) return res.status(404).json({ error: 'Doctor not found' });

    const queue = store.getTokensByHospital(doc.hospital_id, { departmentId: doc.department_id });
    const decoratedQueue = queue.map(t => store.getTokenById(t.id));

    return res.json({
      doctor: doc,
      queue: decoratedQueue
    });
  } catch (error) {
    console.error('Get doctor queue error:', error);
    return res.status(500).json({ error: 'Failed to fetch doctor queue' });
  }
};

export const updateDoctorAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { status } = req.body; // 'AVAILABLE', 'IN_OPD', 'ON_BREAK', 'UNAVAILABLE'

    const doc = store.updateDoctorStatus(doctorId, status, req.user);
    if (!doc) return res.status(404).json({ error: 'Doctor not found' });

    emitQueueUpdate(doc.hospital_id, doc.department_id, {
      type: 'DOCTOR_STATUS_CHANGED',
      doctor: doc
    });

    return res.json({ message: 'Doctor availability status updated', doctor: doc });
  } catch (error) {
    console.error('Update doctor availability error:', error);
    return res.status(500).json({ error: 'Failed to update doctor status' });
  }
};
