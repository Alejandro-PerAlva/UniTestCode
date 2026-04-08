// src/pages/LoginPage.tsx
import React from 'react';
import { useLoginLogic } from '../hooks/auth/useLoginLogic';
import AuthForm from '../components/auth/AuthForm';

const LoginPage: React.FC = () => {
  // 1. Instanciamos el cerebro
  const loginLogic = useLoginLogic();

  // 2. Pintamos el layout general y le pasamos el cerebro al componente visual
  return (
    <div className="h-full w-full bg-gray-950 flex items-center justify-center p-4">
      <AuthForm 
        isLogin={loginLogic.isLogin}
        email={loginLogic.email}
        setEmail={loginLogic.setEmail}
        password={loginLogic.password}
        setPassword={loginLogic.setPassword}
        role={loginLogic.role}
        setRole={loginLogic.setRole}
        secretCode={loginLogic.secretCode}
        setSecretCode={loginLogic.setSecretCode}
        error={loginLogic.error}
        isLoading={loginLogic.isLoading}
        onSubmit={loginLogic.handleSubmit}
        onToggleMode={loginLogic.toggleAuthMode}
      />
    </div>
  );
};

export default LoginPage;