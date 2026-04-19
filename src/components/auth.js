export const SESSION_KEYS = {
  USER: 'user',
  ROLE: 'role',
  AUTH_HEADER: 'authHeader'
};

export const getCurrentUser = () => sessionStorage.getItem(SESSION_KEYS.USER);

export const getCurrentRole = () => sessionStorage.getItem(SESSION_KEYS.ROLE);

export const getAuthHeader = () => sessionStorage.getItem(SESSION_KEYS.AUTH_HEADER);

export const saveSession = ({ username, role, authHeader }) => {
  sessionStorage.setItem(SESSION_KEYS.USER, username);
  sessionStorage.setItem(SESSION_KEYS.ROLE, role);
  sessionStorage.setItem(SESSION_KEYS.AUTH_HEADER, authHeader);
};

export const clearSession = () => sessionStorage.clear();
