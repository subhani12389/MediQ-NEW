import { Router } from 'express';
import {
  getHospitalQueue,
  pauseQueue,
  resetQueue,
  getQueueStats
} from '../controllers/receptionist.controller.js';
import { authenticateUser, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/:hospitalId/queue', authenticateUser, getHospitalQueue);
router.get('/:hospitalId/stats', authenticateUser, getQueueStats);
router.post('/:hospitalId/pause', authenticateUser, requireRole(['receptionist', 'admin']), pauseQueue);
router.post('/:hospitalId/reset', authenticateUser, requireRole(['receptionist', 'admin']), resetQueue);

export default router;
