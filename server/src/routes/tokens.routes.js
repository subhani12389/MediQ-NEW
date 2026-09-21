import { Router } from 'express';
import {
  generateToken,
  generateWalkInToken,
  getTokenById,
  getTokenByRef,
  getPatientTokens,
  callNextToken,
  startConsultation,
  completeToken,
  skipToken,
  cancelToken,
  updatePatientIntent,
  assignTokenPriority
} from '../controllers/tokens.controller.js';
import { authenticateUser, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authenticateUser, generateToken);
router.post('/walkin', authenticateUser, requireRole(['receptionist', 'admin']), generateWalkInToken);
router.get('/patient/:patientId', authenticateUser, getPatientTokens);
router.get('/ref/:refId', getTokenByRef);
router.get('/:id', getTokenById);

// Token State Machine & Intent Actions
router.patch('/:id/call', authenticateUser, requireRole(['receptionist', 'doctor', 'admin']), callNextToken);
router.patch('/:id/start-consultation', authenticateUser, requireRole(['receptionist', 'doctor', 'admin']), startConsultation);
router.patch('/:id/complete', authenticateUser, requireRole(['receptionist', 'doctor', 'admin']), completeToken);
router.patch('/:id/skip', authenticateUser, requireRole(['receptionist', 'doctor', 'admin']), skipToken);
router.patch('/:id/cancel', authenticateUser, cancelToken);
router.patch('/:id/intent', authenticateUser, updatePatientIntent);
router.patch('/:id/priority', authenticateUser, requireRole(['receptionist', 'doctor', 'admin']), assignTokenPriority);

export default router;
