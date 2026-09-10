import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchRoutines } from '../lib/routines';

export default function Routines() {
  const { data: routines, isLoading, isError } = useQuery({
    queryKey: ['routines'],
    queryFn: fetchRoutines,
  });

  if (isLoading) return <div className="page"><p>Cargando rutinas...</p></div>;
  if (isError) return <div className="page"><p className="error-text">Error al cargar las rutinas.</p></div>;

  return (
    <div className="page">
      <h1>Mis rutinas</h1>
      <p style={{ marginBottom: '20px' }}>Elige una rutina para entrenar o crea una nueva.</p>

      <Link to="/routines/new" className="btn btn-block" style={{ marginBottom: '24px', textDecoration: 'none' }}>
        + Nueva rutina
      </Link>

      {routines.length === 0 ? (
        <p>Todavía no tienes rutinas. Crea la primera.</p>
      ) : (
        routines.map((routine) => (
          <Link key={routine.id} to={`/routines/${routine.id}`} style={{ textDecoration: 'none' }}>
            <div className="card">
              <h2 style={{ color: 'var(--text)', fontSize: '17px' }}>{routine.name}</h2>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
