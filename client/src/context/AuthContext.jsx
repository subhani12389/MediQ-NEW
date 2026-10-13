import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_BASE = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');

export const DEMO_EMAILS = {
  patient: 'patient@mediq.com',
  receptionist: 'receptionist@cityhospital.com',
  doctor: 'doctor@cityhospital.com',
  admin: 'admin@mediq.com'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mediq_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('mediq_jwt_token') || null;
  });

  const [loading, setLoading] = useState(false);

  // Sync state to localStorage
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

  // Verify session on initial app mount
  useEffect(() => {
    const verifySession = async () => {
      const currentToken = localStorage.getItem('mediq_jwt_token');
      if (!currentToken) return;

      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user) setUser(data.user);
        } else if (res.status === 401) {
          // Token expired or invalid
          logout();
        }
      } catch (err) {
        console.warn('Session verification fallback (offline mode):', err.message);
      }
    };

    verifySession();
  }, []);

  const login = async (email, password, role) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
        setLoading(false);
        return { success: true, user: data.user };
      } else {
        const errorData = await res.json().catch(() => ({}));
        setLoading(false);
        return { success: false, error: errorData.error || 'Invalid credentials' };
      }
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const loginWithDemo = async (roleKey) => {
    const email = DEMO_EMAILS[roleKey] || DEMO_EMAILS.patient;
    return await login(email, 'demo1234', roleKey);
  };

  const signup = async (fullName, email, phone, password, role = 'patient') => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, phone, password, role })
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
        setLoading(false);
        return { success: true, user: data.user };
      } else {
        const errData = await res.json().catch(() => ({}));
        setLoading(false);
        return { success: false, error: errData.error || 'Registration failed' };
      }
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
    localStorage.removeItem('mediq_active_token_id');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      loginWithDemo,
      signup,
      logout,
      isAuthenticated: Boolean(user && token),
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
