import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../lib/auth';

// Iconos como componentes SVG simples: ligeros, sin librería externa,
// y se colorean solos heredando el "currentColor" del texto del tab.
function IconDumbbell() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 7v10M4 9v6M2 10v4M18 7v10M20 9v6M22 10v4M6 12h12" />
    </svg>
  );
}

function IconScale() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <path d="M8 15c0-2.2 1.8-4 4-4s4 1.8 4 4" />
    </svg>
  );
}

function IconExit() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}

const tabs = [
  { to: '/routines', label: 'Rutinas', icon: IconDumbbell },
  { to: '/bodyweight', label: 'Peso', icon: IconScale },
];

export default function TabBar() {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="tabbar">
      {tabs.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `tabbar-item${isActive ? ' active' : ''}`}
        >
          <Icon />
          {label}
        </NavLink>
      ))}

      <button className="tabbar-item tabbar-button" onClick={handleLogout}>
        <IconExit />
        Salir
      </button>
    </nav>
  );
}
