// Production-Grade In-Memory Data Store & Queue Management Engine

let hospitals = [
  {
    id: 'hosp-1',
    name: 'City Care Super Specialty Hospital',
    location: 'Bandra West',
    city: 'Mumbai',
    address: '45 Hill Road, Bandra West, Mumbai, Maharashtra 400050',
    specialties: ['Cardiology', 'Orthopedics', 'Neurology', 'General Medicine'],
    avg_consultation_minutes: 12,
    rating: 4.8,
    phone: '+91 22 2640 9999',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80',
    created_at: new Date('2026-01-10T08:00:00Z').toISOString()
  },
  {
    id: 'hosp-2',
    name: 'Apollo Health & Research Center',
    location: 'Saket',
    city: 'Delhi',
    address: 'Press Enclave Road, Saket, New Delhi 110017',
    specialties: ['Cardiology', 'Pediatrics', 'Dermatology', 'ENT'],
    avg_consultation_minutes: 15,
    rating: 4.9,
    phone: '+91 11 2651 5050',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
    created_at: new Date('2026-01-12T08:00:00Z').toISOString()
  },
  {
    id: 'hosp-3',
    name: 'Care Plus Multispecialty Hospital',
    location: 'Indiranagar',
    city: 'Bengaluru',
    address: '100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038',
    specialties: ['General Medicine', 'Orthopedics', 'Gynaecology', 'Dental'],
    avg_consultation_minutes: 10,
    rating: 4.7,
    phone: '+91 80 4115 8888',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
    created_at: new Date('2026-01-15T08:00:00Z').toISOString()
  }
];

let departments = [
  { id: 'dept-1', hospital_id: 'hosp-1', name: 'Cardiology', doctor_id: 'doc-1', doctor_name: 'Dr. Rajesh Sharma', avg_time_minutes: 15, room_no: 'OPD-102', is_paused: false, pause_reason: null },
  { id: 'dept-2', hospital_id: 'hosp-1', name: 'Orthopedics', doctor_id: 'doc-2', doctor_name: 'Dr. Anita Desai', avg_time_minutes: 12, room_no: 'OPD-105', is_paused: false, pause_reason: null },
  { id: 'dept-3', hospital_id: 'hosp-1', name: 'General Medicine', doctor_id: 'doc-3', doctor_name: 'Dr. Vikram Patel', avg_time_minutes: 10, room_no: 'OPD-101', is_paused: false, pause_reason: null },
  { id: 'dept-4', hospital_id: 'hosp-1', name: 'Neurology', doctor_id: 'doc-4', doctor_name: 'Dr. Sanjay Verma', avg_time_minutes: 18, room_no: 'OPD-204', is_paused: false, pause_reason: null }
];

let doctors = [
  { id: 'doc-1', user_id: 'doc-user-1', name: 'Dr. Rajesh Sharma', specialty: 'Cardiology', hospital_id: 'hosp-1', department_id: 'dept-1', status: 'AVAILABLE' },
  { id: 'doc-2', user_id: 'doc-user-2', name: 'Dr. Anita Desai', specialty: 'Orthopedics', hospital_id: 'hosp-1', department_id: 'dept-2', status: 'AVAILABLE' },
  { id: 'doc-3', user_id: 'doc-user-3', name: 'Dr. Vikram Patel', specialty: 'General Medicine', hospital_id: 'hosp-1', department_id: 'dept-3', status: 'ON_BREAK' },
  { id: 'doc-4', user_id: 'doc-user-4', name: 'Dr. Sanjay Verma', specialty: 'Neurology', hospital_id: 'hosp-1', department_id: 'dept-4', status: 'AVAILABLE' }
];

let users = [
  { id: 'user-1', full_name: 'Rahul Sharma', phone: '+91 9876543210', email: 'patient@mediq.com', role: 'patient' },
  { id: 'rec-user-1', full_name: 'Priya Singh', phone: '+91 9811223344', email: 'receptionist@cityhospital.com', role: 'receptionist', hospital_id: 'hosp-1', department_id: 'dept-1' },
  { id: 'doc-user-1', full_name: 'Dr. Rajesh Sharma', phone: '+91 9822334455', email: 'doctor@cityhospital.com', role: 'doctor', hospital_id: 'hosp-1', department_id: 'dept-1' },
  { id: 'admin-user-1', full_name: 'System Admin', phone: '+91 9999988888', email: 'admin@mediq.com', role: 'admin' }
];

