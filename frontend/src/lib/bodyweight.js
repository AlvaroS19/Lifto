import api from './api';

export async function fetchBodyWeightLogs() {
  const { data } = await api.get('/bodyweight');
  return data.logs;
}

export async function createBodyWeightLog(log) {
  const { data } = await api.post('/bodyweight', log);
  return data.log;
}
