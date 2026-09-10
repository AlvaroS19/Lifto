import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBodyWeightLogs, createBodyWeightLog } from '../lib/bodyweight';

function WeightChart({ logs }) {
  if (logs.length < 2) return null;

  const sorted = [...logs].reverse();
  const weights = sorted.map((l) => Number(l.weight));
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const range = max - min || 1;

  const width = 320;
  const height = 120;
  const padding = 10;

  const points = sorted.map((log, i) => {
    const x = padding + (i / (sorted.length - 1)) * (width - padding * 2);
    const y = height - padding - ((Number(log.weight) - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  return (
    <div className="card">
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%' }}>
        <polyline points={points.join(' ')} fill="none" stroke="var(--primary-light)" strokeWidth="2.5" />
        {sorted.map((log, i) => {
          const [x, y] = points[i].split(',');
          return <circle key={log.id} cx={x} cy={y} r="3.5" fill="var(--primary-light)" />;
        })}
      </svg>
    </div>
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

  if (isLoading) return <div className="page"><p>Cargando...</p></div>;

  return (
    <div className="page">
      <h1>Peso corporal</h1>
      <p style={{ marginBottom: '20px' }}>Registra tu peso para seguir tu evolución.</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input
          type="number"
          step="0.1"
          placeholder="Peso (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <button type="submit" className="btn" style={{ whiteSpace: 'nowrap' }} disabled={mutation.isPending}>
          {mutation.isPending ? 'Guardando...' : 'Registrar'}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}

      <WeightChart logs={logs} />

      {logs.length === 0 ? (
        <p>Todavía no has registrado ningún peso.</p>
      ) : (
        logs.map((log) => (
          <div key={log.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              {new Date(log.date).toLocaleDateString()}
            </span>
            <span className="stat" style={{ fontSize: '16px' }}>{log.weight} kg</span>
          </div>
        ))
      )}
    </div>
  );
}