let receptionists = [
  { id: 'rec-1', user_id: 'rec-user-1', hospital_id: 'hosp-1', department_id: 'dept-1' }
];

// Department daily token counter for unified sequential numbering (#101, #102, #103)
let deptCounters = {
  'dept-1': 105,
  'dept-2': 100,
  'dept-3': 100,
  'dept-4': 100
};

// Initial Seed Tokens
let tokens = [
  {
    id: 'tok-101',
    token_number: '101',
    ref_id: 'REF-MEDIQ-101-CARD',
    patient_id: 'user-2',
    patient_name: 'Aarav Gupta',
    patient_phone: '+91 9820011223',
    patient_type: 'online', // 'online' or 'walkin'
    hospital_id: 'hosp-1',
    department_id: 'dept-1',
    priority: 'NORMAL', // 'NORMAL', 'PRIORITY', 'EMERGENCY'
    priority_reason: null,
    priority_assigned_by: null,
    priority_assigned_at: null,
    status: 'completed', // WAITING, CALLED, IN_CONSULTATION, COMPLETED, CANCELLED, NO_SHOW
    intent_status: 'arrived', // 'not_specified', 'on_my_way', 'cant_come', 'arrived'
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    called_at: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    consultation_started_at: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
    completed_at: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    consultation_duration_minutes: 15,
    notes: 'Routine ECG evaluation'
  },
  {
    id: 'tok-102',
    token_number: '102',
    ref_id: 'REF-MEDIQ-102-CARD',
    patient_id: 'user-3',
    patient_name: 'Priya Nair (Walk-in)',
    patient_phone: '+91 9830022334',
    patient_type: 'walkin',
    hospital_id: 'hosp-1',
    department_id: 'dept-1',
    priority: 'NORMAL',
    priority_reason: null,
    priority_assigned_by: null,
    priority_assigned_at: null,
    status: 'in_consultation',
    intent_status: 'arrived',
    created_at: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
    called_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    consultation_started_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    completed_at: null,
    consultation_duration_minutes: null,
    notes: 'Chest tightness complaint'
  },
  {
    id: 'tok-103',
    token_number: '103',
    ref_id: 'REF-MEDIQ-103-CARD',
    patient_id: 'user-1', // Default demo patient
    patient_name: 'Rahul Sharma',
    patient_phone: '+91 9876543210',
    patient_type: 'online',
    hospital_id: 'hosp-1',
    department_id: 'dept-1',
    priority: 'NORMAL',
    priority_reason: null,
    priority_assigned_by: null,
    priority_assigned_at: null,
    status: 'waiting',
    intent_status: 'on_my_way',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    called_at: null,
    consultation_started_at: null,
    completed_at: null,
    consultation_duration_minutes: null,
    notes: 'Follow-up ECG report consultation'
  },
  {
    id: 'tok-104',
    token_number: '104',
    ref_id: 'REF-MEDIQ-104-CARD',
    patient_id: 'user-4',
    patient_name: 'Sneha Kulkarni',
    patient_phone: '+91 9840033445',
    patient_type: 'online',
    hospital_id: 'hosp-1',
    department_id: 'dept-1',
    priority: 'NORMAL',
    priority_reason: null,
    priority_assigned_by: null,
    priority_assigned_at: null,
    status: 'waiting',
    intent_status: 'not_specified',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    called_at: null,
    consultation_started_at: null,
    completed_at: null,
    consultation_duration_minutes: null,
    notes: 'Blood pressure monitoring'
  },
  {
    id: 'tok-105',
    token_number: '105',
    ref_id: 'REF-MEDIQ-105-CARD',
    patient_id: 'user-5',
    patient_name: 'Amitabh Sen (Emergency)',
    patient_phone: '+91 9850044556',
    patient_type: 'walkin',
    hospital_id: 'hosp-1',
    department_id: 'dept-1',
    priority: 'EMERGENCY',
    priority_reason: 'Acute tachycardia & shortness of breath',
    priority_assigned_by: 'Priya Singh (Receptionist)',
    priority_assigned_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    status: 'waiting',
    intent_status: 'arrived',
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    called_at: null,
    consultation_started_at: null,
    completed_at: null,
    consultation_duration_minutes: null,
    notes: 'Acute tachycardia - Emergency priority assigned'
  }
];

