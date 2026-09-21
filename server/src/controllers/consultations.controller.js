import { store } from '../data/store.js';
import { emitQueueUpdate } from '../socket/socketHandler.js';

export const getPatientFileAndHistory = async (req, res) => {
  try {
    const { patientId } = req.params;

    // RBAC check: Patients can ONLY view their own records; Receptionists CANNOT view detailed medical records
    if (req.user?.role === 'patient' && req.user?.id !== patientId) {
      return res.status(403).json({ error: 'Access Denied: You can only view your own medical file' });
    }

    if (req.user?.role === 'receptionist') {
      return res.status(403).json({ error: 'Access Denied: Receptionists are not authorized to view detailed medical records' });
    }

    const file = store.getPatientFile(patientId);
    const history = store.getConsultationsByPatient(patientId);

    return res.json({
      patient_file: file,
      consultations: history
    });
  } catch (error) {
    console.error('Get patient file error:', error);
    return res.status(500).json({ error: 'Failed to fetch patient digital file' });
  }
};

export const getConsultationById = async (req, res) => {
  try {
    const { id } = req.params;
    const consultation = store.getConsultationById(id);

    if (!consultation) return res.status(404).json({ error: 'Consultation record not found' });

    if (req.user?.role === 'patient' && req.user?.id !== consultation.patient_id) {
      return res.status(403).json({ error: 'Access Denied' });
    }

    return res.json(consultation);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch consultation details' });
  }
};

export const createConsultation = async (req, res) => {
  try {
    const consultationData = req.body;

    if (!consultationData.patient_id) {
      return res.status(400).json({ error: 'Patient ID is required' });
    }

    // Patients & Receptionists CANNOT create consultation records!
    if (req.user?.role === 'patient' || req.user?.role === 'receptionist') {
      return res.status(403).json({ error: 'Access Denied: Only doctors and authorized hospital staff can write consultation remarks' });
    }

    const consultation = store.createConsultation(consultationData, req.user);

    // Emit Socket.IO real-time update
    if (consultation.queue_token_id) {
      const token = store.getTokenById(consultation.queue_token_id);
      if (token) {
        emitQueueUpdate(token.hospital_id, token.department_id, {
          type: 'CONSULTATION_SAVED_AND_COMPLETED',
          token,
          consultation
        });
      }
    }

    return res.status(201).json({
      message: 'Consultation record and doctor remarks saved successfully',
      consultation
    });
  } catch (error) {
    console.error('Create consultation error:', error);
    return res.status(500).json({ error: 'Failed to save consultation remarks' });
  }
};

export const updateConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (req.user?.role === 'patient' || req.user?.role === 'receptionist') {
      return res.status(403).json({ error: 'Access Denied: Only doctors and authorized staff can update consultation remarks' });
    }

    const result = store.updateConsultation(id, updateData, req.user);
    if (result.error) return res.status(404).json({ error: result.error });

    return res.json({
      message: 'Consultation record updated successfully',
      consultation: result.consultation
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update consultation record' });
  }
};

export const searchPatients = async (req, res) => {
  try {
    const { query } = req.query;
    if (req.user?.role === 'patient') {
      return res.status(403).json({ error: 'Access Denied' });
    }

    const results = store.searchPatients(query);
    return res.json(results);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to search patient records' });
  }
};
