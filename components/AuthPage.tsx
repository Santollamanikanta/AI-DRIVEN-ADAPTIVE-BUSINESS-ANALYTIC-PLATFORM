
import React, { useState } from 'react';
import { SparklesIcon, KeyIcon, UserPlusIcon } from './icons';

interface AuthPageProps {
  onLogin: (username: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    if (isLogin) {
      // Login logic
      const storedPassword = localStorage.getItem(`user_${username}`);
      if (storedPassword === password) {
        setSuccess('Login successful!');
        setTimeout(() => onLogin(username), 1000);
      } else {
        setError('Invalid username or password.');
      }
    } else {
      // Register logic
      if (localStorage.getItem(`user_${username}`)) {
        setError('Username already exists.');
      } else {
        localStorage.setItem(`user_${username}`, password);
        setSuccess('Registration successful! Logging you in...');
        // Automatically log the user in after successful registration
        setTimeout(() => onLogin(username), 1000);
      }
    }
  };

  const toggleForm = () => {
      setIsLogin(!isLogin);
      setError('');
      setSuccess('');
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
                <SparklesIcon className="w-10 h-10 text-teal-600" />
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">BizAnalytica AI</h1>
            </div>
          <p className="mt-2 text-slate-500">{isLogin ? 'Welcome back. Sign in to continue.' : 'Create an account to get started.'}</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-bold text-slate-600 tracking-wide">Username</label>
            <input
              className="w-full p-3 mt-2 text-slate-800 bg-white rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none transition"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-600 tracking-wide">Password</label>
            <input
              className="w-full p-3 mt-2 text-slate-800 bg-white rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none transition"
              type="password"
              placeholder="************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center">{success}</p>}
          <div>
            <button type="submit" className="w-full flex justify-center items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-lg font-semibold tracking-wide cursor-pointer transition-colors duration-300 shadow-lg shadow-teal-500/20">
              {isLogin ? <><KeyIcon className="w-5 h-5" /><span>Sign In</span></> : <><UserPlusIcon className="w-5 h-5" /><span>Create Account</span></>}
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-slate-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={toggleForm} className="font-semibold text-teal-600 hover:underline">
                {isLogin ? "Sign Up" : "Sign In"}
            </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