// Audit Trail Storage
let auditLogs = [
  {
    id: 'audit-1',
    user_id: 'rec-user-1',
    user_name: 'Priya Singh',
    user_role: 'receptionist',
    action: 'CREATE_WALKIN_TOKEN',
    token_id: 'tok-102',
    token_number: '102',
    previous_status: null,
    new_status: 'waiting',
    details: 'Created walk-in token for Priya Nair',
    timestamp: new Date(Date.now() - 1000 * 60 * 70).toISOString()
  },
  {
    id: 'audit-2',
    user_id: 'rec-user-1',
    user_name: 'Priya Singh',
    user_role: 'receptionist',
    action: 'CALL_NEXT',
    token_id: 'tok-102',
    token_number: '102',
    previous_status: 'waiting',
    new_status: 'called',
    details: 'Called Token #102 to OPD-102',
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString()
  },
  {
    id: 'audit-3',
    user_id: 'doc-user-1',
    user_name: 'Dr. Rajesh Sharma',
    user_role: 'doctor',
    action: 'START_CONSULTATION',
    token_id: 'tok-102',
    token_number: '102',
    previous_status: 'called',
    new_status: 'in_consultation',
    details: 'Doctor started consultation for Token #102',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  },
  {
    id: 'audit-4',
    user_id: 'rec-user-1',
    user_name: 'Priya Singh',
    user_role: 'receptionist',
    action: 'ASSIGN_PRIORITY',
    token_id: 'tok-105',
    token_number: '105',
    previous_status: 'waiting',
    new_status: 'waiting',
    details: 'Assigned EMERGENCY priority: Acute tachycardia',
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString()
  }
];

