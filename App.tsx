
import React, { useState, useEffect } from 'react';
import AuthPage from './components/AuthPage';
import MainApp from './components/MainApp';
import { Loader } from './components/ui/Loader';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for a logged-in user in localStorage
    const loggedInUser = localStorage.getItem('loggedInUser');
    setIsAuthenticated(!!loggedInUser);
  }, []);

  const handleLogin = (username: string) => {
    localStorage.setItem('loggedInUser', username);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {isAuthenticated ? (
        <MainApp onLogout={handleLogout} />
      ) : (
        <AuthPage onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
