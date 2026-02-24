import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import "../../styles/components/Navbar.css";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  // Estado original
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [scrolled, setScrolled] = useState(false);
  
  // NUEVO: Estado para el menú móvil
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Efecto para el tema (Original)
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Efecto para detectar scroll (Original)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  if (!user) return null;

  const handleLogoutClick = () => {
    onLogout(); // Mantiene tu función original
    navigate("/");
  };

  // NUEVO: Función para cerrar el menú al navegar
  const closeMenu = () => setIsMobileMenuOpen(false);

  const isStaff = user.role === "admin" || user.role === "teacher";

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          
          {/* 1. LOGO (Lleva al Dashboard) */}
          <div className="nav-left">
            <Link to="/dashboard" className="nav-brand" onClick={closeMenu}>
              <span className="brand-logo">⚡</span>
              <div className="brand-text">
                <span className="brand-highlight">MIPS</span> Studio
              </div>
              <span className={`nav-role-badge role-${user.role}`}>
                {user.role === 'admin' ? 'ADMIN' : (user.role === 'teacher' ? 'PROF' : 'STUDENT')}
              </span>
            </Link>
          </div>

          {/* 2. ENLACES CENTRALES (Desktop Only - Se oculta en móvil por CSS) */}
          <div className="nav-center desktop-only">
            <NavLink to="/evaluator" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Evaluator
            </NavLink>
            <NavLink to="/ide" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Web IDE
            </NavLink>

            {isStaff && <div className="separator-vertical"></div>}

            {isStaff && (
              <NavLink to="/exercise-management" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                Exercises
              </NavLink>
            )}

            {user.role === "admin" && (
              <NavLink to="/management" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                Users
              </NavLink>
            )}
          </div>

          {/* 3. PERFIL Y ACCIONES */}
          <div className="nav-right">
            {/* Botón Tema (Visible siempre o puedes ocultarlo en móvil si prefieres que esté en el sidebar) */}
            <button 
              onClick={toggleTheme} 
              className="icon-btn theme-btn desktop-only"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            {/* Perfil (Desktop Only) */}
            <Link to="/profile" className="profile-wrapper desktop-only">
              <div className="user-avatar-small">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="user-info-mini">
                <span className="user-name">{user.name?.split(' ')[0]}</span>
              </div>
            </Link>

            {/* Logout (Desktop Only) */}
            <button onClick={handleLogoutClick} className="logout-btn desktop-only" title="Sign Out">
              ⏻
            </button>

            {/* NUEVO: BOTÓN HAMBURGUESA (Solo Móvil) */}
            <button 
              className="mobile-menu-btn" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Abrir menú"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* --- NUEVO: SIDEBAR MÓVIL (DRAWER) --- */}
      
      {/* Overlay oscuro */}
      <div 
        className={`mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`} 
        onClick={closeMenu}
      />

      {/* Panel Lateral */}
      <aside className={`mobile-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <span className="brand-text">Menú</span>
          <button className="close-sidebar-btn" onClick={closeMenu}>✕</button>
        </div>

        <div className="sidebar-content">
          {/* Enlaces duplicados para móvil con estilos de sidebar */}
          <nav className="sidebar-nav">
            <NavLink to="/dashboard" onClick={closeMenu} className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}>
               Dashboard
            </NavLink>
            <NavLink to="/evaluator" onClick={closeMenu} className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}>
               Evaluator
            </NavLink>
            <NavLink to="/ide" onClick={closeMenu} className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}>
               Web IDE
            </NavLink>

            {isStaff && (
              <NavLink to="/exercise-management" onClick={closeMenu} className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}>
                 Exercises
              </NavLink>
            )}

            {user.role === "admin" && (
              <NavLink to="/management" onClick={closeMenu} className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}>
                 Users Management
              </NavLink>
            )}
          </nav>
        </div>

        {/* Footer del Sidebar con Perfil y Acciones */}
        <div className="sidebar-footer">
           <div className="sidebar-user-row">
              <div className="user-avatar-small">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="user-name">{user.name}</span>
           </div>
           
           <div className="sidebar-actions-row">
              <button onClick={toggleTheme} className="sidebar-action-btn">
                {theme === "dark" ? "Modo Claro ☀️" : "Modo Oscuro 🌙"}
              </button>
              <Link to="/profile" onClick={closeMenu} className="sidebar-action-btn">
                Mi Perfil
              </Link>
           </div>

           <button onClick={() => { closeMenu(); handleLogoutClick(); }} className="sidebar-logout-btn">
             Cerrar Sesión
           </button>
        </div>
      </aside>
    </>
  );
};

export default Navbar;