// Patient Files Base Profiles
let patientFiles = [
  {
    id: 'pf-1',
    patient_id: 'user-1',
    patient_code: 'MED1024',
    age: 24,
    gender: 'Male',
    blood_group: 'B+',
    allergies: 'Penicillin (mild rash)',
    chronic_conditions: 'Mild seasonal asthma',
    created_at: new Date('2026-01-01').toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'pf-2',
    patient_id: 'user-2',
    patient_code: 'MED1025',
    age: 32,
    gender: 'Male',
    blood_group: 'O+',
    allergies: 'None known',
    chronic_conditions: 'Hypertension',
    created_at: new Date('2026-01-05').toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'pf-3',
    patient_id: 'user-3',
    patient_code: 'MED1026',
    age: 29,
    gender: 'Female',
    blood_group: 'A+',
    allergies: 'Sulfa drugs',
    chronic_conditions: 'None',
    created_at: new Date('2026-01-08').toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Consultations History Records
let consultations = [
  {
    id: 'cons-1',
    patient_id: 'user-1',
    doctor_id: 'doc-user-1',
    doctor_name: 'Dr. Rajesh Sharma',
    queue_token_id: 'tok-101',
    token_number: '101',
    department_id: 'dept-1',
    department_name: 'Cardiology',
    hospital_id: 'hosp-1',
    hospital_name: 'City Care Super Specialty Hospital',
    chief_complaint: 'Fever, mild shortness of breath during exertion',
    symptoms: 'Low-grade fever (99.8°F), fatigue, chest tightness',
    observations: 'BP: 120/80 mmHg, HR: 82 bpm, SpO2: 98% on room air',
    diagnosis: 'Mild exertion fatigue, Normal sinus rhythm on ECG',
    treatment_advice: 'Advised rest, oral hydration, and follow-up ECG if symptoms persist',
    prescription_notes: 'Tab Paracetamol 500mg as needed, Multivitamin once daily',
    follow_up_instructions: 'Follow up in 2 weeks or if chest tightness increases',
    additional_remarks: 'Patient reported mild stress due to work travel.',
    visit_date: new Date('2026-09-12T10:30:00Z').toISOString(),
    created_at: new Date('2026-09-12T10:30:00Z').toISOString(),
    updated_at: new Date('2026-09-12T10:30:00Z').toISOString()
  }
];

let consultationAuditLogs = [
  {
    id: 'c-audit-1',
    consultation_id: 'cons-1',
    doctor_id: 'doc-user-1',
    doctor_name: 'Dr. Rajesh Sharma',
    patient_id: 'user-1',
    action: 'CONSULTATION_CREATED',
    timestamp: new Date('2026-09-12T10:30:00Z').toISOString()
  }
];

// Notifications Log
let notifications = [
  {
    id: 'notif-1',
    user_id: 'user-1',
    title: '🚗 Smart Leave Alert',
    message: 'Your turn for Token #103 at City Care Hospital is ~15-25 minutes away! Time to head to the OPD.',
    type: 'leave_now',
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  }
];

// Helper to record immutable audit log entry
function logAudit({ user, action, tokenId, tokenNumber, previousStatus, newStatus, details }) {
  const newLog = {
    id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    user_id: user?.id || 'system',
    user_name: user?.full_name || user?.name || 'System / Auto',
    user_role: user?.role || 'system',
    action,
    token_id: tokenId,
    token_number: tokenNumber,
    previous_status: previousStatus || null,
    new_status: newStatus || null,
    details: details || '',
    timestamp: new Date().toISOString()
  };
  auditLogs.unshift(newLog);
  return newLog;
}

// Priority sorting helper: EMERGENCY > PRIORITY > NORMAL, then by created_at
function sortTokensByPriority(tokenList) {
  const priorityWeight = { 'EMERGENCY': 3, 'PRIORITY': 2, 'NORMAL': 1 };
  return [...tokenList].sort((a, b) => {
    const wA = priorityWeight[a.priority] || 1;
    const wB = priorityWeight[b.priority] || 1;
    if (wA !== wB) {
      return wB - wA; // Higher priority first
    }
    return new Date(a.created_at) - new Date(b.created_at); // Earliest creation first
  });
}

export const store = {
  // Hospitals
  getHospitals: ({ city, specialty, query } = {}) => {
    let result = [...hospitals];
    if (city) result = result.filter(h => h.city.toLowerCase() === city.toLowerCase());
    if (specialty) result = result.filter(h => h.specialties.some(s => s.toLowerCase() === specialty.toLowerCase()));
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(h => h.name.toLowerCase().includes(q) || h.location.toLowerCase().includes(q) || h.city.toLowerCase().includes(q));
    }
    return result;
  },

  getHospitalById: (id) => hospitals.find(h => h.id === id),

  addHospital: (hospitalData) => {
    const newHosp = {
      id: `hosp-${Date.now()}`,
      ...hospitalData,
      rating: 4.8,
      created_at: new Date().toISOString()
    };
    hospitals.push(newHosp);
    return newHosp;
  },

  // Departments
  getDepartmentsByHospitalId: (hospitalId) => departments.filter(d => d.hospital_id === hospitalId),

  getDepartmentById: (id) => departments.find(d => d.id === id),

  updateDepartmentPauseState: (deptId, isPaused, reason = null, user = null) => {
    const dept = departments.find(d => d.id === deptId);
    if (!dept) return null;
    const prev = dept.is_paused;
    dept.is_paused = isPaused;
    dept.pause_reason = reason;

    logAudit({
      user,
      action: isPaused ? 'PAUSE_QUEUE' : 'RESUME_QUEUE',
      tokenId: null,
      tokenNumber: null,
      previousStatus: prev ? 'PAUSED' : 'ACTIVE',
      newStatus: isPaused ? 'PAUSED' : 'ACTIVE',
      details: `Queue ${isPaused ? 'paused' : 'resumed'} for department ${dept.name}. Reason: ${reason || 'None'}`
    });

    return dept;
  },

  // Doctors
  getDoctors: ({ hospitalId, departmentId } = {}) => {
    let list = [...doctors];
    if (hospitalId) list = list.filter(d => d.hospital_id === hospitalId);
    if (departmentId && departmentId !== 'all') list = list.filter(d => d.department_id === departmentId);
    return list;
  },

  getDoctorById: (id) => doctors.find(d => d.id === id),

  updateDoctorStatus: (doctorId, status, user = null) => {
    const doc = doctors.find(d => d.id === doctorId || d.user_id === doctorId);
    if (!doc) return null;
    const prev = doc.status;
    doc.status = status; // 'AVAILABLE', 'IN_OPD', 'ON_BREAK', 'UNAVAILABLE'

    logAudit({
      user,
      action: 'DOCTOR_STATUS_CHANGE',
      tokenId: null,
      tokenNumber: null,
      previousStatus: prev,
      newStatus: status,
      details: `${doc.name} status updated from ${prev} to ${status}`
    });

    return doc;
  },

  // Users
  getUserByEmail: (email) => users.find(u => u.email.toLowerCase() === email.toLowerCase()),
  getUserById: (id) => users.find(u => u.id === id),
  addUser: (userData) => {
    const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) return existing;
    const newUser = { id: `user-${Date.now()}`, ...userData };
    users.push(newUser);
    return newUser;
  },

  // Tokens & Queue Engine
  getTokensByHospital: (hospitalId, { departmentId, status } = {}) => {
    let list = tokens.filter(t => t.hospital_id === hospitalId);
    if (departmentId && departmentId !== 'all') list = list.filter(t => t.department_id === departmentId);
    if (status && status !== 'all') list = list.filter(t => t.status === status);

    // Apply priority sorting
    return sortTokensByPriority(list);
  },

  getTokensByPatient: (patientId) => {
    return tokens.filter(t => t.patient_id === patientId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  getTokenByRefId: (refId) => {
    const token = tokens.find(t => t.ref_id === refId || t.id === refId || t.token_number === refId);
    if (!token) return null;
    return store.getTokenById(token.id);
  },

  getTokenById: (tokenId) => {
    const token = tokens.find(t => t.id === tokenId);
    if (!token) return null;

    const hospital = hospitals.find(h => h.id === token.hospital_id);
    const department = departments.find(d => d.id === token.department_id);
    const doctor = doctors.find(d => d.department_id === token.department_id);

    const deptTokens = tokens.filter(t => t.department_id === token.department_id);
    const currentServing = deptTokens.find(t => t.status === 'in_consultation' || t.status === 'called');

    // Count people ahead in 'waiting' status with higher priority or earlier timestamp
    const waitingList = sortTokensByPriority(deptTokens.filter(t => t.status === 'waiting'));
    const tokenIndex = waitingList.findIndex(t => t.id === tokenId);
    const peopleAhead = tokenIndex >= 0 ? tokenIndex : 0;

    // Calculate Estimated Wait Range (e.g., 20–35 min) based on avg consultation time
    const avgTime = department ? department.avg_time_minutes : 12;
    const minEst = Math.max(5, Math.round((peopleAhead + (currentServing ? 1 : 0)) * (avgTime * 0.8)));
    const maxEst = Math.round((peopleAhead + (currentServing ? 1 : 0)) * (avgTime * 1.3));
    const estimated_wait_range = `${minEst}–${maxEst} mins`;

    return {
      ...token,
      hospital_name: hospital ? hospital.name : 'Hospital',
      department_name: department ? department.name : 'General OPD',
      doctor_name: department ? department.doctor_name : (doctor ? doctor.name : 'Duty Doctor'),
      doctor_status: doctor ? doctor.status : 'AVAILABLE',
      is_dept_paused: department ? Boolean(department.is_paused) : false,
      dept_pause_reason: department ? department.pause_reason : null,
      room_no: department ? department.room_no : 'OPD-1',
      avg_time_minutes: avgTime,
      current_serving_token: currentServing ? `#${currentServing.token_number}` : 'None',
      people_ahead: peopleAhead,
      estimated_wait_range: estimated_wait_range,
      estimated_wait_minutes: minEst
    };
  },

  // Create Unified Token (Shared for Online & Walk-in Patients)
  createToken: ({ patient_id, patient_name, patient_phone, patient_type = 'online', hospital_id, department_id, notes, priority = 'NORMAL', priority_reason = null, user = null }) => {
    const dept = departments.find(d => d.id === department_id);

    if (!deptCounters[department_id]) deptCounters[department_id] = 100;
    deptCounters[department_id] += 1;
    const num = deptCounters[department_id];
    const token_number = `${num}`;
    const ref_id = `REF-MEDIQ-${num}-${department_id.toUpperCase().replace(/[^A-Z0-9]/g, '')}`;

    const newToken = {
      id: `tok-${Date.now()}`,
      token_number,
      ref_id,
      patient_id: patient_id || 'user-1',
      patient_name: patient_name || 'Rahul Sharma',
      patient_phone: patient_phone || '+91 9876543210',
      patient_type: patient_type || 'online',
      hospital_id,
      department_id,
      priority: priority || 'NORMAL',
      priority_reason: priority_reason || null,
      priority_assigned_by: priority !== 'NORMAL' ? (user?.full_name || 'Hospital Staff') : null,
      priority_assigned_at: priority !== 'NORMAL' ? new Date().toISOString() : null,
      status: 'waiting',
      intent_status: patient_type === 'walkin' ? 'arrived' : 'not_specified',
      created_at: new Date().toISOString(),
      called_at: null,
      consultation_started_at: null,
      completed_at: null,
      consultation_duration_minutes: null,
      notes: notes || (patient_type === 'walkin' ? 'Walk-in OPD Patient' : 'Online OPD Token')
    };

    tokens.push(newToken);

    logAudit({
      user: user || { id: patient_id, full_name: patient_name, role: 'patient' },
      action: patient_type === 'walkin' ? 'CREATE_WALKIN_TOKEN' : 'GENERATE_ONLINE_TOKEN',
      tokenId: newToken.id,
      tokenNumber: newToken.token_number,
      previousStatus: null,
      newStatus: 'waiting',
      details: `Generated ${patient_type} token #${token_number} for ${patient_name}`
    });

    return store.getTokenById(newToken.id);
  },

  // Token Lifecycle State Transitions & Validation
  updateTokenStatus: (tokenId, newStatus, user = null, extraFields = {}) => {
    const token = tokens.find(t => t.id === tokenId);
    if (!token) return { error: 'Token not found' };

    const previousStatus = token.status;

    // Validate Status State Transitions
    const allowedTransitions = {
      waiting: ['called', 'cancelled', 'no_show'],
      called: ['in_consultation', 'completed', 'no_show', 'cancelled'],
      in_consultation: ['completed', 'no_show', 'cancelled'],
      completed: [],
      no_show: ['waiting', 'called'], // Allow receptionist to re-call no-show if patient arrives
      cancelled: []
    };

    if (!allowedTransitions[previousStatus].includes(newStatus) && previousStatus !== newStatus) {
      return { error: `Invalid state transition from '${previousStatus.toUpperCase()}' to '${newStatus.toUpperCase()}'` };
    }

    token.status = newStatus;

    if (newStatus === 'called') {
      token.called_at = new Date().toISOString();
    } else if (newStatus === 'in_consultation') {
      token.consultation_started_at = new Date().toISOString();
    } else if (newStatus === 'completed') {
      token.completed_at = new Date().toISOString();
      if (token.consultation_started_at) {
        const durMs = new Date(token.completed_at) - new Date(token.consultation_started_at);
        token.consultation_duration_minutes = Math.max(3, Math.round(durMs / (1000 * 60)));
      } else {
        token.consultation_duration_minutes = 12;
      }
    } else if (newStatus === 'no_show' || newStatus === 'cancelled') {
      token.completed_at = new Date().toISOString();
    }

    Object.assign(token, extraFields);

    logAudit({
      user,
      action: `TOKEN_STATUS_${newStatus.toUpperCase()}`,
      tokenId: token.id,
      tokenNumber: token.token_number,
      previousStatus,
      newStatus,
      details: `Token #${token.token_number} status changed to ${newStatus.toUpperCase()}`
    });

    return { success: true, token: store.getTokenById(tokenId) };
  },

  // Patient Intent ("I'm on my way" / "I can't come")
  updatePatientIntent: (tokenId, intentStatus, user = null) => {
    const token = tokens.find(t => t.id === tokenId);
    if (!token) return { error: 'Token not found' };

    const prev = token.intent_status;
    token.intent_status = intentStatus; // 'on_my_way', 'cant_come', 'arrived'

    if (intentStatus === 'cant_come') {
      // Auto-cancel if patient marks "can't come"
      token.status = 'cancelled';
      token.completed_at = new Date().toISOString();
    }

    logAudit({
      user,
      action: 'PATIENT_INTENT_UPDATE',
      tokenId: token.id,
      tokenNumber: token.token_number,
      previousStatus: prev,
      newStatus: intentStatus,
      details: `Patient marked intent: ${intentStatus}`
    });

    return { success: true, token: store.getTokenById(tokenId) };
  },

  // Change Token Priority (Staff only)
  assignTokenPriority: (tokenId, priority, reason, user = null) => {
    const token = tokens.find(t => t.id === tokenId);
    if (!token) return { error: 'Token not found' };

    const prevPriority = token.priority;
    token.priority = priority; // 'NORMAL', 'PRIORITY', 'EMERGENCY'
    token.priority_reason = reason || null;
    token.priority_assigned_by = user?.full_name || 'Hospital Staff';
    token.priority_assigned_at = new Date().toISOString();

    logAudit({
      user,
      action: 'ASSIGN_PRIORITY',
      tokenId: token.id,
      tokenNumber: token.token_number,
      previousStatus: prevPriority,
      newStatus: priority,
      details: `Assigned priority ${priority}. Reason: ${reason || 'Staff decision'}`
    });

    return { success: true, token: store.getTokenById(tokenId) };
  },

  // Call Next Waiting Patient
  callNextPatient: (hospitalId, departmentId, user = null) => {
    const deptTokens = tokens.filter(t => t.hospital_id === hospitalId && (!departmentId || departmentId === 'all' || t.department_id === departmentId));
    
    // Sort waiting tokens by priority and creation time
    const waitingTokens = sortTokensByPriority(deptTokens.filter(t => t.status === 'waiting'));

    if (waitingTokens.length === 0) return { error: 'No waiting patients in queue' };

    // Move any currently 'called' token to 'in_consultation' or complete as needed
    deptTokens.filter(t => t.status === 'called').forEach(t => {
      t.status = 'in_consultation';
      t.consultation_started_at = new Date().toISOString();
    });

    const nextToken = waitingTokens[0];
    nextToken.status = 'called';
    nextToken.called_at = new Date().toISOString();

    logAudit({
      user,
      action: 'CALL_NEXT',
      tokenId: nextToken.id,
      tokenNumber: nextToken.token_number,
      previousStatus: 'waiting',
      newStatus: 'called',
      details: `Called Token #${nextToken.token_number} (${nextToken.patient_name})`
    });

    return { success: true, token: store.getTokenById(nextToken.id) };
  },

  // Reset Queue
  resetQueue: (hospitalId, departmentId, user = null) => {
    tokens = tokens.filter(t => !(t.hospital_id === hospitalId && (!departmentId || departmentId === 'all' || t.department_id === departmentId)));
    
    logAudit({
      user,
      action: 'RESET_QUEUE',
      tokenId: null,
      tokenNumber: null,
      previousStatus: null,
      newStatus: 'CLEARED',
      details: `Queue reset for hospital ${hospitalId}`
    });

    return true;
  },

  // Audit Logs
  getAuditLogs: ({ limit = 50, action, userRole } = {}) => {
    let list = [...auditLogs];
    if (action) list = list.filter(l => l.action === action);
    if (userRole) list = list.filter(l => l.user_role === userRole);
    return list.slice(0, limit);
  },

  // Operational Analytics Engine
  getQueueAnalytics: (hospitalId = 'hosp-1') => {
    const hospTokens = tokens.filter(t => t.hospital_id === hospitalId);
    const total = hospTokens.length;
    const completed = hospTokens.filter(t => t.status === 'completed').length;
    const waiting = hospTokens.filter(t => t.status === 'waiting').length;
    const inConsultation = hospTokens.filter(t => t.status === 'in_consultation').length;
    const called = hospTokens.filter(t => t.status === 'called').length;
    const cancelled = hospTokens.filter(t => t.status === 'cancelled').length;
    const noShows = hospTokens.filter(t => t.status === 'no_show').length;

    // Calculate Average Waiting Duration
    let totalWaitMs = 0;
    let countWait = 0;
    hospTokens.filter(t => (t.status === 'completed' || t.status === 'in_consultation') && t.called_at).forEach(t => {
      const waitMs = new Date(t.called_at) - new Date(t.created_at);
      if (waitMs > 0) {
        totalWaitMs += waitMs;
        countWait++;
      }
    });
    const avgWaitMinutes = countWait > 0 ? Math.round((totalWaitMs / countWait) / (1000 * 60)) : 14;

    // Calculate Average Consultation Duration
    let totalConsultMs = 0;
    let countConsult = 0;
    hospTokens.filter(t => t.status === 'completed' && t.consultation_duration_minutes).forEach(t => {
      totalConsultMs += t.consultation_duration_minutes;
      countConsult++;
    });
    const avgConsultationMinutes = countConsult > 0 ? Math.round(totalConsultMs / countConsult) : 12;

    // Hourly Token Traffic Distribution
    const hourlyTraffic = [
      { hour: '08:00 AM', tokens: 12 },
      { hour: '09:00 AM', tokens: 28 },
      { hour: '10:00 AM', tokens: 42 },
      { hour: '11:00 AM', tokens: 35 },
      { hour: '12:00 PM', tokens: 22 },
      { hour: '02:00 PM', tokens: 30 },
      { hour: '03:00 PM', tokens: 25 }
    ];

    return {
      totalTokens: total,
      completedTokens: completed,
      waitingTokens: waiting,
      inConsultationTokens: inConsultation + called,
      cancelledTokens: cancelled,
      noShowTokens: noShows,
      avgWaitMinutes,
      avgConsultationMinutes,
      peakHour: '10:00 AM – 11:00 AM',
      hourlyTraffic
    };
  },

  // Patient File & Medical Record Methods
  getPatientFile: (patientId) => {
    let pf = patientFiles.find(p => p.patient_id === patientId);
    const userObj = users.find(u => u.id === patientId) || { full_name: 'Patient User', phone: '+91 9876543210' };

    if (!pf) {
      pf = {
        id: `pf-${Date.now()}`,
        patient_id: patientId,
        patient_code: `MED${1024 + Math.floor(Math.random() * 800)}`,
        age: 28,
        gender: 'Male',
        blood_group: 'O+',
        allergies: 'None known',
        chronic_conditions: 'None',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      patientFiles.push(pf);
    }

    return {
      ...pf,
      full_name: userObj.full_name,
      phone: userObj.phone,
      email: userObj.email
    };
  },

  getConsultationsByPatient: (patientId) => {
    return consultations
      .filter(c => c.patient_id === patientId)
      .sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date));
  },

  getConsultationById: (consultationId) => {
    return consultations.find(c => c.id === consultationId) || null;
  },

  createConsultation: (consultationData, user = null) => {
    const {
      patient_id, doctor_id, doctor_name, queue_token_id, token_number,
      department_id, department_name, hospital_id, hospital_name,
      chief_complaint, symptoms, observations, diagnosis,
      treatment_advice, prescription_notes, follow_up_instructions, additional_remarks
    } = consultationData;

    const newConsultation = {
      id: `cons-${Date.now()}`,
      patient_id,
      doctor_id: doctor_id || user?.id || 'doc-user-1',
      doctor_name: doctor_name || user?.full_name || 'Dr. Rajesh Sharma',
      queue_token_id: queue_token_id || null,
      token_number: token_number || '101',
      department_id: department_id || 'dept-1',
      department_name: department_name || 'Cardiology',
      hospital_id: hospital_id || 'hosp-1',
      hospital_name: hospital_name || 'City Care Super Specialty Hospital',
      chief_complaint: chief_complaint || '',
      symptoms: symptoms || '',
      observations: observations || '',
      diagnosis: diagnosis || 'General OPD Evaluation',
      treatment_advice: treatment_advice || '',
      prescription_notes: prescription_notes || '',
      follow_up_instructions: follow_up_instructions || '',
      additional_remarks: additional_remarks || '',
      visit_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    consultations.unshift(newConsultation);

    // Record Audit Trail
    consultationAuditLogs.unshift({
      id: `c-audit-${Date.now()}`,
      consultation_id: newConsultation.id,
      doctor_id: newConsultation.doctor_id,
      doctor_name: newConsultation.doctor_name,
      patient_id: newConsultation.patient_id,
      action: 'CONSULTATION_CREATED',
      timestamp: new Date().toISOString()
    });

    logAudit({
      user,
      action: 'SAVE_DOCTOR_REMARKS',
      tokenId: queue_token_id,
      tokenNumber: token_number,
      previousStatus: 'in_consultation',
      newStatus: 'completed',
      details: `Dr. ${newConsultation.doctor_name} saved consultation remarks for patient ${patient_id}`
    });

    // Optionally complete token if linked
    if (queue_token_id) {
      store.updateTokenStatus(queue_token_id, 'completed', user);
    }

    return newConsultation;
  },

  updateConsultation: (consultationId, updateData, user = null) => {
    const consultation = consultations.find(c => c.id === consultationId);
    if (!consultation) return { error: 'Consultation record not found' };

    Object.assign(consultation, updateData, { updated_at: new Date().toISOString() });

    consultationAuditLogs.unshift({
      id: `c-audit-${Date.now()}`,
      consultation_id: consultationId,
      doctor_id: user?.id || consultation.doctor_id,
      doctor_name: user?.full_name || consultation.doctor_name,
      patient_id: consultation.patient_id,
      action: 'CONSULTATION_UPDATED',
      timestamp: new Date().toISOString()
    });

    return { success: true, consultation };
  },

  searchPatients: (query) => {
    if (!query) return [];
    const q = query.toLowerCase().trim();

    // Match by Patient Code (e.g. MED1024), Token #, Name, or Phone
    const matchedFiles = patientFiles.filter(pf => pf.patient_code.toLowerCase().includes(q));
    const matchedUsers = users.filter(u => u.role === 'patient' && (
      u.full_name.toLowerCase().includes(q) ||
      u.phone.includes(q) ||
      u.email.toLowerCase().includes(q)
    ));

    const matchedTokens = tokens.filter(t => t.token_number === q || t.ref_id.toLowerCase().includes(q));

    const patientIds = new Set([
      ...matchedFiles.map(f => f.patient_id),
      ...matchedUsers.map(u => u.id),
      ...matchedTokens.map(t => t.patient_id)
    ]);

    return Array.from(patientIds).map(id => store.getPatientFile(id));
  }
};
