import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchRoutine } from '../lib/routines';
import { createSession } from '../lib/sessions';

export default function RoutineDetail() {
  const { id } = useParams(); // lee el :id de la URL, ej. /routines/74d3f48d...
  const navigate = useNavigate();

  const { data: routine, isLoading, isError } = useQuery({
    queryKey: ['routines', id],
    queryFn: () => fetchRoutine(id),
  });

  const startSessionMutation = useMutation({
    mutationFn: () => createSession(id),
    onSuccess: (session) => {
      navigate(`/sessions/${session.id}`);
    },
  });

  if (isLoading) return <p>Cargando rutina...</p>;
  if (isError || !routine) return <p>No se ha encontrado la rutina.</p>;

  return (
    <div>
      <p>
        <Link to="/routines">← Volver a rutinas</Link>
      </p>

      <h1>{routine.name}</h1>

      <h2>Ejercicios</h2>
      <ul>
        {routine.exercises.map((re) => (
          <li key={re.id}>
            {re.exercise.name} — {re.targetSets}x{re.targetReps}
            {re.targetWeight ? ` a ${re.targetWeight}kg` : ''}
          </li>
        ))}
      </ul>

      <button
        onClick={() => startSessionMutation.mutate()}
        disabled={startSessionMutation.isPending}
      >
        {startSessionMutation.isPending ? 'Iniciando...' : 'Empezar entrenamiento'}
      </button>
    </div>
  );
}
