/**
 * @module App
 * Root application component.
 * Configures the React Router hierarchy, global authentication state, and route-level access guards.
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppLogic } from './hooks/core/useAppLogic';
import Navbar from './components/layout/Navbar';
import { ProtectedRoute, TeacherRoute } from './components/layout/RouteGuards';
import HomePage from './pages/HomePage';
import IdePage from './pages/IdePage';
import SubmissionPage from './pages/SubmissionPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';

function App() {
  const { isAuth } = useAppLogic();

  return (
    <Router>
      <div className="flex flex-col h-screen w-screen bg-gray-950 overflow-hidden">
        
        {isAuth && <Navbar />}
        
        <main className="flex-1 overflow-hidden relative">
          <Routes>
            <Route path="/login" element={
              isAuth ? <Navigate to="/home" replace /> : <LoginPage />
            } />
            
            <Route path="/" element={<Navigate to="/home" replace />} />

            <Route path="/home" element={
              <ProtectedRoute><HomePage /></ProtectedRoute>
            } />
            
            <Route path="/ide" element={
              <ProtectedRoute><IdePage /></ProtectedRoute>
            } />
            
            <Route path="/submit" element={
              <ProtectedRoute><SubmissionPage /></ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <TeacherRoute><AdminPage /></TeacherRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;