import { store } from '../data/store.js';
import { emitQueueUpdate } from '../socket/socketHandler.js';

export const generateToken = async (req, res) => {
  try {
    const { patient_id, patient_name, patient_phone, hospital_id, department_id, notes, priority, priority_reason } = req.body;

    if (!hospital_id || !department_id) {
      return res.status(400).json({ error: 'Hospital ID and Department ID are required' });
    }

    // Check if department queue is paused
    const dept = store.getDepartmentById(department_id);
    if (dept && dept.is_paused) {
      return res.status(400).json({
        error: `Queue is currently paused for ${dept.name}. Reason: ${dept.pause_reason || 'Staff break'}`
      });
    }

    const token = store.createToken({
      patient_id: patient_id || req.user?.id || 'user-1',
      patient_name: patient_name || req.user?.full_name || 'Rahul Sharma',
      patient_phone: patient_phone || req.user?.phone || '+91 9876543210',
      patient_type: 'online',
      hospital_id,
      department_id,
      notes,
      priority: req.user?.role === 'patient' ? 'NORMAL' : (priority || 'NORMAL'), // Patients cannot self-assign priority
      priority_reason: req.user?.role === 'patient' ? null : priority_reason,
      user: req.user
    });

    // Socket.IO real-time emission
    emitQueueUpdate(hospital_id, department_id, {
      type: 'TOKEN_CREATED',
      token
    });

    return res.status(201).json(token);
  } catch (error) {
    console.error('Generate token error:', error);
    return res.status(500).json({ error: 'Failed to generate token' });
  }
};

export const generateWalkInToken = async (req, res) => {
  try {
    const { patient_name, patient_phone, hospital_id, department_id, notes, priority, priority_reason } = req.body;

    if (!hospital_id || !department_id) {
      return res.status(400).json({ error: 'Hospital ID and Department ID are required' });
    }

    const token = store.createToken({
      patient_id: `walkin-${Date.now()}`,
      patient_name: patient_name || 'Walk-in Patient',
      patient_phone: patient_phone || 'N/A',
      patient_type: 'walkin',
      hospital_id,
      department_id,
      notes: notes ? `[Walk-in] ${notes}` : '[Walk-in Token]',
      priority: priority || 'NORMAL',
      priority_reason,
      user: req.user
    });

    // Socket.IO real-time emission
    emitQueueUpdate(hospital_id, department_id, {
      type: 'WALKIN_TOKEN_CREATED',
      token
    });

    return res.status(201).json(token);
  } catch (error) {
    console.error('Walk-in token error:', error);
    return res.status(500).json({ error: 'Failed to generate walk-in token' });
  }
};

export const getTokenById = async (req, res) => {
  try {
    const { id } = req.params;
    const token = store.getTokenById(id);
    if (!token) return res.status(404).json({ error: 'Token not found' });
    return res.json(token);
  } catch (error) {
    console.error('Get token error:', error);
    return res.status(500).json({ error: 'Failed to fetch token' });
  }
};

export const getTokenByRef = async (req, res) => {
  try {
    const { refId } = req.params;
    const token = store.getTokenByRefId(refId);
    if (!token) return res.status(404).json({ error: 'Token reference not found' });
    return res.json(token);
  } catch (error) {
    console.error('Get token by ref error:', error);
    return res.status(500).json({ error: 'Failed to lookup token reference' });
  }
};

export const getPatientTokens = async (req, res) => {
  try {
    const { patientId } = req.params;
    const tokens = store.getTokensByPatient(patientId);
    return res.json(tokens);
  } catch (error) {
    console.error('Get patient tokens error:', error);
    return res.status(500).json({ error: 'Failed to fetch patient tokens' });
  }
};

