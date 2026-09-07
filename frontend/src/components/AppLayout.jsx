import { Outlet } from 'react-router-dom';
import TabBar from './TabBar.jsx';

// El <Outlet /> es donde React Router "inyecta" la página activa
// (Routines, RoutineDetail, BodyWeight...). El <TabBar /> se queda
// fijo abajo, fuera de ese hueco, así que persiste entre pantallas.
export default function AppLayout() {
  return (
    <div style={{ paddingBottom: '64px' }}>
      <Outlet />
      <TabBar />
    </div>
  );
}
