import { store } from '../data/store.js';
import { generateJWT } from '../config/jwt.js';

export const signup = async (req, res) => {
  try {
    const { full_name, email, phone, role = 'patient', password } = req.body;

    if (!email || !full_name) {
      return res.status(400).json({ error: 'Full name and email are required' });
    }

    const user = store.addUser({ full_name, email, phone, role });
    const token = generateJWT(user);

    return res.status(201).json({
      message: 'Signup successful',
      user,
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Server error during signup' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    let user = store.getUserByEmail(email);

    if (!user) {
      user = store.addUser({
        full_name: email.split('@')[0].replace('.', ' '),
        email,
        phone: '+91 9876543210',
        role: role || (email.includes('receptionist') ? 'receptionist' : email.includes('doctor') ? 'doctor' : email.includes('admin') ? 'admin' : 'patient')
      });
    }

    let receptionistInfo = null;
    if (user.role === 'receptionist') {
      receptionistInfo = store.getReceptionistByUserId(user.id) || {
        id: 'rec-1',
        user_id: user.id,
        hospital_id: 'hosp-1',
        department_id: 'dept-1'
      };
      user = { ...user, ...receptionistInfo };
    }

    let doctorInfo = null;
    if (user.role === 'doctor') {
      doctorInfo = store.getDoctors({ hospitalId: 'hosp-1' }).find(d => d.user_id === user.id || d.email === email) || {
        id: 'doc-1',
        name: user.full_name,
        hospital_id: 'hosp-1',
        department_id: 'dept-1',
        status: 'AVAILABLE'
      };
      user = { ...user, ...doctorInfo };
    }

    const jwtToken = generateJWT(user);

    return res.json({
      message: 'Login successful',
      user,
      token: jwtToken
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error during login' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = store.getUserById(req.user.id);
    if (!user) return res.status(444).json({ error: 'User profile not found' });
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};
