// In-memory data store for out-of-the-box operation and backend demo fallback

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
  },
  {
    id: 'hosp-4',
    name: 'LifeLine Emergency & Specialty Hospital',
    location: 'Jubilee Hills',
    city: 'Hyderabad',
    address: 'Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033',
    specialties: ['Cardiology', 'Oncology', 'Pulmonology', 'Orthopedics'],
    avg_consultation_minutes: 14,
    rating: 4.8,
    phone: '+91 40 2360 7777',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80',
    created_at: new Date('2026-01-18T08:00:00Z').toISOString()
  }
];

let departments = [
  // Hosp 1
  { id: 'dept-1', hospital_id: 'hosp-1', name: 'Cardiology', doctor_name: 'Dr. Rajesh Sharma', avg_time_minutes: 15, room_no: 'OPD-102' },
  { id: 'dept-2', hospital_id: 'hosp-1', name: 'Orthopedics', doctor_name: 'Dr. Anita Desai', avg_time_minutes: 12, room_no: 'OPD-105' },
  { id: 'dept-3', hospital_id: 'hosp-1', name: 'General Medicine', doctor_name: 'Dr. Vikram Patel', avg_time_minutes: 10, room_no: 'OPD-101' },
  { id: 'dept-4', hospital_id: 'hosp-1', name: 'Neurology', doctor_name: 'Dr. Sanjay Verma', avg_time_minutes: 18, room_no: 'OPD-204' },
  // Hosp 2
  { id: 'dept-5', hospital_id: 'hosp-2', name: 'Cardiology', doctor_name: 'Dr. Aris Thorne', avg_time_minutes: 15, room_no: 'A-201' },
  { id: 'dept-6', hospital_id: 'hosp-2', name: 'Pediatrics', doctor_name: 'Dr. Meera Rao', avg_time_minutes: 12, room_no: 'A-108' },
  { id: 'dept-7', hospital_id: 'hosp-2', name: 'Dermatology', doctor_name: 'Dr. Kabir Anand', avg_time_minutes: 10, room_no: 'A-304' },
  // Hosp 3
  { id: 'dept-8', hospital_id: 'hosp-3', name: 'General Medicine', doctor_name: 'Dr. Sunita Reddy', avg_time_minutes: 10, room_no: 'B-101' },
  { id: 'dept-9', hospital_id: 'hosp-3', name: 'Orthopedics', doctor_name: 'Dr. Ramesh Kumar', avg_time_minutes: 14, room_no: 'B-105' },
  // Hosp 4
  { id: 'dept-10', hospital_id: 'hosp-4', name: 'Cardiology', doctor_name: 'Dr. Srinivas Rao', avg_time_minutes: 15, room_no: 'C-301' }
];

let users = [
  { id: 'user-1', full_name: 'Rahul Sharma', phone: '+91 9876543210', email: 'patient@mediq.com', role: 'patient' },
  { id: 'rec-user-1', full_name: 'Priya Singh', phone: '+91 9811223344', email: 'receptionist@cityhospital.com', role: 'receptionist' },
  { id: 'admin-user-1', full_name: 'Admin User', phone: '+91 9999988888', email: 'admin@mediq.com', role: 'admin' }
];

let receptionists = [
  { id: 'rec-1', user_id: 'rec-user-1', hospital_id: 'hosp-1', department_id: 'dept-1' }
];

// Helper to calculate current date ISO string for tokens
const todayStr = new Date().toISOString().split('T')[0];

