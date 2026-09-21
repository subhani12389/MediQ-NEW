import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { socket } from '../lib/socket';
import { playTokenChime, playEmergencyAlert } from '../utils/audioAlert';

const QueueContext = createContext();

const API_BASE = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');

export const QueueProvider = ({ children }) => {
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
  const fetchTokenStatus = useCallback(async (tokenId = 'tok-103') => {
    try {
      const res = await fetch(`${API_BASE}/api/tokens/${tokenId}`);
      if (res.ok) {
        const data = await res.json();
        setActiveToken(data);
        setIsDeptPaused(Boolean(data.is_dept_paused));
        setPauseReason(data.dept_pause_reason);
        setDoctorStatus(data.doctor_status || 'AVAILABLE');
      }
    } catch (err) {
      console.warn('Backend fetch fallback:', err.message);
    }
  }, []);

  // Fetch Receptionist Queue
  const fetchHospitalQueue = useCallback(async (hospitalId = 'hosp-1', departmentId = 'all', status = 'all') => {
    try {
      const res = await fetch(`${API_BASE}/api/receptionist/${hospitalId}/queue?departmentId=${departmentId}&status=${status}`);
      if (res.ok) {
        const data = await res.json();
        setHospitalQueue(data.queue || []);
        if (data.stats) setQueueStats(data.stats);
      }
    } catch (err) {
      console.warn('Queue fetch error:', err.message);
    }
  }, []);

  // Setup Real-time Socket.IO Listeners
  useEffect(() => {
    // Join default rooms
    socket.emit('join_hospital', 'hosp-1');
    socket.emit('join_department', 'dept-1');

    const handleQueueUpdate = (event) => {
      console.log('⚡ [Socket.IO] Real-time queue event received:', event);

      if (event.type === 'TOKEN_CALLED') {
        playTokenChime();
      } else if (event.type === 'PRIORITY_ASSIGNED' && event.token?.priority === 'EMERGENCY') {
        playEmergencyAlert();
      }

      // Re-fetch state automatically without page refresh
      fetchHospitalQueue('hosp-1');
      if (activeToken) {
        fetchTokenStatus(activeToken.id);
      } else {
        fetchTokenStatus('tok-103');
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

  // Initial Load
  useEffect(() => {
    fetchTokenStatus('tok-103');
    fetchHospitalQueue('hosp-1');
  }, [fetchTokenStatus, fetchHospitalQueue]);

  // Token Actions
  const generateToken = async (tokenData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/tokens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tokenData)
      });
      if (res.ok) {
        const newToken = await res.json();
        setActiveToken(newToken);
        socket.emit('join_token', newToken.id);
        fetchHospitalQueue(tokenData.hospital_id || 'hosp-1');
        setLoading(false);
        return { success: true, token: newToken };
      }
      setLoading(false);
      return { success: false, error: 'Failed to generate token' };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const createWalkInToken = async (tokenData) => {
    try {
      const res = await fetch(`${API_BASE}/api/tokens/walkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tokenData)
      });
      if (res.ok) {
        const token = await res.json();
        fetchHospitalQueue(tokenData.hospital_id || 'hosp-1');
        return { success: true, token };
      }
      return { success: false, error: 'Failed to create walk-in token' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const callNextPatient = async (hospitalId = 'hosp-1', departmentId = 'all') => {
    try {
      const res = await fetch(`${API_BASE}/api/tokens/next/call`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hospital_id: hospitalId, department_id: departmentId })
      });
      if (res.ok) {
        const calledToken = await res.json();
        playTokenChime();
        fetchHospitalQueue(hospitalId);
        return { success: true, token: calledToken };
      }
      return { success: false, error: 'No waiting patients' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const startConsultation = async (tokenId) => {
    try {
      const res = await fetch(`${API_BASE}/api/tokens/${tokenId}/start-consultation`, { method: 'PATCH' });
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
      const res = await fetch(`${API_BASE}/api/tokens/${tokenId}/complete`, { method: 'PATCH' });
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
      const res = await fetch(`${API_BASE}/api/tokens/${tokenId}/skip`, { method: 'PATCH' });
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
      const res = await fetch(`${API_BASE}/api/tokens/${tokenId}/cancel`, { method: 'PATCH' });
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
      const res = await fetch(`${API_BASE}/api/tokens/${tokenId}/intent`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch(`${API_BASE}/api/tokens/${tokenId}/priority`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch(`${API_BASE}/api/receptionist/${hospitalId}/pause`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch(`${API_BASE}/api/doctor/${doctorId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
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
