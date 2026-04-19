import React, { useState } from 'react';
import { Alert, Button, Card, CardContent, CircularProgress, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiClient from './api';
import { saveSession } from './auth';

const deriveRole = (roles = []) => {
  const normalizedRoles = roles.map((role) => String(role).toUpperCase());
  return normalizedRoles.includes('ROLE_ADMIN') ? 'ADMIN' : 'USER';
};

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async () => {
    setError('');
    const normalizedUsername = username.trim();
    const normalizedPassword = password.trim();

    if (!normalizedUsername || !normalizedPassword) {
      setError('Username and password are required.');
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.post('/api/auth/login', {
        username: normalizedUsername,
        password: normalizedPassword
      });

      if (response.status === 200) {
        const authHeader = `Basic ${btoa(`${normalizedUsername}:${normalizedPassword}`)}`;
        const role = deriveRole(response.data?.roles || []);

        saveSession({ username: normalizedUsername, role, authHeader });
        navigate(role === 'ADMIN' ? '/admin' : '/user');
      }
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Invalid credentials or backend unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rbac-bg min-vh-100 d-flex align-items-center justify-content-center p-3">
      <Card sx={{ width: '100%', maxWidth: 460 }}>
        <CardContent className="p-4">
          <Typography variant="h4" className="fw-bold mb-1">RBAC Frontend</Typography>
          <Typography variant="body2" color="text.secondary" className="mb-4">
            Login to continue to your role-specific dashboard.
          </Typography>
          <Typography variant="caption" color="text.secondary" className="d-block mb-3">
            Try: student/password (USER) or admin/password (ADMIN)
          </Typography>

          {error ? <Alert severity="error" className="mb-3">{error}</Alert> : null}

          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            className="mb-3"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            className="mb-3"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={login}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
