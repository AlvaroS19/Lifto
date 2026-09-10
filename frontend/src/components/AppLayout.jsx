import { Outlet } from 'react-router-dom';
import TabBar from './TabBar.jsx';
import AppHeader from './AppHeader.jsx';

export default function AppLayout() {
  return (
    <>
      <AppHeader />
      <Outlet />
      <TabBar />
    </>
  );
}
