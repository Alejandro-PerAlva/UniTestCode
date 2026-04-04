import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import IdePage from './pages/IdePage';
import SubmissionPage from './pages/SubmissionPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import { socket } from './services/socket';
import { isAuthenticated, isTeacher } from './services/auth';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return children;
};

const TeacherRoute = ({ children }: { children: JSX.Element }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (!isTeacher()) return <Navigate to="/home" replace />;
  return children;
};

function App() {
  const [isAuth, setIsAuth] = useState(isAuthenticated());

  useEffect(() => {
    const handleAuthChange = () => setIsAuth(isAuthenticated());
    window.addEventListener('auth_change', handleAuthChange);

    socket.connect();

    return () => {
      window.removeEventListener('auth_change', handleAuthChange);
      socket.disconnect();
    };
  }, []);

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