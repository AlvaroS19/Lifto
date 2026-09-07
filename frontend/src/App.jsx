import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Routines from './pages/Routines.jsx';
import RoutineNew from './pages/RoutineNew.jsx';
import RoutineDetail from './pages/RoutineDetail.jsx';
import ExerciseNew from './pages/ExerciseNew.jsx';
import SessionTrain from './pages/SessionTrain.jsx';
import BodyWeight from './pages/BodyWeight.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AppLayout from './components/AppLayout.jsx';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Todas las rutas protegidas cuelgan de este padre: comparten
          el ProtectedRoute (redirige a /login si no hay sesión) y el
          AppLayout (tab bar fijo). Las rutas hijas se renderizan
          dentro del <Outlet /> del layout. */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/routines" element={<Routines />} />
        <Route path="/routines/new" element={<RoutineNew />} />
        <Route path="/routines/:id" element={<RoutineDetail />} />
        <Route path="/exercises/new" element={<ExerciseNew />} />
        <Route path="/sessions/:id" element={<SessionTrain />} />
        <Route path="/bodyweight" element={<BodyWeight />} />
        <Route path="/" element={<Navigate to="/routines" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
