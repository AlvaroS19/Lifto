import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Routines from './pages/Routines.jsx';
import RoutineNew from './pages/RoutineNew.jsx';
import RoutineDetail from './pages/RoutineDetail.jsx';
import ExerciseNew from './pages/ExerciseNew.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/routines"
        element={
          <ProtectedRoute>
            <Routines />
          </ProtectedRoute>
        }
      />
      <Route
        path="/routines/new"
        element={
          <ProtectedRoute>
            <RoutineNew />
          </ProtectedRoute>
        }
      />
      <Route
        path="/routines/:id"
        element={
          <ProtectedRoute>
            <RoutineDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exercises/new"
        element={
          <ProtectedRoute>
            <ExerciseNew />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/routines" replace />} />
    </Routes>
  );
}

export default App;
