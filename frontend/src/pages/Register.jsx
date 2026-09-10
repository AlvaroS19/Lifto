import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../lib/auth';
import logo from '../assets/logo.png';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(email, password);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error ?? 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page" style={{ paddingTop: '48px' }}>
      <img src={logo} alt="Lifto" style={{ height: '64px', display: 'block', margin: '0 auto 8px' }} />
      <p style={{ textAlign: 'center', fontSize: '13px', letterSpacing: '0.03em', marginBottom: '32px' }}>
        Train. Track. Progress.
      </p>
      <h1>Crea tu cuenta</h1>
      <p style={{ marginBottom: '32px' }}>Empieza a registrar tu progreso desde hoy.</p>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn btn-block" disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Registrarse'}
        </button>
      </form>

      <p className="link-row">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}
