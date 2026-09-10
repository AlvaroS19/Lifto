import logoIcon from '../assets/logo-icon.png';

export default function AppHeader() {
  return (
    <header className="app-header">
      <img src={logoIcon} alt="Lifto" style={{ height: '28px' }} />
    </header>
  );
}
