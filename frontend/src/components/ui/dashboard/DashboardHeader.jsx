import React from 'react';

const DashboardHeader = () => {
  return (
    <header className="dashboard-header-main">
      <div className="badge-top">SYSTEM OVERVIEW</div>
      <h1>
        Centro de Control <span className="text-gradient">MIPS Studio</span>
      </h1>
      <p className="main-subtitle">
        Gestiona tus algoritmos en ensamblador, valida tu lógica de bajo nivel
        y monitoriza tu progreso en una plataforma integral.
      </p>
    </header>
  );
};

export default DashboardHeader;