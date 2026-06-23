import React, { useState, useEffect, useRef } from 'react';
import { Mail, Lock, User, Smartphone, ArrowLeft, ShieldCheck, Loader2, CheckCircle2, Eye, EyeOff, Fingerprint, ScanFace, Camera } from 'lucide-react';
import { ChaloLogo } from '../components/Icons';
import { SecurityLog } from '../types';

interface AuthViewProps {
  onLoginSuccess: (userData: { name: string; email: string; phone: string }, isNewUser: boolean) => void;
  biometricEnabled: boolean;
  onAddSecurityLog: (log: SecurityLog) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess, biometricEnabled, onAddSecurityLog }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'biometric' | 'passcode'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [passcode, setPasscode] = useState(['', '', '', '']);
  const passcodeRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  // Camera for Security Selfie
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Load remembered credentials on mount
    const savedEmail = localStorage.getItem('chalo_remembered_email');
    const savedPassword = localStorage.getItem('chalo_remembered_password');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
      if (biometricEnabled) {
        setMode('biometric');
      }
    }
  }, [biometricEnabled]);

  const getUsers = () => {
    const users = localStorage.getItem('chalo_users_db');
    return users ? JSON.parse(users) : [];
  };

  const saveUser = (user: any) => {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('chalo_users_db', JSON.stringify(users));
  };

  const captureSelfie = async (): Promise<string | undefined> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait for video to start
        if (canvasRef.current) {
          const context = canvasRef.current.getContext('2d');
          if (context) {
            context.drawImage(videoRef.current, 0, 0, 320, 240);
            const dataUrl = canvasRef.current.toDataURL('image/jpeg');
            stream.getTracks().forEach(track => track.stop());
            return dataUrl;
          }
        }
      }
    } catch (err) {
      console.error("Error capturing selfie:", err);
    }
    return undefined;
  };

  const handleFailedLogin = async (reason: string) => {
    const imageUrl = await captureSelfie();
    onAddSecurityLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      type: 'failed_login',
      details: `Failed login attempt for ${email || 'unknown user'}. Reason: ${reason}`,
      imageUrl
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    setTimeout(async () => {
      const users = getUsers();

      if (mode === 'register') {
        if (users.find((u: any) => u.email === email)) {
          setMessage({ type: 'error', text: 'Email already registered. Please login.' });
        } else {
          const newUser = { name, email, phone, password };
          saveUser(newUser);
          
          if (rememberMe) {
            localStorage.setItem('chalo_remembered_email', email);
            localStorage.setItem('chalo_remembered_password', password);
          } else {
            localStorage.removeItem('chalo_remembered_email');
            localStorage.removeItem('chalo_remembered_password');
          }

          setMessage({ type: 'success', text: 'Registration successful! Logging in...' });
          setTimeout(() => onLoginSuccess(newUser, true), 1000);
        }
      } else if (mode === 'login') {
        const user = users.find((u: any) => u.email === email);
        
        if (user && user.password === password) {
          if (rememberMe) {
            localStorage.setItem('chalo_remembered_email', email);
            localStorage.setItem('chalo_remembered_password', password);
          } else {
            localStorage.removeItem('chalo_remembered_email');
            localStorage.removeItem('chalo_remembered_password');
          }
          
          setMessage({ type: 'success', text: 'Login successful!' });
          setTimeout(() => onLoginSuccess(user, false), 1000);
        } else {
          setMessage({ type: 'error', text: 'Invalid email or password.' });
          await handleFailedLogin('Invalid credentials');
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

  const handleBiometricAuth = () => {
    setIsLoading(true);
    setTimeout(async () => {
      // Simulate 80% success rate for biometric
      if (Math.random() > 0.2) {
        const users = getUsers();
        const user = users.find((u: any) => u.email === email);
        if (user) {
          setMessage({ type: 'success', text: 'Authentication successful!' });
          setTimeout(() => onLoginSuccess(user, false), 1000);
        } else {
          setMode('login');
        }
      } else {
        setMessage({ type: 'error', text: 'Biometric authentication failed.' });
        await handleFailedLogin('Biometric mismatch');
        setTimeout(() => setMode('passcode'), 1500);
      }
      setIsLoading(false);
    }, 1500);
  };

  const handlePasscodeChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newPasscode = [...passcode];
    newPasscode[index] = value;
    setPasscode(newPasscode);

    if (value && index < 3) {
      passcodeRefs[index + 1].current?.focus();
    }

    if (newPasscode.every(p => p !== '')) {
      verifyPasscode(newPasscode.join(''));
    }
  };

  const verifyPasscode = async (code: string) => {
    setIsLoading(true);
    setTimeout(async () => {
      // Mock passcode verification (e.g., '1234')
      if (code === '1234') {
        const users = getUsers();
        const user = users.find((u: any) => u.email === email);
        if (user) {
          setMessage({ type: 'success', text: 'Passcode verified!' });
          setTimeout(() => onLoginSuccess(user, false), 1000);
        }
      } else {
        setMessage({ type: 'error', text: 'Incorrect passcode.' });
        setPasscode(['', '', '', '']);
        passcodeRefs[0].current?.focus();
        await handleFailedLogin('Incorrect passcode');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100 relative overflow-hidden">
      {/* Hidden Video/Canvas for Security Selfie */}
      <video ref={videoRef} className="hidden" autoPlay playsInline muted />
      <canvas ref={canvasRef} width="320" height="240" className="hidden" />

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
          {mode !== 'login' && mode !== 'biometric' && (
            <button 
              onClick={() => { setMode('login'); setMessage(null); }}
              className="flex items-center text-slate-400 hover:text-white text-sm font-bold mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
            </button>
          )}

          <h2 className="text-2xl font-bold text-white mb-2">
            {mode === 'login' ? 'Welcome Back' : 
             mode === 'register' ? 'Create Account' : 
             mode === 'forgot' ? 'Reset Password' :
             mode === 'biometric' ? 'Unlock Chalo' : 'Enter Passcode'}
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            {mode === 'login' ? 'Enter your details to access your account.' : 
             mode === 'register' ? 'Join Chalo to unlock seamless bookings.' : 
             mode === 'forgot' ? 'Enter your email to receive a reset link.' :
             mode === 'biometric' ? 'Use Fingerprint or Face ID to continue.' :
             'Enter your 4-digit app passcode.'}
          </p>

          {message && (
            <div className={`p-4 rounded-xl mb-6 text-sm font-bold flex items-start gap-2 ${
              message.type === 'error' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              {message.type === 'success' && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
              {message.text}
            </div>
          )}

          {mode === 'biometric' ? (
            <div className="flex flex-col items-center py-8">
              <button 
                onClick={handleBiometricAuth}
                disabled={isLoading}
                className="w-24 h-24 bg-brand-500/10 border border-brand-500/30 rounded-full flex items-center justify-center text-brand-400 hover:bg-brand-500/20 transition-all active:scale-95 mb-6"
              >
                {isLoading ? <Loader2 className="w-10 h-10 animate-spin" /> : <Fingerprint className="w-12 h-12" />}
              </button>
              <p className="text-sm text-slate-400 mb-6">Tap to authenticate</p>
              <button 
                onClick={() => setMode('passcode')}
                className="text-brand-400 text-sm font-bold hover:text-brand-300 transition-colors"
              >
                Use Passcode Instead
              </button>
            </div>
          ) : mode === 'passcode' ? (
            <div className="flex flex-col items-center py-4">
              <div className="flex gap-4 mb-8">
                {passcode.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={passcodeRefs[idx]}
                    type="password"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePasscodeChange(idx, e.target.value)}
                    className="w-14 h-14 bg-slate-950 border border-slate-800 rounded-xl text-center text-2xl font-bold text-white focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                ))}
              </div>
              <button 
                onClick={() => setMode('login')}
                className="text-brand-400 text-sm font-bold hover:text-brand-300 transition-colors"
              >
                Login with Password
              </button>
            </div>
          ) : (
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
                    type={showPassword ? "text" : "password"} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-12 pr-12 text-white focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              )}

              {mode === 'login' && (
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-brand-600 focus:ring-brand-500 focus:ring-offset-slate-900"
                    />
                    <span className="text-xs text-slate-400 font-medium">Remember me</span>
                  </label>
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
          )}

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
