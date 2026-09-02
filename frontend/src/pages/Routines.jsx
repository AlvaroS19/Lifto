import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchRoutines } from '../lib/routines';

export default function Routines() {
  // useQuery necesita una "queryKey" (identificador único para cachear este dato)
  // y una "queryFn" (la función que trae los datos). React Query maneja
  // automáticamente loading/error/refetch a partir de esto.
  const { data: routines, isLoading, isError } = useQuery({
    queryKey: ['routines'],
    queryFn: fetchRoutines,
  });

  if (isLoading) return <p>Cargando rutinas...</p>;
  if (isError) return <p>Error al cargar las rutinas.</p>;

  return (
    <div>
      <h1>Mis rutinas</h1>

      <Link to="/routines/new">+ Nueva rutina</Link>

      {routines.length === 0 ? (
        <p>Todavía no tienes rutinas. Crea la primera.</p>
      ) : (
        <ul>
          {routines.map((routine) => (
            <li key={routine.id}>
              <Link to={`/routines/${routine.id}`}>{routine.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
