import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Competitions from './pages/Competitions';
import Players from './pages/Players';
import Statistics from './pages/Statistics';
import CompetitionDetails from './pages/CompetitionDetails';
import CompetitionStats from './pages/CompetitionStats';
import GameDetails from './pages/GameDetails';

// Componente para proteger rotas
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

// Componente para redirecionar usuários logados
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />

          {/* Rotas protegidas */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/competitions" element={
            <PrivateRoute>
              <Competitions />
            </PrivateRoute>
          } />
          <Route path="/competitions/:id" element={
            <PrivateRoute>
              <CompetitionDetails />
            </PrivateRoute>
          } />
          <Route path="/competitions/:id/stats" element={
            <PrivateRoute>
              <CompetitionStats />
            </PrivateRoute>
          } />
          <Route path="/games/:id" element={
            <PrivateRoute>
              <GameDetails />
            </PrivateRoute>
          } />
          <Route path="/players" element={
            <PrivateRoute>
              <Players />
            </PrivateRoute>
          } />
          <Route path="/statistics" element={
            <PrivateRoute>
              <Statistics />
            </PrivateRoute>
          } />

          {/* Rota padrão */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
