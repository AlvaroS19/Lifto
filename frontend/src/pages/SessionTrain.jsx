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

  const [forms, setForms] = useState({});

  const { data: session, isLoading: loadingSession } = useQuery({
    queryKey: ['sessions', id],
    queryFn: () => fetchSession(id),
  });

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

  if (loadingSession || loadingRoutine) return <div className="page"><p>Cargando sesión...</p></div>;
  if (!session || !routine) return <div className="page"><p className="error-text">No se ha encontrado la sesión.</p></div>;

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
    <div className="page">
      <p style={{ marginBottom: '20px' }}>
        <Link to={`/routines/${session.routineId}`}>← Volver a la rutina</Link>
      </p>

      <h1>{routine.name}</h1>
      <p style={{ marginBottom: '20px' }}>Entrenamiento en curso</p>

      {routine.exercises.map((re) => {
        const sets = setsForExercise(re.id);
        const form = getForm(re.id);

        return (
          <div key={re.id} className="card">
            <h2 style={{ color: 'var(--text)', fontSize: '17px', marginBottom: '2px' }}>{re.exercise.name}</h2>
            <p style={{ marginBottom: '12px' }}>
              Objetivo: {re.targetSets}x{re.targetReps}
              {re.targetWeight ? ` a ${re.targetWeight}kg` : ''}
            </p>

            {sets.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                {sets.map((s) => (
                  <div key={s.id} className="stat" style={{ fontSize: '15px', padding: '4px 0' }}>
                    Set {s.setNumber}: {s.reps} × {s.weight}kg
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="number"
                placeholder="Reps"
                value={form.reps}
                onChange={(e) => updateForm(re.id, 'reps', e.target.value)}
              />
              <input
                type="number"
                placeholder="kg"
                value={form.weight}
                onChange={(e) => updateForm(re.id, 'weight', e.target.value)}
              />
              <button
                className="btn"
                style={{ whiteSpace: 'nowrap' }}
                onClick={() => handleAddSet(re.id)}
                disabled={mutation.isPending}
              >
                Añadir
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
