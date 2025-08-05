import { useState, useEffect } from 'react';
import { adminAPI } from '../api/admin';

export const useRecentActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching real recent activities from backend...');

      const response = await adminAPI.getRecentActivities();
      console.log('Recent activities response:', response);
      
      if (response.activities && response.activities.length > 0) {
        setActivities(response.activities);
      } else {
        setActivities([]);
      }

    } catch (err) {
      console.error('Error fetching recent activities:', err);
      setError(err.message || 'Failed to fetch recent activities');
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const refreshActivities = () => {
    fetchActivities();
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const timeDiff = now - new Date(timestamp);
    
    const minutes = Math.floor(timeDiff / (1000 * 60));
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return `${days} ngày trước`;
  };

  return {
    activities,
    loading,
    error,
    refreshActivities,
    formatTimeAgo
  };
}; 