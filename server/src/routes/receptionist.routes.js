import { Router } from 'express';
import {
  getHospitalQueue,
  resetQueue,
  getQueueStats
} from '../controllers/receptionist.controller.js';

const router = Router();

router.get('/:hospitalId/queue', getHospitalQueue);
router.get('/:hospitalId/stats', getQueueStats);
router.post('/:hospitalId/reset', resetQueue);

export default router;
