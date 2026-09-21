import { Router } from 'express';
import { getDoctorQueue, updateDoctorAvailability } from '../controllers/doctor.controller.js';
import { authenticateUser, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/:doctorId/queue', authenticateUser, requireRole(['doctor', 'admin']), getDoctorQueue);
router.patch('/:doctorId/status', authenticateUser, requireRole(['doctor', 'admin']), updateDoctorAvailability);

export default router;