let tokens = [
  {
    id: 'tok-101',
    token_number: 'A-101',
    patient_id: 'user-2',
    patient_name: 'Aarav Gupta',
    patient_phone: '+91 9820011223',
    hospital_id: 'hosp-1',
    department_id: 'dept-1',
    status: 'completed',
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    called_at: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    completed_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    notes: 'Routine checkup'
  },
  {
    id: 'tok-102',
    token_number: 'A-102',
    patient_id: 'user-3',
    patient_name: 'Priya Nair',
    patient_phone: '+91 9830022334',
    hospital_id: 'hosp-1',
    department_id: 'dept-1',
    status: 'in_progress',
    created_at: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
    called_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    completed_at: null,
    notes: 'Chest tightness evaluation'
  },
  {
    id: 'tok-103',
    token_number: 'A-103',
    patient_id: 'user-1', // Default demo patient
    patient_name: 'Rahul Sharma',
    patient_phone: '+91 9876543210',
    hospital_id: 'hosp-1',
    department_id: 'dept-1',
    status: 'waiting',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    called_at: null,
    completed_at: null,
    notes: 'Follow-up ECG report consultation'
  },
  {
    id: 'tok-104',
    token_number: 'A-104',
    patient_id: 'user-4',
    patient_name: 'Sneha Kulkarni',
    patient_phone: '+91 9840033445',
    hospital_id: 'hosp-1',
    department_id: 'dept-1',
    status: 'waiting',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    called_at: null,
    completed_at: null,
    notes: 'Blood pressure monitoring'
  },
  {
    id: 'tok-105',
    token_number: 'A-105',
    patient_id: 'user-5',
    patient_name: 'Amitabh Sen',
    patient_phone: '+91 9850044556',
    hospital_id: 'hosp-1',
    department_id: 'dept-1',
    status: 'waiting',
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    called_at: null,
    completed_at: null,
    notes: 'High heart rate complaint'
  }
];

// Department counter state for incremental token number generation
let deptCounters = {
  'dept-1': 105,
  'dept-2': 100,
  'dept-3': 100,
  'dept-4': 100,
  'dept-5': 100
};

