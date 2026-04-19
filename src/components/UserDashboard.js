import React, { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@mui/material';
import apiClient from './api';
import TopBar from './TopBar';
import { getCurrentRole } from './auth';

const normalizeRoles = (roles) => {
  if (!Array.isArray(roles)) {
    return [];
  }

  return roles
    .map((role) => {
      if (typeof role === 'string') {
        return role;
      }

      if (role && typeof role.authority === 'string') {
        return role.authority;
      }

      return null;
    })
    .filter(Boolean);
};

function UserDashboard() {
  const role = getCurrentRole();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [activity, setActivity] = useState([]);
  const [stats, setStats] = useState({
    checks: 0,
    successCalls: 0,
    deniedCalls: 0
  });

  const addActivity = (action, status) => {
    const entry = {
      id: Date.now(),
      action,
      status,
      time: new Date().toLocaleTimeString()
    };

    setActivity((previous) => [entry, ...previous].slice(0, 6));
  };

  const fetchProfile = async () => {
    setError('');
    setMessage('');

    try {
      const response = await apiClient.get('/api/user/profile');
      setMessage(response.data?.message || 'User profile fetched successfully.');
      setProfile(response.data || null);
      setStats((previous) => ({
        checks: previous.checks + 1,
        successCalls: previous.successCalls + 1,
        deniedCalls: previous.deniedCalls
      }));
      addActivity('User profile request', 'Success');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to fetch user profile.');
      setStats((previous) => ({
        checks: previous.checks + 1,
        successCalls: previous.successCalls,
        deniedCalls: previous.deniedCalls
      }));
      addActivity('User profile request', 'Failed');
    }
  };

  const fetchAdminData = async () => {
    setError('');
    setMessage('');

    try {
      await apiClient.get('/api/admin/dashboard');
      setMessage('Unexpected: admin endpoint was accessible to USER role.');
      addActivity('Admin endpoint verification', 'Unexpected access');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Access denied to admin endpoint (expected).');
      setStats((previous) => ({
        checks: previous.checks + 1,
        successCalls: previous.successCalls,
        deniedCalls: previous.deniedCalls + 1
      }));
      addActivity('Admin endpoint verification', 'Denied as expected');
    }
  };

  const clearActivity = () => {
    setActivity([]);
  };

  const roles = normalizeRoles(profile?.roles);

  return (
    <div className="container py-4">
      <TopBar />

      <Card className="dashboard-card mb-4">
        <CardContent>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <div>
              <Typography variant="h5" className="fw-bold mb-2">User Dashboard</Typography>
              <Typography variant="body1" color="text.secondary">
                Access your profile securely and verify that admin routes stay protected.
              </Typography>
            </div>
            <Chip label="USER VIEW" color="primary" />
          </div>
        </CardContent>
      </Card>

      <Grid container spacing={2} className="mb-2">
        <Grid item xs={12} md={4}>
          <Card className="dashboard-card stat-card">
            <CardContent>
              <Typography className="stat-label">Endpoint Checks</Typography>
              <Typography variant="h4" className="fw-bold">{stats.checks}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="dashboard-card stat-card success">
            <CardContent>
              <Typography className="stat-label">Successful Calls</Typography>
              <Typography variant="h4" className="fw-bold">{stats.successCalls}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="dashboard-card stat-card warning">
            <CardContent>
              <Typography className="stat-label">Denied Admin Attempts</Typography>
              <Typography variant="h4" className="fw-bold">{stats.deniedCalls}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card className="dashboard-card">
        <CardContent>
          <Typography variant="h6" className="fw-bold mb-3">Actions</Typography>

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
            <Button variant="outlined" onClick={clearActivity}>
              Clear Activity
            </Button>
          </div>

          {message ? <Alert severity="success" className="mb-2">{message}</Alert> : null}
          {error ? <Alert severity="error" className="mb-2">{error}</Alert> : null}

          <Divider className="my-3" />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" className="fw-semibold mb-2">Profile Snapshot</Typography>
              {profile ? (
                <div className="dashboard-panel">
                  <Typography><strong>Username:</strong> {profile.username || 'N/A'}</Typography>
                  <Typography className="mb-2"><strong>Message:</strong> {profile.message || 'N/A'}</Typography>
                  <div className="d-flex flex-wrap gap-1">
                    {roles.length ? roles.map((roleName) => (
                      <Chip key={roleName} size="small" label={roleName} color="secondary" variant="outlined" />
                    )) : <Chip size="small" label="No roles received" variant="outlined" />}
                  </div>
                </div>
              ) : (
                <Typography color="text.secondary">No profile loaded yet. Click "Get User Profile".</Typography>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" className="fw-semibold mb-2">Recent Activity</Typography>
              {activity.length ? (
                <List dense className="dashboard-panel">
                  {activity.map((entry) => (
                    <ListItem key={entry.id} divider>
                      <ListItemText
                        primary={`${entry.action} - ${entry.status}`}
                        secondary={`at ${entry.time}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">No activity yet.</Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserDashboard;
