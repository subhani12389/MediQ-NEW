import { Router } from 'express';
import {
  generateToken,
  getTokenById,
  getPatientTokens,
  callNextToken,
  completeToken,
  skipToken,
  cancelToken,
  generateWalkInToken
} from '../controllers/tokens.controller.js';

const router = Router();

router.post('/', generateToken);
router.post('/walkin', generateWalkInToken);
router.get('/patient/:patientId', getPatientTokens);
router.get('/:id', getTokenById);

router.patch('/:id/call', callNextToken);
router.patch('/:id/complete', completeToken);
router.patch('/:id/skip', skipToken);
router.patch('/:id/cancel', cancelToken);

export default router;
