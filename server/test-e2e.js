import http from 'http';
import app from './src/app.js';
import { initSocket } from './src/socket/socketHandler.js';

const TEST_PORT = 5099;
const BASE_URL = `http://localhost:${TEST_PORT}`;

let server;
let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🏥 MediQ Full-Stack End-to-End Functional Test Suite');
  console.log('======================================================\n');

  // Start test server
  server = http.createServer(app);
  initSocket(server);
  await new Promise((resolve) => server.listen(TEST_PORT, resolve));
  console.log(`Test server running on ${BASE_URL}\n`);

  try {
    // ------------------------------------------------------------------
    // TEST 1: Health Check
    // ------------------------------------------------------------------
    console.log('▶ Test Group 1: Server Health Check');
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200, 'Health check returns status 200');
    assert(healthData.status === 'ok', 'Health response payload status is "ok"');

    // ------------------------------------------------------------------
    // TEST 2: Authentication & RBAC Login for All Roles
    // ------------------------------------------------------------------
    console.log('\n▶ Test Group 2: Authentication & Role-Based Tokens');

    // Patient Signup
    const testPatientEmail = `patient_test_${Date.now()}@mediq.app`;
    const signupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Aarav Patel',
        email: testPatientEmail,
        phone: '+91 9988776655',
        password: 'password123',
        role: 'patient'
      })
    });
    const signupData = await signupRes.json();
    assert(signupRes.status === 201, 'Patient registration returns 201 Created');
    assert(signupData.token && signupData.user.role === 'patient', 'Patient receives valid JWT and role is patient');
    const patientToken = signupData.token;
    const patientUser = signupData.user;

    // Patient 2 Signup (for ownership cross-check)
    const patient2Res = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Simran Kaur',
        email: `simran_${Date.now()}@mediq.app`,
        phone: '+91 9123456789',
        password: 'password123',
        role: 'patient'
      })
    });
    const patient2Data = await patient2Res.json();
    const patient2Token = patient2Data.token;
    const patient2User = patient2Data.user;

    // Receptionist Login
    const recLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'priya@citycare.com', password: 'password123', role: 'receptionist' })
    });
    const recData = await recLoginRes.json();
    assert(recLoginRes.status === 200, 'Receptionist login returns 200 OK');
    assert(recData.user.role === 'receptionist', 'Receptionist role verified');
    const receptionistToken = recData.token;

    // Doctor Login
    const docLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'dr.sharma@citycare.com', password: 'password123', role: 'doctor' })
    });
    const docData = await docLoginRes.json();
    assert(docLoginRes.status === 200, 'Doctor login returns 200 OK');
    assert(docData.user.role === 'doctor', 'Doctor role verified');
    const doctorToken = docData.token;

    // Admin Login
    const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@citycare.com', password: 'password123', role: 'admin' })
    });
    const adminData = await adminLoginRes.json();
    assert(adminLoginRes.status === 200, 'Admin login returns 200 OK');
    assert(adminData.user.role === 'admin', 'Admin role verified');
    const adminToken = adminData.token;

    // Verify Session Endpoint (/api/auth/me)
    const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${patientToken}` }
    });
    const meData = await meRes.json();
    assert(meRes.status === 200, '/api/auth/me returns authenticated patient profile');
    assert(meData.user.id === patientUser.id, 'User ID matches decoded token session');

    // ------------------------------------------------------------------
    // TEST 3: Security & RBAC Boundary Protection
    // ------------------------------------------------------------------
    console.log('\n▶ Test Group 3: RBAC & Security Boundary Tests');

    // Unauthenticated request to protected route
    const unauthRes = await fetch(`${BASE_URL}/api/admin/users`);
    assert(unauthRes.status === 401, 'Unauthenticated request to admin endpoint rejected with 401');

    // Patient trying to access admin endpoint
    const patientAdminRes = await fetch(`${BASE_URL}/api/admin/users`, {
      headers: { 'Authorization': `Bearer ${patientToken}` }
    });
    assert(patientAdminRes.status === 403, 'Patient forbidden from admin endpoints (403)');

    // Patient trying to access doctor queue endpoint
    const patientDocRes = await fetch(`${BASE_URL}/api/doctor/doc-1/queue`, {
      headers: { 'Authorization': `Bearer ${patientToken}` }
    });
    assert(patientDocRes.status === 403, 'Patient forbidden from doctor queue endpoints (403)');

    // ------------------------------------------------------------------
    // TEST 4: Unified Hospital Queue & Token Generation
    // ------------------------------------------------------------------
    console.log('\n▶ Test Group 4: Unified Queue & Token Generation');

    // Online patient generates token
    const onlineTokenRes = await fetch(`${BASE_URL}/api/tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${patientToken}`
      },
      body: JSON.stringify({
        hospital_id: 'hosp-1',
        department_id: 'dept-1',
        notes: 'Mild chest discomfort'
      })
    });
    const onlineToken = await onlineTokenRes.json();
    assert(onlineTokenRes.status === 201, 'Online token creation returns 201 Created');
    assert(onlineToken.patient_type === 'online', 'Token patient_type is "online"');
    assert(onlineToken.status === 'waiting', 'Initial token status is "waiting"');
    const onlineTokenNum = parseInt(onlineToken.token_number);

    // Receptionist generates walk-in token
    const walkinTokenRes = await fetch(`${BASE_URL}/api/tokens/walkin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${receptionistToken}`
      },
      body: JSON.stringify({
        hospital_id: 'hosp-1',
        department_id: 'dept-1',
        patient_name: 'Walkin Visitor',
        patient_phone: '+91 9000011111',
        priority: 'NORMAL',
        notes: 'Walk-in checkup'
      })
    });
    const walkinToken = await walkinTokenRes.json();
    assert(walkinTokenRes.status === 201, 'Walk-in token creation returns 201 Created');
    assert(walkinToken.patient_type === 'walkin', 'Token patient_type is "walkin"');
    assert(walkinToken.status === 'waiting', 'Walk-in token status is "waiting"');
    const walkinTokenNum = parseInt(walkinToken.token_number);

    // Verify sequential token numbering in unified queue
    assert(walkinTokenNum === onlineTokenNum + 1, `Sequential token numbering verified: #${onlineTokenNum} followed by #${walkinTokenNum}`);

    // Verify token reference lookup
    const refRes = await fetch(`${BASE_URL}/api/tokens/ref/${onlineToken.ref_id}`);
    const refData = await refRes.json();
    assert(refRes.status === 200, 'QR reference ID lookup returns 200 OK');
    assert(refData.id === onlineToken.id, 'Looked up token matches original token ID');

    // ------------------------------------------------------------------
    // TEST 5: Receptionist & Doctor Queue Operations
    // ------------------------------------------------------------------
    console.log('\n▶ Test Group 5: Queue Lifecycle & Doctor Operations');

    // Receptionist assigns priority to walk-in patient
    const priorityRes = await fetch(`${BASE_URL}/api/tokens/${walkinToken.id}/priority`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${receptionistToken}`
      },
      body: JSON.stringify({ priority: 'PRIORITY', reason: 'Elderly patient with high blood pressure' })
    });
    const priorityData = await priorityRes.json();
    assert(priorityRes.status === 200, 'Receptionist can assign PRIORITY');
    assert(priorityData.priority === 'PRIORITY', 'Token priority updated to PRIORITY');

    // Doctor availability update
    const docStatusRes = await fetch(`${BASE_URL}/api/doctor/doc-1/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${doctorToken}`
      },
      body: JSON.stringify({ status: 'AVAILABLE' })
    });
    assert(docStatusRes.status === 200, 'Doctor can update availability status');

    // Receptionist calls next patient
    const callNextRes = await fetch(`${BASE_URL}/api/tokens/next/call`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${receptionistToken}`
      },
      body: JSON.stringify({ hospital_id: 'hosp-1', department_id: 'dept-1' })
    });
    const calledToken = await callNextRes.json();
    assert(callNextRes.status === 200, 'Receptionist call-next returns 200 OK');
    assert(calledToken.status === 'called', 'Called token status is "called"');

    // Doctor starts consultation
    const startConsRes = await fetch(`${BASE_URL}/api/tokens/${calledToken.id}/start-consultation`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${doctorToken}`
      }
    });
    const startedToken = await startConsRes.json();
    assert(startConsRes.status === 200, 'Doctor start-consultation returns 200 OK');
    assert(startedToken.status === 'in_consultation', 'Token status is "in_consultation"');

    // ------------------------------------------------------------------
    // TEST 6: Digital Patient File & Doctor Remarks
    // ------------------------------------------------------------------
    console.log('\n▶ Test Group 6: Digital Patient File & Consultation Remarks');

    // Doctor saves consultation remarks
    const saveConsRes = await fetch(`${BASE_URL}/api/consultations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${doctorToken}`
      },
      body: JSON.stringify({
        patient_id: calledToken.patient_id || patientUser.id,
        doctor_id: docData.user.id,
        doctor_name: 'Dr. Rajesh Sharma',
        queue_token_id: calledToken.id,
        token_number: calledToken.token_number,
        department_id: 'dept-1',
        department_name: 'Cardiology',
        hospital_id: 'hosp-1',
        hospital_name: 'City Care Hospital',
        chief_complaint: 'Chest heaviness after meals',
        symptoms: 'Mild pain, normal breathing',
        observations: 'BP: 125/82, ECG: Normal Sinus Rhythm',
        diagnosis: 'Non-cardiac chest discomfort / Reflux',
        treatment_advice: 'Antacid course for 5 days, avoid oily food',
        prescription_notes: 'Tab Pantoprazole 40mg OD before breakfast'
      })
    });
    const saveConsData = await saveConsRes.json();
    assert(saveConsRes.status === 201, 'Doctor remarks saved successfully (201 Created)');
    assert(saveConsData.consultation.diagnosis === 'Non-cardiac chest discomfort / Reflux', 'Diagnosis accurately recorded');

    // Check doctor patient search
    const searchRes = await fetch(`${BASE_URL}/api/consultations/search?query=Rahul`, {
      headers: { 'Authorization': `Bearer ${doctorToken}` }
    });
    const searchData = await searchRes.json();
    assert(searchRes.status === 200, 'Doctor can search patient records (200 OK)');
    assert(Array.isArray(searchData), 'Search returns array of patient matches');

    // Patient CANNOT save remarks
    const patientConsRes = await fetch(`${BASE_URL}/api/consultations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${patientToken}`
      },
      body: JSON.stringify({
        patient_id: patientUser.id,
        chief_complaint: 'Self-diagnosed issue'
      })
    });
    assert(patientConsRes.status === 403, 'Patient forbidden from writing consultation remarks (403)');

    // Patient CANNOT view another patient's medical file
    const otherPatientRes = await fetch(`${BASE_URL}/api/consultations/patient/${patient2User.id}`, {
      headers: { 'Authorization': `Bearer ${patientToken}` }
    });
    assert(otherPatientRes.status === 403, 'Patient cannot access another patient\'s medical file (403)');

    // Receptionist CANNOT view medical records
    const recFileRes = await fetch(`${BASE_URL}/api/consultations/patient/${patientUser.id}`, {
      headers: { 'Authorization': `Bearer ${receptionistToken}` }
    });
    assert(recFileRes.status === 403, 'Receptionist cannot access patient clinical records (403)');

    // ------------------------------------------------------------------
    // TEST 7: Patient Intent & Ownership Cancellation
    // ------------------------------------------------------------------
    console.log('\n▶ Test Group 7: Patient Intent & Cancellation Security');

    // Patient 2 generates a token
    const p2TokenRes = await fetch(`${BASE_URL}/api/tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${patient2Token}`
      },
      body: JSON.stringify({
        hospital_id: 'hosp-1',
        department_id: 'dept-1',
        notes: 'Follow-up visit'
      })
    });
    const p2Token = await p2TokenRes.json();

    // Patient 1 tries to cancel Patient 2's token -> should be rejected!
    const crossCancelRes = await fetch(`${BASE_URL}/api/tokens/${p2Token.id}/cancel`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${patientToken}` }
    });
    assert(crossCancelRes.status === 403, 'Patient cannot cancel another patient\'s token (403)');

    // Patient 2 updates own intent ("on_my_way")
    const intentRes = await fetch(`${BASE_URL}/api/tokens/${p2Token.id}/intent`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${patient2Token}`
      },
      body: JSON.stringify({ intent_status: 'on_my_way' })
    });
    const intentData = await intentRes.json();
    assert(intentRes.status === 200, 'Patient can update their own intent to "on_my_way"');
    assert(intentData.intent_status === 'on_my_way', 'Intent status updated');

    // Patient 2 cancels own token
    const selfCancelRes = await fetch(`${BASE_URL}/api/tokens/${p2Token.id}/cancel`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${patient2Token}` }
    });
    const selfCancelData = await selfCancelRes.json();
    assert(selfCancelRes.status === 200, 'Patient can cancel their own token');
    assert(selfCancelData.status === 'cancelled', 'Token status transitioned to "cancelled"');

    // ------------------------------------------------------------------
    // TEST 8: Admin Governance & Department Control
    // ------------------------------------------------------------------
    console.log('\n▶ Test Group 8: Admin Governance, Analytics & Departments');

    // Admin Analytics
    const analyticsRes = await fetch(`${BASE_URL}/api/admin/analytics?hospitalId=hosp-1`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const analyticsData = await analyticsRes.json();
    assert(analyticsRes.status === 200, 'Admin can fetch operational analytics (200 OK)');
    assert(typeof analyticsData.totalTokens === 'number', 'Analytics contains totalTokens count');

    // Admin Audit Logs
    const auditRes = await fetch(`${BASE_URL}/api/admin/audit-logs?limit=10`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const auditData = await auditRes.json();
    assert(auditRes.status === 200, 'Admin can fetch immutable audit logs (200 OK)');
    assert(Array.isArray(auditData) && auditData.length > 0, 'Audit logs contains state transition records');

    // Admin Users Management
    const usersRes = await fetch(`${BASE_URL}/api/admin/users`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const usersData = await usersRes.json();
    assert(usersRes.status === 200, 'Admin can list registered users');

    // Admin updates user role
    const roleRes = await fetch(`${BASE_URL}/api/admin/users/${patientUser.id}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ role: 'patient' })
    });
    assert(roleRes.status === 200, 'Admin can update user roles');

    // Admin Department Management: Pause & Resume
    const pauseDeptRes = await fetch(`${BASE_URL}/api/admin/departments/dept-1/pause`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ is_paused: true, reason: 'Department deep clean' })
    });
    const pausedDept = await pauseDeptRes.json();
    assert(pauseDeptRes.status === 200, 'Admin can pause department queue');
    assert(pausedDept.is_paused === true, 'Department pause state is true');

    // Resume Department
    const resumeDeptRes = await fetch(`${BASE_URL}/api/admin/departments/dept-1/pause`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ is_paused: false, reason: null })
    });
    const resumedDept = await resumeDeptRes.json();
    assert(resumeDeptRes.status === 200, 'Admin can resume department queue');
    assert(resumedDept.is_paused === false, 'Department pause state is false');

    console.log('\n======================================================');
    console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED SUCCESSFULLY!`);
    console.log('======================================================\n');

  } catch (err) {
    console.error('\n❌ Test run failed with error:', err);
    process.exitCode = 1;
  } finally {
    if (server) {
      server.close();
      console.log('Test server shut down.');
    }
  }
}

runTests();
