import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchRoutine } from '../lib/routines';
import { createSession } from '../lib/sessions';

export default function RoutineDetail() {
  const { id } = useParams();
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

  if (isLoading) return <div className="page"><p>Cargando rutina...</p></div>;
  if (isError || !routine) return <div className="page"><p className="error-text">No se ha encontrado la rutina.</p></div>;

  return (
    <div className="page">
      <p style={{ marginBottom: '20px' }}>
        <Link to="/routines">← Volver a rutinas</Link>
      </p>

      <h1>{routine.name}</h1>
      <h2 style={{ marginTop: '24px', marginBottom: '10px' }}>Ejercicios</h2>

      {routine.exercises.map((re) => (
        <div key={re.id} className="card">
          <div style={{ color: 'var(--text)', fontWeight: 500 }}>{re.exercise.name}</div>
          <div className="stat" style={{ fontSize: '15px', marginTop: '4px' }}>
            {re.targetSets}x{re.targetReps}
            {re.targetWeight ? ` · ${re.targetWeight}kg` : ''}
          </div>
        </div>
      ))}

      <button
        className="btn btn-block"
        style={{ marginTop: '20px' }}
        onClick={() => startSessionMutation.mutate()}
        disabled={startSessionMutation.isPending}
      >
        {startSessionMutation.isPending ? 'Iniciando...' : 'Empezar entrenamiento'}
      </button>
    </div>
  );
}
