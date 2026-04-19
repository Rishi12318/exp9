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

function AdminDashboard() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [adminPayload, setAdminPayload] = useState(null);
  const [userPayload, setUserPayload] = useState(null);
  const [auditFeed, setAuditFeed] = useState([]);
  const [stats, setStats] = useState({
    totalChecks: 0,
    adminChecks: 0,
    userChecks: 0
  });

  const addAudit = (action, result) => {
    const entry = {
      id: Date.now(),
      action,
      result,
      time: new Date().toLocaleTimeString()
    };

    setAuditFeed((previous) => [entry, ...previous].slice(0, 8));
  };

  const fetchAdminData = async () => {
    setError('');
    setMessage('');

    try {
      const response = await apiClient.get('/api/admin/dashboard');
      setMessage(response.data?.message || 'Admin dashboard data fetched successfully.');
      setAdminPayload(response.data || null);
      setStats((previous) => ({
        totalChecks: previous.totalChecks + 1,
        adminChecks: previous.adminChecks + 1,
        userChecks: previous.userChecks
      }));
      addAudit('Admin dashboard endpoint', 'Success');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to fetch admin dashboard data.');
      addAudit('Admin dashboard endpoint', 'Failed');
    }
  };

  const fetchUserProfile = async () => {
    setError('');
    setMessage('');

    try {
      const response = await apiClient.get('/api/user/profile');
      setMessage(response.data?.message || 'Admin can also access user profile.');
      setUserPayload(response.data || null);
      setStats((previous) => ({
        totalChecks: previous.totalChecks + 1,
        adminChecks: previous.adminChecks,
        userChecks: previous.userChecks + 1
      }));
      addAudit('User profile endpoint', 'Success');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to fetch user profile.');
      addAudit('User profile endpoint', 'Failed');
    }
  };

  const clearAudit = () => {
    setAuditFeed([]);
  };

  const adminRoles = normalizeRoles(adminPayload?.roles);

  return (
    <div className="container py-4">
      <TopBar />

      <Card className="dashboard-card mb-4">
        <CardContent>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <div>
              <Typography variant="h5" className="fw-bold mb-2">Admin Dashboard</Typography>
              <Typography variant="body1" color="text.secondary">
                Full-control view for ADMIN role with access to all protected endpoints.
              </Typography>
            </div>
            <Chip label="ADMIN CONTROL" color="error" />
          </div>
        </CardContent>
      </Card>

      <Grid container spacing={2} className="mb-2">
        <Grid item xs={12} md={4}>
          <Card className="dashboard-card stat-card">
            <CardContent>
              <Typography className="stat-label">Total Endpoint Checks</Typography>
              <Typography variant="h4" className="fw-bold">{stats.totalChecks}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="dashboard-card stat-card danger">
            <CardContent>
              <Typography className="stat-label">Admin API Calls</Typography>
              <Typography variant="h4" className="fw-bold">{stats.adminChecks}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="dashboard-card stat-card success">
            <CardContent>
              <Typography className="stat-label">User API Calls</Typography>
              <Typography variant="h4" className="fw-bold">{stats.userChecks}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card className="dashboard-card">
        <CardContent>
          <Typography variant="h6" className="fw-bold mb-3">Actions</Typography>

          <div className="d-flex flex-wrap gap-2 mb-3">
            <Button variant="contained" color="error" onClick={fetchAdminData}>
              Get Admin Dashboard Data
            </Button>
            <Button variant="outlined" color="primary" onClick={fetchUserProfile}>
              Get User Profile
            </Button>
            <Button variant="outlined" onClick={clearAudit}>
              Clear Audit Feed
            </Button>
          </div>

          {message ? <Alert severity="success" className="mb-2">{message}</Alert> : null}
          {error ? <Alert severity="error" className="mb-2">{error}</Alert> : null}

          <Divider className="my-3" />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" className="fw-semibold mb-2">Admin Snapshot</Typography>
              {adminPayload ? (
                <div className="dashboard-panel">
                  <Typography><strong>Username:</strong> {adminPayload.username || 'N/A'}</Typography>
                  <Typography className="mb-2"><strong>Message:</strong> {adminPayload.message || 'N/A'}</Typography>
                  <div className="d-flex flex-wrap gap-1 mb-2">
                    {adminRoles.length ? adminRoles.map((roleName) => (
                      <Chip key={roleName} size="small" label={roleName} color="error" variant="outlined" />
                    )) : <Chip size="small" label="No roles received" variant="outlined" />}
                  </div>
                  <Typography variant="caption" color="text.secondary">Raw payload:</Typography>
                  <pre className="payload-pre mt-1">{JSON.stringify(adminPayload, null, 2)}</pre>
                </div>
              ) : (
                <Typography color="text.secondary">No admin payload loaded yet.</Typography>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" className="fw-semibold mb-2">Audit Feed</Typography>
              {auditFeed.length ? (
                <List dense className="dashboard-panel">
                  {auditFeed.map((entry) => (
                    <ListItem key={entry.id} divider>
                      <ListItemText
                        primary={`${entry.action} - ${entry.result}`}
                        secondary={`at ${entry.time}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">No activity yet.</Typography>
              )}

              {userPayload ? (
                <div className="dashboard-panel mt-3">
                  <Typography variant="subtitle2" className="mb-1">Latest User Payload</Typography>
                  <pre className="payload-pre">{JSON.stringify(userPayload, null, 2)}</pre>
                </div>
              ) : null}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboard;
