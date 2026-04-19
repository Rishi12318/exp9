import React, { useState } from 'react';
import { Alert, Button, Card, CardContent, Typography } from '@mui/material';
import apiClient from './api';
import TopBar from './TopBar';

function AdminDashboard() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchAdminData = async () => {
    setError('');
    setMessage('');

    try {
      const response = await apiClient.get('/api/admin/dashboard');
      setMessage(response.data?.message || 'Admin dashboard data fetched successfully.');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to fetch admin dashboard data.');
    }
  };

  const fetchUserProfile = async () => {
    setError('');
    setMessage('');

    try {
      const response = await apiClient.get('/api/user/profile');
      setMessage(response.data?.message || 'Admin can also access user profile.');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to fetch user profile.');
    }
  };

  return (
    <div className="container py-4">
      <TopBar />
      <Card>
        <CardContent>
          <Typography variant="h5" className="fw-bold mb-2">Admin Dashboard</Typography>
          <Typography variant="body1" color="text.secondary" className="mb-4">
            ADMIN role has access to both admin and user resources.
          </Typography>

          <div className="d-flex flex-wrap gap-2 mb-3">
            <Button variant="contained" color="error" onClick={fetchAdminData}>
              Get Admin Dashboard Data
            </Button>
            <Button variant="outlined" color="primary" onClick={fetchUserProfile}>
              Get User Profile
            </Button>
          </div>

          {message ? <Alert severity="success" className="mb-2">{message}</Alert> : null}
          {error ? <Alert severity="error">{error}</Alert> : null}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboard;