export const callNextToken = async (req, res) => {
  try {
    const { id } = req.params;
    const { hospital_id, department_id } = req.body;

    if (id === 'next' || !id) {
      const result = store.callNextPatient(hospital_id, department_id, req.user);
      if (result.error) return res.status(404).json({ message: result.error });

      emitQueueUpdate(hospital_id, department_id, {
        type: 'TOKEN_CALLED',
        token: result.token
      });

      return res.json(result.token);
    }

    const result = store.updateTokenStatus(id, 'called', req.user);
    if (result.error) return res.status(400).json({ error: result.error });

    emitQueueUpdate(result.token.hospital_id, result.token.department_id, {
      type: 'TOKEN_CALLED',
      token: result.token
    });

    return res.json(result.token);
  } catch (error) {
    console.error('Call next token error:', error);
    return res.status(500).json({ error: 'Failed to call next token' });
  }
};

export const startConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const result = store.updateTokenStatus(id, 'in_consultation', req.user);
    if (result.error) return res.status(400).json({ error: result.error });

    emitQueueUpdate(result.token.hospital_id, result.token.department_id, {
      type: 'CONSULTATION_STARTED',
      token: result.token
    });

    return res.json(result.token);
  } catch (error) {
    console.error('Start consultation error:', error);
    return res.status(500).json({ error: 'Failed to start consultation' });
  }
};

export const completeToken = async (req, res) => {
  try {
    const { id } = req.params;
    const result = store.updateTokenStatus(id, 'completed', req.user);
    if (result.error) return res.status(400).json({ error: result.error });

    emitQueueUpdate(result.token.hospital_id, result.token.department_id, {
      type: 'CONSULTATION_COMPLETED',
      token: result.token
    });

    return res.json(result.token);
  } catch (error) {
    console.error('Complete token error:', error);
    return res.status(500).json({ error: 'Failed to complete token' });
  }
};

export const skipToken = async (req, res) => {
  try {
    const { id } = req.params;
    const result = store.updateTokenStatus(id, 'no_show', req.user);
    if (result.error) return res.status(400).json({ error: result.error });

    emitQueueUpdate(result.token.hospital_id, result.token.department_id, {
      type: 'TOKEN_SKIPPED',
      token: result.token
    });

    return res.json(result.token);
  } catch (error) {
    console.error('Skip token error:', error);
    return res.status(500).json({ error: 'Failed to skip token' });
  }
};

export const cancelToken = async (req, res) => {
  try {
    const { id } = req.params;
    const result = store.updateTokenStatus(id, 'cancelled', req.user);
    if (result.error) return res.status(400).json({ error: result.error });

    emitQueueUpdate(result.token.hospital_id, result.token.department_id, {
      type: 'TOKEN_CANCELLED',
      token: result.token
    });

    return res.json(result.token);
  } catch (error) {
    console.error('Cancel token error:', error);
    return res.status(500).json({ error: 'Failed to cancel token' });
  }
};

export const updatePatientIntent = async (req, res) => {
  try {
    const { id } = req.params;
    const { intent_status } = req.body; // 'on_my_way', 'cant_come', 'arrived'

    const result = store.updatePatientIntent(id, intent_status, req.user);
    if (result.error) return res.status(400).json({ error: result.error });

    emitQueueUpdate(result.token.hospital_id, result.token.department_id, {
      type: 'PATIENT_INTENT_UPDATED',
      token: result.token
    });

    return res.json(result.token);
  } catch (error) {
    console.error('Update patient intent error:', error);
    return res.status(500).json({ error: 'Failed to update patient intent' });
  }
};

export const assignTokenPriority = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority, reason } = req.body; // 'NORMAL', 'PRIORITY', 'EMERGENCY'

    const result = store.assignTokenPriority(id, priority, reason, req.user);
    if (result.error) return res.status(400).json({ error: result.error });

    emitQueueUpdate(result.token.hospital_id, result.token.department_id, {
      type: 'PRIORITY_ASSIGNED',
      token: result.token
    });

    return res.json(result.token);
  } catch (error) {
    console.error('Assign priority error:', error);
    return res.status(500).json({ error: 'Failed to assign priority' });
  }
};
