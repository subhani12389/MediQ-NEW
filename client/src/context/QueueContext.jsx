import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { socket } from '../lib/socket';
import { apiFetch } from '../lib/api';
import { useAuth } from './AuthContext';
import { playTokenChime, playEmergencyAlert } from '../utils/audioAlert';

const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
  const { user } = useAuth();

  const [activeToken, setActiveToken] = useState(null);
  const [hospitalQueue, setHospitalQueue] = useState([]);
  const [queueStats, setQueueStats] = useState({
    totalTokens: 0,
    completedTokens: 0,
    waitingTokens: 0,
    inConsultationTokens: 0,
    cancelledTokens: 0,
    noShowTokens: 0,
    avgWaitMinutes: 14,
    avgConsultationMinutes: 12
  });
  const [isDeptPaused, setIsDeptPaused] = useState(false);
  const [pauseReason, setPauseReason] = useState(null);
  const [doctorStatus, setDoctorStatus] = useState('AVAILABLE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Token Details
  const fetchTokenStatus = useCallback(async (tokenId) => {
    if (!tokenId) return;
    try {
      const res = await apiFetch(`/api/tokens/${tokenId}`);
      if (res.ok) {
        const data = await res.json();
        setActiveToken(data);
        setIsDeptPaused(Boolean(data.is_dept_paused));
        setPauseReason(data.dept_pause_reason);
        setDoctorStatus(data.doctor_status || 'AVAILABLE');
      }
    } catch (err) {
      console.warn('Token status fetch error:', err.message);
    }
  }, []);

  // Fetch Receptionist / Department Queue
  const fetchHospitalQueue = useCallback(async (hospitalId = 'hosp-1', departmentId = 'all', status = 'all') => {
    try {
      const res = await apiFetch(`/api/receptionist/${hospitalId}/queue?departmentId=${departmentId}&status=${status}`);
      if (res.ok) {
        const data = await res.json();
        setHospitalQueue(data.queue || []);
        if (data.stats) setQueueStats(data.stats);
      }
    } catch (err) {
      console.warn('Queue fetch error:', err.message);
    }
  }, []);

  // Select / Track Active Token
  const selectActiveToken = useCallback((tokenId) => {
    if (tokenId) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('mediq_active_token_id', tokenId);
      }
      fetchTokenStatus(tokenId);
      socket.emit('join_token', tokenId);
    }
  }, [fetchTokenStatus]);

  // Initial Load & Dynamic Resolution when User Changes
  useEffect(() => {
    const resolveActiveToken = async () => {
      // 1. If user is logged in as a patient, check their live tokens
      if (user && user.role === 'patient') {
        try {
          const res = await apiFetch(`/api/tokens/patient/${user.id}`);
          if (res.ok) {
            const userTokens = await res.json();
            if (Array.isArray(userTokens) && userTokens.length > 0) {
              // Find first waiting, called, or in_consultation token
              const active = userTokens.find(t => ['waiting', 'called', 'in_consultation'].includes(t.status)) || userTokens[0];
              if (active) {
                selectActiveToken(active.id);
                return;
              }
            }
          }
        } catch (e) {
          console.warn('Could not fetch patient active tokens:', e.message);
        }
      }

      // 2. Check localStorage saved token ID
      const savedTokenId = typeof window !== 'undefined' ? localStorage.getItem('mediq_active_token_id') : null;
      if (savedTokenId) {
        fetchTokenStatus(savedTokenId);
      } else {
        // Fallback demo token for non-authenticated exploration
        fetchTokenStatus('tok-103');
      }
    };

    resolveActiveToken();
    fetchHospitalQueue('hosp-1');
  }, [user, fetchTokenStatus, fetchHospitalQueue, selectActiveToken]);

  // Setup Real-time Socket.IO Listeners
  useEffect(() => {
    socket.emit('join_hospital', 'hosp-1');
    socket.emit('join_department', 'dept-1');

    const handleQueueUpdate = (event) => {
      console.log('⚡ [Socket.IO] Real-time queue event received:', event);

      if (event.type === 'TOKEN_CALLED') {
        playTokenChime();
      } else if (event.type === 'PRIORITY_ASSIGNED' && event.token?.priority === 'EMERGENCY') {
        playEmergencyAlert();
      }

      // Refresh queue state automatically without page refresh
      fetchHospitalQueue('hosp-1');
      if (activeToken?.id) {
        fetchTokenStatus(activeToken.id);
      }
    };

    socket.on('queue_updated', handleQueueUpdate);
    socket.on('global_queue_event', handleQueueUpdate);
    socket.on('token_status_changed', handleQueueUpdate);

    return () => {
      socket.off('queue_updated', handleQueueUpdate);
      socket.off('global_queue_event', handleQueueUpdate);
      socket.off('token_status_changed', handleQueueUpdate);
    };
  }, [fetchHospitalQueue, fetchTokenStatus, activeToken]);

  // Token Actions
  const generateToken = async (tokenData) => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/tokens', {
        method: 'POST',
        body: JSON.stringify(tokenData)
      });
      if (res.ok) {
        const newToken = await res.json();
        setActiveToken(newToken);
        if (typeof window !== 'undefined') {
          localStorage.setItem('mediq_active_token_id', newToken.id);
        }
        socket.emit('join_token', newToken.id);
        fetchHospitalQueue(tokenData.hospital_id || 'hosp-1');
        setLoading(false);
        return { success: true, token: newToken };
      }
      const errData = await res.json().catch(() => ({}));
      setLoading(false);
      return { success: false, error: errData.error || 'Failed to generate token' };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const createWalkInToken = async (tokenData) => {
    try {
      const res = await apiFetch('/api/tokens/walkin', {
        method: 'POST',
        body: JSON.stringify(tokenData)
      });
      if (res.ok) {
        const token = await res.json();
        fetchHospitalQueue(tokenData.hospital_id || 'hosp-1');
        return { success: true, token };
      }
      const errData = await res.json().catch(() => ({}));
      return { success: false, error: errData.error || 'Failed to create walk-in token' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const callNextPatient = async (hospitalId = 'hosp-1', departmentId = 'all') => {
    try {
      const res = await apiFetch('/api/tokens/next/call', {
        method: 'PATCH',
        body: JSON.stringify({ hospital_id: hospitalId, department_id: departmentId })
      });
      if (res.ok) {
        const calledToken = await res.json();
        playTokenChime();
        fetchHospitalQueue(hospitalId);
        return { success: true, token: calledToken };
      }
      const errData = await res.json().catch(() => ({}));
      return { success: false, error: errData.error || errData.message || 'No waiting patients' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const startConsultation = async (tokenId) => {
    try {
      const res = await apiFetch(`/api/tokens/${tokenId}/start-consultation`, { method: 'PATCH' });
      if (res.ok) {
        const token = await res.json();
        fetchHospitalQueue('hosp-1');
        return { success: true, token };
      }
      return { success: false };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const completeToken = async (tokenId) => {
    try {
      const res = await apiFetch(`/api/tokens/${tokenId}/complete`, { method: 'PATCH' });
      if (res.ok) {
        fetchHospitalQueue('hosp-1');
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const skipToken = async (tokenId) => {
    try {
      const res = await apiFetch(`/api/tokens/${tokenId}/skip`, { method: 'PATCH' });
      if (res.ok) {
        fetchHospitalQueue('hosp-1');
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const cancelToken = async (tokenId) => {
    try {
      const res = await apiFetch(`/api/tokens/${tokenId}/cancel`, { method: 'PATCH' });
      if (res.ok) {
        fetchHospitalQueue('hosp-1');
        if (activeToken?.id === tokenId) {
          setActiveToken(prev => prev ? { ...prev, status: 'cancelled' } : null);
        }
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updatePatientIntent = async (tokenId, intentStatus) => {
    try {
      const res = await apiFetch(`/api/tokens/${tokenId}/intent`, {
        method: 'PATCH',
        body: JSON.stringify({ intent_status: intentStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setActiveToken(updated);
        fetchHospitalQueue('hosp-1');
        return { success: true, token: updated };
      }
      return { success: false };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const assignTokenPriority = async (tokenId, priority, reason) => {
    try {
      const res = await apiFetch(`/api/tokens/${tokenId}/priority`, {
        method: 'PATCH',
        body: JSON.stringify({ priority, reason })
      });
      if (res.ok) {
        const updated = await res.json();
        fetchHospitalQueue('hosp-1');
        return { success: true, token: updated };
      }
      return { success: false };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const togglePauseQueue = async (hospitalId = 'hosp-1', departmentId = 'dept-1', isPaused, reason = '') => {
    try {
      const res = await apiFetch(`/api/receptionist/${hospitalId}/pause`, {
        method: 'POST',
        body: JSON.stringify({ department_id: departmentId, is_paused: isPaused, reason })
      });
      if (res.ok) {
        setIsDeptPaused(isPaused);
        setPauseReason(reason);
        fetchHospitalQueue(hospitalId);
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateDoctorStatus = async (doctorId = 'doc-1', status) => {
    try {
      const res = await apiFetch(`/api/doctor/${doctorId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setDoctorStatus(status);
        fetchHospitalQueue('hosp-1');
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <QueueContext.Provider value={{
      activeToken,
      hospitalQueue,
      queueStats,
      isDeptPaused,
      pauseReason,
      doctorStatus,
      loading,
      error,
      fetchTokenStatus,
      fetchHospitalQueue,
      selectActiveToken,
      generateToken,
      createWalkInToken,
      callNextPatient,
      startConsultation,
      completeToken,
      skipToken,
      cancelToken,
      updatePatientIntent,
      assignTokenPriority,
      togglePauseQueue,
      updateDoctorStatus
    }}>
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => useContext(QueueContext);
