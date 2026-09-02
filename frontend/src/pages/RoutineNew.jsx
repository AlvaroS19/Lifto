import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchExercises } from '../lib/exercises';
import { createRoutine } from '../lib/routines';

// Una "fila" vacía de ejercicio, usada como plantilla al añadir una nueva
function emptyRow() {
  return { exerciseId: '', targetSets: 4, targetReps: 8, targetWeight: '' };
}

export default function RoutineNew() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [rows, setRows] = useState([emptyRow()]);
  const [error, setError] = useState(null);

  // Cargamos el catálogo de ejercicios para el <select> de cada fila
  const { data: exercises, isLoading: loadingExercises } = useQuery({
    queryKey: ['exercises'],
    queryFn: fetchExercises,
  });

  // useMutation: para operaciones que ESCRIBEN datos (aquí, crear la rutina)
  const mutation = useMutation({
    mutationFn: createRoutine,
    onSuccess: () => {
      // invalidateQueries le dice a React Query "los datos de 'routines' están
      // desactualizados, vuelve a pedirlos" — así la lista se actualiza sola
      queryClient.invalidateQueries({ queryKey: ['routines'] });
      navigate('/routines');
    },
    onError: (err) => {
      setError(err.response?.data?.error ?? 'Error al crear la rutina');
    },
  });

  function updateRow(index, field, value) {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
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

    const payload = {
      name,
      exercises: rows.map((row, index) => ({
        exerciseId: row.exerciseId,
        order: index + 1,
        targetSets: Number(row.targetSets),
        targetReps: Number(row.targetReps),
        targetWeight: row.targetWeight ? Number(row.targetWeight) : undefined,
      })),
    };

    mutation.mutate(payload);
  }

  if (loadingExercises) return <p>Cargando ejercicios...</p>;

  return (
    <div>
      <h1>Nueva rutina</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nombre</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Push day"
          />
        </div>

        <h2>Ejercicios</h2>

        <p>
          <Link to="/exercises/new">¿No está el ejercicio que buscas? Créalo aquí</Link>
        </p>

        {rows.map((row, index) => (
          <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
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

            <input
              type="number"
              value={row.targetSets}
              onChange={(e) => updateRow(index, 'targetSets', e.target.value)}
              placeholder="Series"
              style={{ width: '70px' }}
            />
            <input
              type="number"
              value={row.targetReps}
              onChange={(e) => updateRow(index, 'targetReps', e.target.value)}
              placeholder="Reps"
              style={{ width: '70px' }}
            />
            <input
              type="number"
              value={row.targetWeight}
              onChange={(e) => updateRow(index, 'targetWeight', e.target.value)}
              placeholder="Peso (kg)"
              style={{ width: '90px' }}
            />

            {rows.length > 1 && (
              <button type="button" onClick={() => removeRow(index)}>
                Quitar
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addRow}>
          + Añadir ejercicio
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div style={{ marginTop: '16px' }}>
          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Guardando...' : 'Guardar rutina'}
          </button>
        </div>
      </form>
    </div>
  );
}
