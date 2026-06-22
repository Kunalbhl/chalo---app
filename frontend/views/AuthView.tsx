import React, { useState } from 'react';
import { Mail, Lock, User, Smartphone, ArrowLeft, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { ChaloLogo } from '../components/Icons';

interface AuthViewProps {
  onLoginSuccess: (userData: { name: string; email: string; phone: string }) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const getUsers = () => {
    const users = localStorage.getItem('chalo_users_db');
    return users ? JSON.parse(users) : [];
  };

  const saveUser = (user: any) => {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('chalo_users_db', JSON.stringify(users));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    setTimeout(() => {
      const users = getUsers();

      if (mode === 'register') {
        if (users.find((u: any) => u.email === email)) {
          setMessage({ type: 'error', text: 'Email already registered. Please login.' });
        } else {
          const newUser = { name, email, phone, password };
          saveUser(newUser);
          setMessage({ type: 'success', text: 'Registration successful! Logging in...' });
          setTimeout(() => onLoginSuccess(newUser), 1000);
        }
      } else if (mode === 'login') {
        const user = users.find((u: any) => u.email === email && u.password === password);
        if (user) {
          setMessage({ type: 'success', text: 'Login successful!' });
          setTimeout(() => onLoginSuccess(user), 1000);
        } else {
          setMessage({ type: 'error', text: 'Invalid email or password.' });
        }
      } else if (mode === 'forgot') {
        const user = users.find((u: any) => u.email === email);
        if (user) {
          setMessage({ type: 'success', text: 'Password reset link sent to your email!' });
          setTimeout(() => setMode('login'), 3000);
        } else {
          setMessage({ type: 'error', text: 'No account found with this email.' });
        }
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>

      <div className="flex-1 flex flex-col justify-center p-6 relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-white p-3 rounded-2xl shadow-glow-indigo mb-4">
            <ChaloLogo className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Chalo</h1>
          <p className="text-xs text-brand-300 font-bold uppercase tracking-[0.2em] mt-1">India's Everyday Super App</p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl rounded-[2rem] p-6 border border-slate-800 shadow-2xl">
          {mode !== 'login' && (
            <button 
              onClick={() => { setMode('login'); setMessage(null); }}
              className="flex items-center text-slate-400 hover:text-white text-sm font-bold mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
            </button>
          )}

          <h2 className="text-2xl font-bold text-white mb-2">
            {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Create Account' : 'Reset Password'}
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            {mode === 'login' ? 'Enter your details to access your account.' : 
             mode === 'register' ? 'Join Chalo to unlock seamless bookings.' : 
             'Enter your email to receive a reset link.'}
          </p>

          {message && (
            <div className={`p-4 rounded-xl mb-6 text-sm font-bold flex items-start gap-2 ${
              message.type === 'error' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              {message.type === 'success' && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                  />
                </div>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    type="tel" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Mobile Number" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address" 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:ring-2 focus:ring-brand-500 outline-none font-medium"
              />
            </div>

            {mode !== 'forgot' && (
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                />
              </div>
            )}

            {mode === 'login' && (
              <div className="flex justify-end">
                <button 
                  type="button"
                  onClick={() => { setMode('forgot'); setMessage(null); }}
                  className="text-brand-400 text-xs font-bold hover:text-brand-300 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-lg shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {mode === 'login' ? 'Login' : mode === 'register' ? 'Create Account' : 'Send Reset Link'}
            </button>
          </form>

          {mode === 'login' && (
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-400">
                Don't have an account?{' '}
                <button 
                  onClick={() => { setMode('register'); setMessage(null); }}
                  className="text-brand-400 font-bold hover:text-brand-300 transition-colors"
                >
                  Sign Up
                </button>
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" /> Secured by Chalo Auth
        </div>
      </div>
    </div>
  );
};
