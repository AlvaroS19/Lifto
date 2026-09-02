import api from './api';

export async function fetchExercises() {
  const { data } = await api.get('/exercises');
  return data.exercises;
}

export async function createExercise(exercise) {
  const { data } = await api.post('/exercises', exercise);
  return data.exercise;
}
