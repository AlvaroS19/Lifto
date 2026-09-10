import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { createExercise } from '../lib/exercises';

export default function ExerciseNew() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [equipment, setEquipment] = useState('');
  const [error, setError] = useState(null);

  const mutation = useMutation({
    mutationFn: createExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      navigate(-1);
    },
    onError: (err) => {
      setError(err.response?.data?.error ?? 'Error al crear el ejercicio');
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !muscleGroup.trim()) {
      setError('Nombre y grupo muscular son obligatorios');
      return;
    }

    mutation.mutate({ name, muscleGroup, equipment: equipment || undefined });
  }

  return (
    <div className="page">
      <h1>Nuevo ejercicio</h1>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="name">Nombre</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Sentadilla" />
        </div>

        <div className="field">
          <label htmlFor="muscleGroup">Grupo muscular</label>
          <input
            id="muscleGroup"
            value={muscleGroup}
            onChange={(e) => setMuscleGroup(e.target.value)}
            placeholder="Ej. piernas"
          />
        </div>

        <div className="field">
          <label htmlFor="equipment">Equipamiento (opcional)</label>
          <input
            id="equipment"
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
            placeholder="Ej. barra"
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn btn-block" disabled={mutation.isPending}>
          {mutation.isPending ? 'Guardando...' : 'Guardar ejercicio'}
        </button>
      </form>

      <p className="link-row">
        <Link to="/routines">Volver a rutinas</Link>
      </p>
    </div>
  );
}
