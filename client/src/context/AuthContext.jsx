import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const DEMO_ACCOUNTS = {
  patient: {
    id: 'user-1',
    full_name: 'Rahul Sharma',
    email: 'patient@mediq.com',
    phone: '+91 9876543210',
    role: 'patient'
  },
  receptionist: {
    id: 'rec-user-1',
    full_name: 'Priya Singh',
    email: 'receptionist@cityhospital.com',
    phone: '+91 9811223344',
    role: 'receptionist',
    hospital_id: 'hosp-1',
    department_id: 'dept-1'
  },
  doctor: {
    id: 'doc-user-1',
    doctor_id: 'doc-1',
    full_name: 'Dr. Rajesh Sharma',
    email: 'doctor@cityhospital.com',
    phone: '+91 9822334455',
    role: 'doctor',
    hospital_id: 'hosp-1',
    department_id: 'dept-1'
  },
  admin: {
    id: 'admin-user-1',
    full_name: 'System Admin',
    email: 'admin@mediq.com',
    phone: '+91 9999988888',
    role: 'admin'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mediq_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('mediq_jwt_token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('mediq_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mediq_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('mediq_jwt_token', token);
    } else {
      localStorage.removeItem('mediq_jwt_token');
    }
  }, [token]);

  const loginWithDemo = (roleKey) => {
    const demoUser = DEMO_ACCOUNTS[roleKey] || DEMO_ACCOUNTS.patient;
    const mockToken = `demo_jwt_token_${roleKey}_${Date.now()}`;
    setUser(demoUser);
    setToken(mockToken);
    return demoUser;
  };

  const login = async (email, password, role) => {
    setLoading(true);
    try {
      // Find matching demo account or create session
      let matchedRole = 'patient';
      if (email.includes('receptionist')) matchedRole = 'receptionist';
      else if (email.includes('doctor')) matchedRole = 'doctor';
      else if (email.includes('admin')) matchedRole = 'admin';

      const demoUser = DEMO_ACCOUNTS[matchedRole] || {
        id: `user-${Date.now()}`,
        full_name: email.split('@')[0].replace('.', ' '),
        email,
        phone: '+91 9876543210',
        role: role || matchedRole
      };

      const jwtToken = `jwt_token_${Date.now()}`;
      setUser(demoUser);
      setToken(jwtToken);
      setLoading(false);
      return { success: true, user: demoUser };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('mediq_user');
    localStorage.removeItem('mediq_jwt_token');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      loginWithDemo,
      logout,
      isAuthenticated: Boolean(user),
      isPatient: user?.role === 'patient',
      isReceptionist: user?.role === 'receptionist',
      isDoctor: user?.role === 'doctor',
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
