import api from './api';

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  localStorage.setItem('lifto_token', data.token);
  return data.user;
}

export async function register(email, password) {
  const { data } = await api.post('/auth/register', { email, password });
  return data.user;
}

export function logout() {
  localStorage.removeItem('lifto_token');
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem('lifto_token'));
}
