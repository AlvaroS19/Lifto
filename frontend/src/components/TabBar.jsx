import { NavLink } from 'react-router-dom';
import { logout } from '../lib/auth';
import { useNavigate } from 'react-router-dom';

const tabs = [
  { to: '/routines', label: 'Rutinas', icon: '🏋️' },
  { to: '/bodyweight', label: 'Peso', icon: '⚖️' },
];

const tabStyle = ({ isActive }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2px',
  textDecoration: 'none',
  color: isActive ? '#4ade80' : '#999',
  fontSize: '12px',
});

export default function TabBar() {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '8px 0',
        background: '#111',
        borderTop: '1px solid #333',
      }}
    >
      {tabs.map((tab) => (
        <NavLink key={tab.to} to={tab.to} style={tabStyle}>
          <span style={{ fontSize: '20px' }}>{tab.icon}</span>
          {tab.label}
        </NavLink>
      ))}

      <button
        onClick={handleLogout}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: '#999',
          fontSize: '12px',
          cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: '20px' }}>🚪</span>
        Salir
      </button>
    </nav>
  );
}
