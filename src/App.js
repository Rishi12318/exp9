import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0B5ED7'
    },
    secondary: {
      main: '#198754'
    },
    background: {
      default: '#f3f6fb'
    }
  },
  shape: {
    borderRadius: 12
  }
});

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/user"
            element={(
              <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
                <UserDashboard />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/admin"
            element={(
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            )}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
