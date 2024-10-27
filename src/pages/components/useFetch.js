import { useState, useCallback } from 'react';
import axios from 'axios';
import { google_ngrok_url } from '../../utils/global';

const BASE_URL = google_ngrok_url;

export const useFetch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getToken = () => localStorage.getItem('Token');

  const apiCall = useCallback(async (endpoint, method, data = null) => {
    setIsLoading(true);
    setError(null);

    const token = getToken();
    if (!token) {
      setError('No authentication token found');
      setIsLoading(false);
      return null;
    }

    try {
      const config = {
        method,
        url: `${BASE_URL}${endpoint}`,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const savePatientInfo = useCallback(async (patientData) => {
    return apiCall('/patient/update_info/', 'POST', patientData);
  }, [apiCall]);

  const updateProfilePic = useCallback(async (formData) => {
    const token = getToken();
    if (!token) {
      setError('No authentication token found');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${BASE_URL}/patient/update_profile_pic/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPatientInfo = useCallback(async () => {
    return apiCall('/patient/get_info/', 'POST', {"Checking":"OK"});
  }, [apiCall]);

  const fetchReports = useCallback(async () => {
    return apiCall('/patient/get_reports/', 'POST', {"Checking":"OK"});
  }, [apiCall]);

  const sendReport = useCallback(async (reportFile) => {
    const token = getToken();
    if (!token) {
      setError('No authentication token found');
      return null;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("report", reportFile);

    try {
      const response = await axios.post(`${BASE_URL}/patient/send_report/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchHealthCheck = useCallback(async () => {
    return apiCall('/patient/health_check/', 'POST', {"Checking":"OK"});
  }, [apiCall]);

  return {
    isLoading,
    error,
    savePatientInfo,
    updateProfilePic,
    getPatientInfo,
    fetchReports,
    sendReport,
    fetchHealthCheck,
  };
};