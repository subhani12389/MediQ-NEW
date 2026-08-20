import { store } from '../data/store.js';
import { supabase, isSupabaseConfigured } from '../config/supabaseClient.js';

export const generateToken = async (req, res) => {
  try {
    const { patient_id, patient_name, patient_phone, hospital_id, department_id, notes } = req.body;

    if (!hospital_id || !department_id) {
      return res.status(400).json({ error: 'Hospital ID and Department ID are required' });
    }

    if (isSupabaseConfigured) {
      const { count } = await supabase
        .from('tokens')
        .select('*', { count: 'exact', head: true })
        .eq('department_id', department_id);

      const tokenNum = `T-${(count || 0) + 101}`;

      const { data, error } = await supabase
        .from('tokens')
        .insert([{
          token_number: tokenNum,
          patient_id: patient_id || null,
          hospital_id,
          department_id,
          status: 'waiting',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (!error && data) return res.status(201).json(data);
    }

    const token = store.createToken({
      patient_id,
      patient_name,
      patient_phone,
      hospital_id,
      department_id,
      notes
    });

    return res.status(201).json(token);
  } catch (error) {
    console.error('Generate token error:', error);
    return res.status(500).json({ error: 'Failed to generate token' });
  }
};

export const getTokenById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('tokens')
        .select('*, hospital:hospitals(name), department:departments(name, avg_time_minutes, doctor_name)')
        .eq('id', id)
        .single();
      if (!error && data) return res.json(data);
    }

    const token = store.getTokenById(id);
    if (!token) return res.status(404).json({ error: 'Token not found' });
    return res.json(token);
  } catch (error) {
    console.error('Get token by ID error:', error);
    return res.status(500).json({ error: 'Failed to fetch token status' });
  }
};

export const getPatientTokens = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('tokens')
        .select('*, hospital:hospitals(name), department:departments(name, doctor_name)')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (!error && data) return res.json(data);
    }

    const tokens = store.getTokensByPatient(patientId);
    return res.json(tokens);
  } catch (error) {
    console.error('Get patient tokens error:', error);
    return res.status(500).json({ error: 'Failed to fetch patient tokens' });
  }
};

export const callNextToken = async (req, res) => {
  try {
    const { id } = req.params;
    const { hospital_id, department_id } = req.body;

    if (id === 'next' || !id) {
      const calledToken = store.callNextPatient(hospital_id, department_id);
      if (!calledToken) return res.status(404).json({ message: 'No waiting patients in queue' });
      return res.json(calledToken);
    }

    const updated = store.updateTokenStatus(id, 'called');
    if (!updated) return res.status(404).json({ error: 'Token not found' });
    return res.json(updated);
  } catch (error) {
    console.error('Call token error:', error);
    return res.status(500).json({ error: 'Failed to call token' });
  }
};

export const completeToken = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = store.updateTokenStatus(id, 'completed');
    if (!updated) return res.status(404).json({ error: 'Token not found' });
    return res.json(updated);
  } catch (error) {
    console.error('Complete token error:', error);
    return res.status(500).json({ error: 'Failed to complete token' });
  }
};

export const skipToken = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = store.updateTokenStatus(id, 'no_show');
    if (!updated) return res.status(404).json({ error: 'Token not found' });
    return res.json(updated);
  } catch (error) {
    console.error('Skip token error:', error);
    return res.status(500).json({ error: 'Failed to skip token' });
  }
};

export const cancelToken = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = store.updateTokenStatus(id, 'cancelled');
    if (!updated) return res.status(404).json({ error: 'Token not found' });
    return res.json(updated);
  } catch (error) {
    console.error('Cancel token error:', error);
    return res.status(500).json({ error: 'Failed to cancel token' });
  }
};

export const generateWalkInToken = async (req, res) => {
  try {
    const { patient_name, patient_phone, hospital_id, department_id, notes } = req.body;

    const token = store.createToken({
      patient_id: `walkin-${Date.now()}`,
      patient_name: patient_name || 'Walk-in Patient',
      patient_phone: patient_phone || 'N/A',
      hospital_id,
      department_id,
      notes: notes ? `[Walk-in] ${notes}` : '[Walk-in Token]'
    });

    return res.status(201).json(token);
  } catch (error) {
    console.error('Walk-in token error:', error);
    return res.status(500).json({ error: 'Failed to generate walk-in token' });
  }
};
