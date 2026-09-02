import api from './api';

export async function fetchRoutines() {
  const { data } = await api.get('/routines');
  return data.routines;
}

export async function fetchRoutine(id) {
  const { data } = await api.get(`/routines/${id}`);
  return data.routine;
}

export async function createRoutine(routine) {
  const { data } = await api.post('/routines', routine);
  return data.routine;
}

export async function deleteRoutine(id) {
  await api.delete(`/routines/${id}`);
}
