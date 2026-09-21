import { Router } from 'express';
import { getAnalytics, getAuditLogs, getDoctorsList } from '../controllers/admin.controller.js';
import { authenticateUser, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/analytics', authenticateUser, requireRole(['admin']), getAnalytics);
router.get('/audit-logs', authenticateUser, requireRole(['admin']), getAuditLogs);
router.get('/doctors', authenticateUser, requireRole(['admin', 'receptionist']), getDoctorsList);

export default router;
