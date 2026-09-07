import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSession, addSet } from '../lib/sessions';
import { fetchRoutine } from '../lib/routines';

function emptySetForm() {
  return { reps: '', weight: '' };
}

export default function SessionTrain() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [forms, setForms] = useState({}); // { [routineExerciseId]: { reps, weight } }

  const { data: session, isLoading: loadingSession } = useQuery({
    queryKey: ['sessions', id],
    queryFn: () => fetchSession(id),
  });

  // Solo pedimos la rutina cuando ya sabemos su id (viene dentro de la sesión).
  // `enabled` evita que React Query intente lanzar esta llamada antes de tiempo.
  const { data: routine, isLoading: loadingRoutine } = useQuery({
    queryKey: ['routines', session?.routineId],
    queryFn: () => fetchRoutine(session.routineId),
    enabled: Boolean(session?.routineId),
  });

  const mutation = useMutation({
    mutationFn: ({ routineExerciseId, setNumber, reps, weight }) =>
      addSet(id, { routineExerciseId, setNumber, reps, weight }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions', id] });
    },
  });

  if (loadingSession || loadingRoutine) return <p>Cargando sesión...</p>;
  if (!session || !routine) return <p>No se ha encontrado la sesión.</p>;

  function getForm(routineExerciseId) {
    return forms[routineExerciseId] ?? emptySetForm();
  }

  function updateForm(routineExerciseId, field, value) {
    setForms((prev) => ({
      ...prev,
      [routineExerciseId]: { ...getForm(routineExerciseId), [field]: value },
    }));
  }

  function setsForExercise(routineExerciseId) {
    return session.sets.filter((s) => s.routineExerciseId === routineExerciseId);
  }

  function handleAddSet(routineExerciseId) {
    const form = getForm(routineExerciseId);
    if (!form.reps || !form.weight) return;

    const nextSetNumber = setsForExercise(routineExerciseId).length + 1;

    mutation.mutate({
      routineExerciseId,
      setNumber: nextSetNumber,
      reps: Number(form.reps),
      weight: Number(form.weight),
    });

    setForms((prev) => ({ ...prev, [routineExerciseId]: emptySetForm() }));
  }

  return (
    <div>
      <p>
        <Link to={`/routines/${session.routineId}`}>← Volver a la rutina</Link>
      </p>

      <h1>Entrenando: {routine.name}</h1>

      {routine.exercises.map((re) => {
        const sets = setsForExercise(re.id);
        const form = getForm(re.id);

        return (
          <div key={re.id} style={{ marginBottom: '24px' }}>
            <h2>{re.exercise.name}</h2>
            <p>
              Objetivo: {re.targetSets}x{re.targetReps}
              {re.targetWeight ? ` a ${re.targetWeight}kg` : ''}
            </p>

            <ul>
              {sets.map((s) => (
                <li key={s.id}>
                  Set {s.setNumber}: {s.reps} reps a {s.weight}kg
                </li>
              ))}
              {sets.length === 0 && <li>Ningún set registrado todavía</li>}
            </ul>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="number"
                placeholder="Reps"
                value={form.reps}
                onChange={(e) => updateForm(re.id, 'reps', e.target.value)}
                style={{ width: '80px' }}
              />
              <input
                type="number"
                placeholder="Peso (kg)"
                value={form.weight}
                onChange={(e) => updateForm(re.id, 'weight', e.target.value)}
                style={{ width: '90px' }}
              />
              <button onClick={() => handleAddSet(re.id)} disabled={mutation.isPending}>
                + Añadir set
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
