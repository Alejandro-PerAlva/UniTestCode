import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// --- COMPONENTES GLOBALES ---
import Navbar from "./components/layout/Navbar";

// --- PÁGINAS ---
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import UserProfilePage from "./pages/UserProfilePage";
import IDEPage from "./pages/IDEPage";
import MultiEvaluatorPage from "./pages/MultiEvaluatorPage";
import AdminExercisesPage from "./pages/AdminExercisesPage";
import AdminUsersPage from "./pages/AdminUsersPage";

function App() {
  // --- GESTIÓN DE ESTADO DE USUARIO ---
  const [user, setUser] = useState(() => {
    const savedSession = localStorage.getItem("mips_session");
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (Date.now() < parsed.expiry) {
          return parsed.userData || parsed.user; 
        }
        localStorage.removeItem("mips_session");
      } catch (err) {
        return null;
      }
    }
    return null;
  });

  // --- HANDLERS ---
  
  const loginHandler = (data) => {
    const SESSION_DURATION = 3600000; // 1 hora
    const expiry = Date.now() + SESSION_DURATION;
    
    // Normalización robusta del token y datos del usuario
    // Si data.token no existe (como en QuickLogin), ponemos un token de desarrollo
    const token = data.token || (data.user && data.user.token) || "dev-token-session";
    const userData = data.user || data;

    const sessionObject = {
      token: token,
      userData: userData,
      expiry
    };

    localStorage.setItem("mips_session", JSON.stringify(sessionObject));
    setUser(userData);
  };

  const logoutHandler = () => {
    localStorage.removeItem("mips_session");
    setUser(null);
  };

  // --- EFECTOS ---
  
  useEffect(() => {
    if (!user) return;
    const checkInterval = setInterval(() => {
      const savedSession = localStorage.getItem("mips_session");
      if (savedSession) {
        try {
          const { expiry } = JSON.parse(savedSession);
          if (Date.now() >= expiry) {
            logoutHandler();
            alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
          }
        } catch (e) {
          logoutHandler();
        }
      }
    }, 10000);
    return () => clearInterval(checkInterval);
  }, [user]);

  // --- PROTECTORES DE RUTA ---
  const RequireAuth = ({ children }) => user ? children : <Navigate to="/" replace />;
  const RequireStaff = ({ children }) => (user?.role === "admin" || user?.role === "teacher") ? children : <Navigate to="/dashboard" replace />;
  const RequireAdmin = ({ children }) => user?.role === "admin" ? children : <Navigate to="/dashboard" replace />;

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={logoutHandler} />

      <Routes>
        <Route 
          path="/" 
          element={user ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={loginHandler} />} 
        />

        <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><UserProfilePage user={user} /></RequireAuth>} />
        
        <Route path="/evaluator" element={<RequireAuth><MultiEvaluatorPage /></RequireAuth>} />
        <Route path="/ide" element={<RequireAuth><IDEPage /></RequireAuth>} />

        <Route
          path="/exercise-management"
          element={<RequireStaff><AdminExercisesPage /></RequireStaff>}
        />

        <Route
          path="/management"
          element={<RequireAdmin><AdminUsersPage /></RequireAdmin>}
        />

        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;