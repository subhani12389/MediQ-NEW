import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { playChimeAlert } from '../utils/audioAlert';

const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
  const [activeToken, setActiveToken] = useState(null);
  const [activeTokenId, setActiveTokenId] = useState(() => localStorage.getItem('mediq_active_token_id') || 'tok-103');
  const [hospitalQueue, setHospitalQueue] = useState([]);
  const [queueStats, setQueueStats] = useState({ total: 0, completed: 0, waiting: 0, inProgress: 0, skipped: 0, avgWaitMinutes: 12 });
  const [loading, setLoading] = useState(false);
  const [lastNotification, setLastNotification] = useState(null);

  // Fetch single live token for patient view
  const fetchLiveToken = useCallback(async (idToFetch) => {
    const tid = idToFetch || activeTokenId;
    if (!tid) return;

    try {
      const res = await fetch(`/api/tokens/${tid}`);
      if (res.ok) {
        const data = await res.json();
        
        // Trigger alert if token status changed to 'called' or wait time is ~10-15 mins
        if (activeToken && activeToken.status !== data.status && data.status === 'called') {
          playChimeAlert('call');
          setLastNotification({
            type: 'called',
            title: '🎉 It is Your Turn!',
            message: `Token #${data.token_number} has been called in ${data.room_no || 'OPD-1'}. Please enter the doctor's room.`
          });
        } else if (data.status === 'waiting' && data.people_ahead <= 2 && data.people_ahead >= 1) {
          if (!lastNotification || lastNotification.type !== 'leave_now') {
            playChimeAlert('alert');
            setLastNotification({
              type: 'leave_now',
              title: '🚗 Leave Now Smart Alert',
              message: `Only ${data.people_ahead} person ahead of you! Estimated wait: ~${data.estimated_wait_minutes} mins. Please head to the hospital now.`
            });
          }
        }

        setActiveToken(data);
      }
    } catch (err) {
      console.warn('Error fetching live token:', err);
    }
  }, [activeTokenId, activeToken, lastNotification]);

  // Fetch full live queue for hospital receptionist view
  const fetchHospitalQueue = useCallback(async (hospitalId = 'hosp-1', departmentId = 'all', status = 'all') => {
    try {
      const res = await fetch(`/api/receptionist/${hospitalId}/queue?departmentId=${departmentId}&status=${status}`);
      if (res.ok) {
        const data = await res.json();
        setHospitalQueue(data.queue || []);
        if (data.stats) setQueueStats(data.stats);
      }
    } catch (err) {
      console.warn('Error fetching hospital queue:', err);
    }
  }, []);

  // Update active token ID
  const selectActiveToken = (id) => {
    setActiveTokenId(id);
    if (id) {
      localStorage.setItem('mediq_active_token_id', id);
      fetchLiveToken(id);
    } else {
      localStorage.removeItem('mediq_active_token_id');
      setActiveToken(null);
    }
  };

  // Generate new token
  const generateToken = async (tokenData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tokenData)
      });
      const data = await res.json();
      if (res.ok && data) {
        selectActiveToken(data.id);
        setLoading(false);
        return { success: true, token: data };
      }
    } catch (err) {
      console.error('Token generation error:', err);
    }
    setLoading(false);
    return { success: false, error: 'Failed to generate token' };
  };

  // Receptionist actions: Call Next
  const callNext = async (hospitalId, departmentId) => {
    try {
      const res = await fetch('/api/tokens/next/call', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hospital_id: hospitalId, department_id: departmentId })
      });
      const data = await res.json();
      if (res.ok) {
        playChimeAlert('call');
        await fetchHospitalQueue(hospitalId, departmentId);
        await fetchLiveToken();
        return { success: true, token: data };
      }
    } catch (err) {
      console.error('Call next error:', err);
    }
    return { success: false };
  };

  // Update token status (complete, skip, cancel)
  const updateTokenStatus = async (tokenId, action, extra = {}) => {
    try {
      const res = await fetch(`/api/tokens/${tokenId}/${action}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(extra)
      });
      if (res.ok) {
        await fetchHospitalQueue();
        await fetchLiveToken();
        return { success: true };
      }
    } catch (err) {
      console.error(`Update token status ${action} error:`, err);
    }
    return { success: false };
  };

  // Setup periodic polling & Supabase Realtime subscription
  useEffect(() => {
    fetchLiveToken();
    const interval = setInterval(() => {
      fetchLiveToken();
      fetchHospitalQueue();
    }, 4000); // 4-second live refresh interval

    // Supabase Realtime subscription if configured
    let subscription = null;
    if (isSupabaseConfigured) {
      subscription = supabase
        .channel('public:tokens')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tokens' }, () => {
          fetchLiveToken();
          fetchHospitalQueue();
        })
        .subscribe();
    }

    return () => {
      clearInterval(interval);
      if (subscription) supabase.removeChannel(subscription);
    };
  }, [fetchLiveToken, fetchHospitalQueue]);

  return (
    <QueueContext.Provider
      value={{
        activeToken,
        activeTokenId,
        selectActiveToken,
        hospitalQueue,
        queueStats,
        loading,
        generateToken,
        callNext,
        updateTokenStatus,
        fetchHospitalQueue,
        fetchLiveToken,
        lastNotification,
        clearNotification: () => setLastNotification(null)
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => useContext(QueueContext);
