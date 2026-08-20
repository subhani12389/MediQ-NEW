import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const demoAccounts = {
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
    hospital_name: 'City Care Super Specialty Hospital',
    department_id: 'dept-1',
    department_name: 'Cardiology'
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
  // Start unauthenticated by default unless saved in localStorage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mediq_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('mediq_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mediq_user');
    }
  }, [user]);

  // Regular Login
  const login = async (email, password, role = 'patient') => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });

      const data = await res.json();
      if (res.ok && data.user) {
        let loggedUser = data.user;
        if (loggedUser.role === 'receptionist' && data.receptionist_info) {
          loggedUser = { ...loggedUser, ...data.receptionist_info };
        }
        setUser(loggedUser);
        setLoading(false);
        return { success: true, user: loggedUser };
      } else {
        setLoading(false);
        return { success: false, error: data.error || 'Invalid credentials' };
      }
    } catch (err) {
      console.warn('API login failed, checking demo fallback:', err);
      // Fallback check
      let target = null;
      if (email.includes('receptionist')) target = demoAccounts.receptionist;
      else if (email.includes('admin')) target = demoAccounts.admin;
      else target = { id: `user-${Date.now()}`, full_name: email.split('@')[0], email, phone: '+91 9876543210', role };

      setUser(target);
      setLoading(false);
      return { success: true, user: target };
    }
  };

  // Quick 1-Click Demo Login
  const demoLogin = (role) => {
    const account = demoAccounts[role] || demoAccounts.patient;
    setUser(account);
    return account;
  };

  // Signup
  const signup = async (full_name, email, phone, password, role = 'patient') => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name, email, phone, password, role })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setLoading(false);
        return { success: true, user: data.user };
      }
    } catch (err) {
      console.warn('API signup failed:', err);
    }
    const newUser = { id: `user-${Date.now()}`, full_name, email, phone, role };
    setUser(newUser);
    setLoading(false);
    return { success: true, user: newUser };
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('mediq_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, demoLogin, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
