import React, { useState } from 'react';
import { BIcon, KeyIcon, UserPlusIcon } from './icons';
import { Gravity, MatterBody } from './ui/gravity';

interface AuthPageProps {
  onLogin: (username: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Mock authentication
    setTimeout(() => {
      setLoading(false);
      if (isLogin) {
        if (email && password) {
          onLogin(email.split('@')[0]);
        } else {
          setError('Please fill in all fields');
        }
      } else {
        if (email && password && name) {
          onLogin(name);
        } else {
          setError('Please fill in all fields');
        }
      }
    }, 1000);
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 relative overflow-hidden font-azeretMono">
      <Gravity gravity={{ x: 0, y: 1 }} className="absolute inset-0 w-full h-full">
        <MatterBody
          matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
          x="10%"
          y="20%"
        >
          <div className="text-xl sm:text-2xl font-bold bg-[#0015ff] text-white rounded-full hover:cursor-pointer px-6 py-3 shadow-lg transform hover:scale-110 transition-transform">
            React
          </div>
        </MatterBody>
        <MatterBody
          matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
          x="30%"
          y="10%"
        >
          <div className="text-xl sm:text-2xl font-bold bg-[#E794DA] text-white rounded-full hover:cursor-grab px-6 py-3 shadow-lg transform hover:scale-110 transition-transform">
            TypeScript
          </div>
        </MatterBody>
        <MatterBody
          matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
          x="80%"
          y="20%"
          angle={10}
        >
          <div className="text-xl sm:text-2xl font-bold bg-[#1f464d] text-white rounded-full hover:cursor-grab px-6 py-3 shadow-lg transform hover:scale-110 transition-transform">
            Groq API
          </div>
        </MatterBody>
        <MatterBody
          matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
          x="75%"
          y="10%"
        >
          <div className="text-xl sm:text-2xl font-bold bg-[#ff5941] text-white rounded-full hover:cursor-grab px-6 py-3 shadow-lg transform hover:scale-110 transition-transform">
            Tailwind
          </div>
        </MatterBody>
        <MatterBody
          matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
          x="85%"
          y="30%"
        >
          <div className="text-xl sm:text-2xl font-bold bg-orange-500 text-white rounded-full hover:cursor-grab px-6 py-3 shadow-lg transform hover:scale-110 transition-transform">
            Vite
          </div>
        </MatterBody>
        <MatterBody
          matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
          x="15%"
          y="40%"
        >
          <div className="text-xl sm:text-2xl font-bold bg-[#ffd726] text-black rounded-full hover:cursor-grab px-6 py-3 shadow-lg transform hover:scale-110 transition-transform">
            Matter.js
          </div>
        </MatterBody>
      </Gravity>

      <div className="w-full max-w-md p-8 space-y-8 relative z-10 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
        <div className="text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <BIcon className="w-12 h-12 text-teal-600 drop-shadow-sm" />
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight text-center">ADAPTIVE AI</h1>
          </div>
          <p className="mt-2 text-slate-500 font-medium">{isLogin ? 'Welcome back. Sign in to continue.' : 'Create an account to get started.'}</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="text-sm font-bold text-slate-600 tracking-wide">Name</label>
              <input
                className="w-full p-3 mt-2 text-slate-800 bg-white/50 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none transition"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div>
            <label className="text-sm font-bold text-slate-600 tracking-wide">Email</label>
            <input
              className="w-full p-3 mt-2 text-slate-800 bg-white/50 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none transition"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-600 tracking-wide">Password</label>
            <input
              className="w-full p-3 mt-2 text-slate-800 bg-white/50 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none transition"
              type="password"
              placeholder="************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center font-semibold">{error}</p>}
          <div>
            <button type="submit" className="w-full flex justify-center items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-lg font-bold tracking-wide cursor-pointer transition-all duration-300 shadow-lg shadow-teal-500/20 transform hover:-translate-y-0.5" disabled={loading}>
              {loading ? <span>Loading...</span> : (isLogin ? <><KeyIcon className="w-5 h-5" /><span>Sign In</span></> : <><UserPlusIcon className="w-5 h-5" /><span>Create Account</span></>)}
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-slate-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={toggleForm} className="font-bold text-teal-600 hover:text-teal-700 hover:underline transition-colors">
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
