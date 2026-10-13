import { Router } from 'express';
import {
  getAnalytics,
  getAuditLogs,
  getDoctorsList,
  addDoctor,
  getUsersList,
  createUser,
  updateUserRole,
  getDepartmentsList,
  addDepartment,
  toggleDepartmentPause
} from '../controllers/admin.controller.js';
import { authenticateUser, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/analytics', authenticateUser, requireRole(['admin']), getAnalytics);
router.get('/audit-logs', authenticateUser, requireRole(['admin']), getAuditLogs);
router.get('/doctors', authenticateUser, requireRole(['admin', 'receptionist']), getDoctorsList);
router.post('/doctors', authenticateUser, requireRole(['admin']), addDoctor);

router.get('/users', authenticateUser, requireRole(['admin']), getUsersList);
router.post('/users', authenticateUser, requireRole(['admin']), createUser);
router.patch('/users/:id/role', authenticateUser, requireRole(['admin']), updateUserRole);

router.get('/departments', authenticateUser, requireRole(['admin', 'receptionist']), getDepartmentsList);
router.post('/departments', authenticateUser, requireRole(['admin']), addDepartment);
router.patch('/departments/:id/pause', authenticateUser, requireRole(['admin']), toggleDepartmentPause);

export default router;
