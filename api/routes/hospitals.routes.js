import { Router } from 'express';
import {
  getHospitals,
  getHospitalById,
  getDepartmentsByHospitalId,
  createHospital
} from '../controllers/hospitals.controller.js';

const router = Router();

router.get('/', getHospitals);
router.post('/', createHospital);
router.get('/:id', getHospitalById);
router.get('/:id/departments', getDepartmentsByHospitalId);

export default router;
