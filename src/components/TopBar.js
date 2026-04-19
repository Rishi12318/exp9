import React from 'react';
import { Button } from '@mui/material';
import { clearSession, getCurrentUser, getCurrentRole } from './auth';

function TopBar() {
  const username = getCurrentUser();
  const role = getCurrentRole();

  const onLogout = () => {
    clearSession();
    window.location.href = '/';
  };

  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h5 className="mb-1">Signed in as: {username || 'Unknown'}</h5>
        <span className="badge bg-primary">Role: {role || 'N/A'}</span>
      </div>
      <Button variant="outlined" color="error" onClick={onLogout}>
        Logout
      </Button>
    </div>
  );
}

export default TopBar;
