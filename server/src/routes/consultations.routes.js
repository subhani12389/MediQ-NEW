import { Router } from 'express';
import {
  getPatientFileAndHistory,
  getConsultationById,
  createConsultation,
  updateConsultation,
  searchPatients
} from '../controllers/consultations.controller.js';
import { authenticateUser, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/patient/:patientId', authenticateUser, getPatientFileAndHistory);
router.get('/search', authenticateUser, requireRole(['doctor', 'admin']), searchPatients);
router.get('/:id', authenticateUser, getConsultationById);
router.post('/', authenticateUser, requireRole(['doctor', 'admin']), createConsultation);
router.put('/:id', authenticateUser, requireRole(['doctor', 'admin']), updateConsultation);

export default router;
