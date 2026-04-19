import React, { useState } from 'react';
import { Alert, Button, Card, CardContent, Typography } from '@mui/material';
import apiClient from './api';
import TopBar from './TopBar';
import { getCurrentRole } from './auth';

function UserDashboard() {
  const role = getCurrentRole();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    setError('');
    setMessage('');

    try {
      const response = await apiClient.get('/api/user/profile');
      setMessage(response.data?.message || 'User profile fetched successfully.');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to fetch user profile.');
    }
  };

  const fetchAdminData = async () => {
    setError('');
    setMessage('');

    try {
      await apiClient.get('/api/admin/dashboard');
      setMessage('Unexpected: admin endpoint was accessible to USER role.');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Access denied to admin endpoint (expected).');
    }
  };

  return (
    <div className="container py-4">
      <TopBar />
      <Card>
        <CardContent>
          <Typography variant="h5" className="fw-bold mb-2">User Dashboard</Typography>
          <Typography variant="body1" color="text.secondary" className="mb-4">
            Role-aware dashboard for USER access.
          </Typography>

          <div className="d-flex flex-wrap gap-2 mb-3">
            <Button variant="contained" color="success" onClick={fetchProfile}>
              Get User Profile
            </Button>
            {role === 'ADMIN' ? (
              <Button variant="contained" color="error" onClick={fetchAdminData}>
                Admin Endpoint
              </Button>
            ) : (
              <Button variant="outlined" color="error" onClick={fetchAdminData}>
                Try Admin Endpoint (Should Fail)
              </Button>
            )}
          </div>

          {message ? <Alert severity="success" className="mb-2">{message}</Alert> : null}
          {error ? <Alert severity="error">{error}</Alert> : null}
        </CardContent>
      </Card>
    </div>
  );
}

export default UserDashboard;
