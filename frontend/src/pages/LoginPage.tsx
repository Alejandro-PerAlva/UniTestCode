/**
 * @module LoginPage
 * The unauthenticated entry point of the application.
 * Wraps the authentication forms and handles login/registration logic delegation.
 */

import React from 'react';
import { useLoginLogic } from '../hooks/auth/useLoginLogic';
import AuthForm from '../components/auth/AuthForm';

const LoginPage: React.FC = () => {
  const loginLogic = useLoginLogic();

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