export const store = {
  // Hospitals
  getHospitals: ({ city, specialty, query } = {}) => {
    let result = [...hospitals];
    if (city) {
      result = result.filter(h => h.city.toLowerCase() === city.toLowerCase());
    }
    if (specialty) {
      result = result.filter(h => h.specialties.some(s => s.toLowerCase() === specialty.toLowerCase()));
    }
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

  addDepartment: (deptData) => {
    const newDept = {
      id: `dept-${Date.now()}`,
      ...deptData
    };
    departments.push(newDept);
    return newDept;
  },

  // Users
  getUserByEmail: (email) => users.find(u => u.email.toLowerCase() === email.toLowerCase()),
  getUserById: (id) => users.find(u => u.id === id),

  addUser: (userData) => {
    const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) return existing;
    const newUser = {
      id: `user-${Date.now()}`,
      ...userData
    };
    users.push(newUser);
    return newUser;
  },

  // Receptionists
  getReceptionistByUserId: (userId) => receptionists.find(r => r.user_id === userId),

  // Tokens
  getTokensByHospital: (hospitalId, { departmentId, status } = {}) => {
    let list = tokens.filter(t => t.hospital_id === hospitalId);
    if (departmentId && departmentId !== 'all') {
      list = list.filter(t => t.department_id === departmentId);
    }
    if (status && status !== 'all') {
      list = list.filter(t => t.status === status);
    }
    return list;
  },

  getTokensByPatient: (patientId) => {
    return tokens.filter(t => t.patient_id === patientId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  getTokenById: (tokenId) => {
    const token = tokens.find(t => t.id === tokenId);
    if (!token) return null;

    const hospital = hospitals.find(h => h.id === token.hospital_id);
    const department = departments.find(d => d.id === token.department_id);

    // Compute live metrics: people ahead & current token being served
    const deptTokens = tokens.filter(t => t.department_id === token.department_id);
    const currentServing = deptTokens.find(t => t.status === 'in_progress' || t.status === 'called');

    // Count people ahead in 'waiting' status created before this token
    const waitingList = deptTokens
      .filter(t => t.status === 'waiting')
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    const tokenIndex = waitingList.findIndex(t => t.id === tokenId);
    const peopleAhead = tokenIndex >= 0 ? tokenIndex : 0;
    const avgTime = department ? department.avg_time_minutes : (hospital ? hospital.avg_consultation_minutes : 12);
    const estimatedWaitMinutes = (peopleAhead + (currentServing ? 1 : 0)) * avgTime;

    return {
      ...token,
      hospital_name: hospital ? hospital.name : 'Hospital',
      department_name: department ? department.name : 'General OPD',
      doctor_name: department ? department.doctor_name : 'Duty Doctor',
      room_no: department ? department.room_no : 'OPD-1',
      avg_time_minutes: avgTime,
      current_serving_token: currentServing ? currentServing.token_number : 'None',
      people_ahead: peopleAhead,
      estimated_wait_minutes: estimatedWaitMinutes
    };
  },

  createToken: ({ patient_id, patient_name, patient_phone, hospital_id, department_id, notes }) => {
    const dept = departments.find(d => d.id === department_id);
    const deptCode = dept ? dept.name.substring(0, 1).toUpperCase() : 'A';

    if (!deptCounters[department_id]) {
      deptCounters[department_id] = 100;
    }
    deptCounters[department_id] += 1;
    const num = deptCounters[department_id];
    const token_number = `${deptCode}-${num}`;

    const newToken = {
      id: `tok-${Date.now()}`,
      token_number,
      patient_id: patient_id || 'user-1',
      patient_name: patient_name || 'Rahul Sharma',
      patient_phone: patient_phone || '+91 9876543210',
      hospital_id,
      department_id,
      status: 'waiting',
      created_at: new Date().toISOString(),
      called_at: null,
      completed_at: null,
      notes: notes || 'General Consultation'
    };

    tokens.push(newToken);
    return store.getTokenById(newToken.id);
  },

  updateTokenStatus: (tokenId, status, extraFields = {}) => {
    const token = tokens.find(t => t.id === tokenId);
    if (!token) return null;

    token.status = status;
    if (status === 'called') {
      token.called_at = new Date().toISOString();
    } else if (status === 'completed' || status === 'no_show' || status === 'cancelled') {
      token.completed_at = new Date().toISOString();
    }
    Object.assign(token, extraFields);
    return store.getTokenById(tokenId);
  },

  callNextPatient: (hospitalId, departmentId) => {
    const deptTokens = tokens.filter(t => t.hospital_id === hospitalId && (!departmentId || departmentId === 'all' || t.department_id === departmentId));
    
    // First, complete any token that is currently 'in_progress' or 'called' if necessary, or just pick the first 'waiting'
    const waitingTokens = deptTokens
      .filter(t => t.status === 'waiting')
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    if (waitingTokens.length === 0) return null;

    // Mark current in_progress as completed if any
    deptTokens.filter(t => t.status === 'called' || t.status === 'in_progress').forEach(t => {
      t.status = 'completed';
      t.completed_at = new Date().toISOString();
    });

    const nextToken = waitingTokens[0];
    nextToken.status = 'called';
    nextToken.called_at = new Date().toISOString();

    return store.getTokenById(nextToken.id);
  },

  resetQueue: (hospitalId, departmentId) => {
    tokens = tokens.filter(t => !(t.hospital_id === hospitalId && (!departmentId || departmentId === 'all' || t.department_id === departmentId)));
    return true;
  },

  getQueueStats: (hospitalId) => {
    const hospTokens = tokens.filter(t => t.hospital_id === hospitalId);
    const total = hospTokens.length;
    const completed = hospTokens.filter(t => t.status === 'completed').length;
    const waiting = hospTokens.filter(t => t.status === 'waiting').length;
    const inProgress = hospTokens.filter(t => t.status === 'in_progress' || t.status === 'called').length;
    const skipped = hospTokens.filter(t => t.status === 'no_show').length;

    // Calculate average wait time for completed tokens
    let totalWaitMs = 0;
    let countWithWait = 0;
    hospTokens.filter(t => t.status === 'completed' && t.called_at).forEach(t => {
      const waitMs = new Date(t.called_at) - new Date(t.created_at);
      if (waitMs > 0) {
        totalWaitMs += waitMs;
        countWithWait++;
      }
    });

    const avgWaitMinutes = countWithWait > 0 ? Math.round((totalWaitMs / countWithWait) / (1000 * 60)) : 12;

    return {
      total,
      completed,
      waiting,
      inProgress,
      skipped,
      avgWaitMinutes
    };
  }
};
