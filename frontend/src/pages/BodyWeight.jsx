import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBodyWeightLogs, createBodyWeightLog } from '../lib/bodyweight';

// Gráfico simple hecho a mano con SVG, sin librería externa.
// Recibe los logs (más reciente primero) y dibuja una línea con los puntos.
function WeightChart({ logs }) {
  if (logs.length < 2) return null;

  // Los queremos en orden cronológico (antiguo -> reciente) para el eje X
  const sorted = [...logs].reverse();
  const weights = sorted.map((l) => Number(l.weight));
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const range = max - min || 1; // evita dividir entre 0 si todos los pesos son iguales

  const width = 320;
  const height = 120;
  const padding = 10;

  const points = sorted.map((log, i) => {
    const x = padding + (i / (sorted.length - 1)) * (width - padding * 2);
    // invertimos Y porque en SVG el 0 está arriba, no abajo
    const y = height - padding - ((Number(log.weight) - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', maxWidth: '400px' }}>
      <polyline points={points.join(' ')} fill="none" stroke="#4ade80" strokeWidth="2" />
      {sorted.map((log, i) => {
        const [x, y] = points[i].split(',');
        return <circle key={log.id} cx={x} cy={y} r="3" fill="#4ade80" />;
      })}
    </svg>
  );
}

export default function BodyWeight() {
  const queryClient = useQueryClient();
  const [weight, setWeight] = useState('');
  const [error, setError] = useState(null);

  const { data: logs, isLoading } = useQuery({
    queryKey: ['bodyweight'],
    queryFn: fetchBodyWeightLogs,
  });

  const mutation = useMutation({
    mutationFn: createBodyWeightLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bodyweight'] });
      setWeight('');
    },
    onError: (err) => {
      setError(err.response?.data?.error ?? 'Error al registrar el peso');
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!weight) {
      setError('Introduce un peso');
      return;
    }

    mutation.mutate({ weight: Number(weight) });
  }

  if (isLoading) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Peso corporal</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          type="number"
          step="0.1"
          placeholder="Peso (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Guardando...' : 'Registrar'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <WeightChart logs={logs} />

      {logs.length === 0 ? (
        <p>Todavía no has registrado ningún peso.</p>
      ) : (
        <ul>
          {logs.map((log) => (
            <li key={log.id}>
              {new Date(log.date).toLocaleDateString()} — {log.weight} kg
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
