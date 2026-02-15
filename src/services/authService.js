// FaithTrack Auth Service — localStorage-based authentication

const USERS_KEY = 'faithtrack_users';
const SESSION_KEY = 'faithtrack_session';

function getUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function register({ name, email, password, church }) {
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    throw new Error('An account with this email already exists.');
  }
  const newUser = {
    id: crypto.randomUUID(),
    name,
    email,
    password, // In a real app, hash this!
    church: church || '',
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveUsers(users);
  // Auto-login after registration
  const { password: _, ...safeUser } = newUser;
  localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
  return safeUser;
}

export function login(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    throw new Error('Invalid email or password.');
  }
  const { password: _, ...safeUser } = user;
  localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
  return safeUser;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated() {
  return getCurrentUser() !== null;
}
