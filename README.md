# Frontend Integration with RBAC (React + Session-Based UI)

This project demonstrates Role-Based Access Control integration from frontend to backend using React.

## Objective

- Build a React frontend for RBAC APIs
- Use Bootstrap + Material UI for UI design
- Implement session-based authentication
- Restrict UI components based on role (`USER` / `ADMIN`)
- Demonstrate role-based access from frontend

## Tech Stack

- React
- Bootstrap
- Material UI
- Axios
- React Router

## Setup

1. Install dependencies:

```bash
npm install
```

2. Ensure RBAC backend is running at `http://localhost:8080`.

3. Start frontend:

```bash
npm start
```

Frontend runs on `http://localhost:3000`.

## Features Implemented

### 1. Login Page

- Accepts username and password
- Calls backend authentication endpoint
- Stores user, role, and auth header in `sessionStorage`
- Redirects by role:
	- `USER` -> `/user`
	- `ADMIN` -> `/admin`

### 2. Role-Based Dashboards

- `USER` Dashboard:
	- Accesses `/api/user/profile`
	- Tries admin API and shows denied message
- `ADMIN` Dashboard:
	- Accesses `/api/admin/dashboard`
	- Also accesses `/api/user/profile`

### 3. Role-Based UI Control

- Route-level restriction using protected routes
- Component-level control:
	- `USER` does not get admin controls
	- `ADMIN` can access all controls

### 4. Logout

- Clears session with `sessionStorage.clear()`
- Redirects to login page

## Session Storage Keys

- `user`
- `role`
- `authHeader`

## Required Screenshots Checklist

- Login UI
- USER accessing user endpoint
- USER denied access to admin endpoint
- ADMIN accessing admin endpoint
- Session storage showing role
- Unauthorized access handling

## Scripts

```bash
npm start
npm test
npm run build
```
