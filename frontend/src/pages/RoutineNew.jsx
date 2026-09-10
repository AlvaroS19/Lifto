import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchExercises } from '../lib/exercises';
import { createRoutine } from '../lib/routines';

function emptyRow() {
  return { exerciseId: '', targetSets: 4, targetReps: 8, targetWeight: '' };
}

export default function RoutineNew() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [rows, setRows] = useState([emptyRow()]);
  const [error, setError] = useState(null);

  const { data: exercises, isLoading: loadingExercises } = useQuery({
    queryKey: ['exercises'],
    queryFn: fetchExercises,
  });

  const mutation = useMutation({
    mutationFn: createRoutine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
      navigate('/routines');
    },
    onError: (err) => {
      setError(err.response?.data?.error ?? 'Error al crear la rutina');
    },
  });

  function updateRow(index, field, value) {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  }

  function addRow() {
    setRows((prev) => [...prev, emptyRow()]);
  }

  function removeRow(index) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('El nombre de la rutina es obligatorio');
      return;
    }
    if (rows.some((r) => !r.exerciseId)) {
      setError('Selecciona un ejercicio en cada fila');
      return;
    }

    mutation.mutate({
      name,
      exercises: rows.map((row, index) => ({
        exerciseId: row.exerciseId,
        order: index + 1,
        targetSets: Number(row.targetSets),
        targetReps: Number(row.targetReps),
        targetWeight: row.targetWeight ? Number(row.targetWeight) : undefined,
      })),
    });
  }

  if (loadingExercises) return <div className="page"><p>Cargando ejercicios...</p></div>;

  return (
    <div className="page">
      <h1>Nueva rutina</h1>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="name">Nombre</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Push day"
          />
        </div>

        <h2 style={{ marginTop: '28px', marginBottom: '4px' }}>Ejercicios</h2>
        <p style={{ marginBottom: '16px' }}>
          <Link to="/exercises/new">¿No está el ejercicio que buscas? Créalo aquí</Link>
        </p>

        {rows.map((row, index) => (
          <div key={index} className="card">
            <div className="field" style={{ marginBottom: '10px' }}>
              <select
                value={row.exerciseId}
                onChange={(e) => updateRow(index, 'exerciseId', e.target.value)}
              >
                <option value="">Selecciona un ejercicio</option>
                {exercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="number"
                value={row.targetSets}
                onChange={(e) => updateRow(index, 'targetSets', e.target.value)}
                placeholder="Series"
              />
              <input
                type="number"
                value={row.targetReps}
                onChange={(e) => updateRow(index, 'targetReps', e.target.value)}
                placeholder="Reps"
              />
              <input
                type="number"
                value={row.targetWeight}
                onChange={(e) => updateRow(index, 'targetWeight', e.target.value)}
                placeholder="kg"
              />
            </div>

            {rows.length > 1 && (
              <button
                type="button"
                className="btn-secondary"
                style={{ marginTop: '10px', fontSize: '13px', padding: '6px 12px', border: 'none' }}
                onClick={() => removeRow(index)}
              >
                Quitar ejercicio
              </button>
            )}
          </div>
        ))}

        <button type="button" className="btn-secondary btn-block" style={{ marginBottom: '24px' }} onClick={addRow}>
          + Añadir ejercicio
        </button>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn btn-block" disabled={mutation.isPending}>
          {mutation.isPending ? 'Guardando...' : 'Guardar rutina'}
        </button>
      </form>
    </div>
  );
}
