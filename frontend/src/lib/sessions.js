import api from './api';

export async function fetchSessions() {
  const { data } = await api.get('/sessions');
  return data.sessions;
}

export async function fetchSession(id) {
  const { data } = await api.get(`/sessions/${id}`);
  return data.session;
}

export async function createSession(routineId) {
  const { data } = await api.post('/sessions', { routineId });
  return data.session;
}

export async function addSet(sessionId, set) {
  const { data } = await api.post(`/sessions/${sessionId}/sets`, set);
  return data.set;
}
