import { store } from '../data/store.js';
import { supabase, isSupabaseConfigured } from '../config/supabaseClient.js';

export const signup = async (req, res) => {
  try {
    const { full_name, email, phone, role = 'patient', password } = req.body;

    if (!email || !full_name) {
      return res.status(400).json({ error: 'Full name and email are required' });
    }

    if (isSupabaseConfigured) {
      // Supabase auth signup
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: password || 'MediQSecret123!',
        options: {
          data: { full_name, phone, role }
        }
      });

      if (authError) {
        return res.status(400).json({ error: authError.message });
      }

      // Insert record into custom users table
      const { data: userRecord, error: userError } = await supabase
        .from('users')
        .insert([{ id: authData.user.id, full_name, email, phone, role }])
        .select()
        .single();

      return res.status(201).json({
        message: 'Signup successful',
        user: userRecord || { id: authData.user.id, full_name, email, phone, role }
      });
    }

    // Fallback store signup
    const user = store.addUser({ full_name, email, phone, role });
    return res.status(201).json({
      message: 'Signup successful',
      user
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

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: password || 'MediQSecret123!'
      });

      if (error) {
        return res.status(401).json({ error: error.message });
      }

      // Fetch user profile from custom users table
      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      return res.json({
        message: 'Login successful',
        user: userProfile || { id: data.user.id, email: data.user.email, role: data.user.user_metadata?.role || 'patient' },
        session: data.session
      });
    }

    // Fallback store login
    let user = store.getUserByEmail(email);

    if (!user) {
      // Auto-create user for frictionless demo login if not existing
      user = store.addUser({
        full_name: email.split('@')[0].replace('.', ' '),
        email,
        phone: '+91 9876543210',
        role: role || (email.includes('receptionist') ? 'receptionist' : email.includes('admin') ? 'admin' : 'patient')
      });
    }

    // Attach receptionist metadata if user is a receptionist
    let receptionistInfo = null;
    if (user.role === 'receptionist') {
      receptionistInfo = store.getReceptionistByUserId(user.id) || {
        id: 'rec-1',
        user_id: user.id,
        hospital_id: 'hosp-1',
        department_id: 'dept-1'
      };
    }

    return res.json({
      message: 'Login successful',
      user,
      receptionist_info: receptionistInfo
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error during login' });
  }
};
