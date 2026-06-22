import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, X, ShieldCheck, Smartphone, Lock, Mail, Calendar } from 'lucide-react';
import { AnyProvider, LinkedAccount } from '../types';

interface LinkedAccountsViewProps {
  onBack: () => void;
  linkedAccounts: LinkedAccount[];
  setLinkedAccounts: React.Dispatch<React.SetStateAction<LinkedAccount[]>>;
}

interface ProviderConfig {
  id: AnyProvider;
  name: string;
  category: 'Rides' | 'Food' | 'Mart' | 'Stays' | 'Travel';
  color: string;
  textColor: string;
  domain: string;
}

const PROVIDERS: ProviderConfig[] = [
  // Rides
  { id: 'uber', name: 'Uber', category: 'Rides', color: 'bg-black', textColor: 'text-white', domain: 'uber.com' },
  { id: 'ola', name: 'Ola', category: 'Rides', color: 'bg-[#cddc39]', textColor: 'text-black', domain: 'olacabs.com' },
  { id: 'rapido', name: 'Rapido', category: 'Rides', color: 'bg-[#f9c935]', textColor: 'text-black', domain: 'rapido.bike' },
  
  // Food
  { id: 'zomato', name: 'Zomato', category: 'Food', color: 'bg-red-600', textColor: 'text-white', domain: 'zomato.com' },
  { id: 'swiggy', name: 'Swiggy', category: 'Food', color: 'bg-orange-500', textColor: 'text-white', domain: 'swiggy.com' },
  { id: 'eatsure', name: 'EatSure', category: 'Food', color: 'bg-purple-500', textColor: 'text-white', domain: 'eatsure.com' },
  
  // Mart
  { id: 'zepto', name: 'Zepto', category: 'Mart', color: 'bg-purple-600', textColor: 'text-white', domain: 'zeptonow.com' },
  { id: 'blinkit', name: 'Blinkit', category: 'Mart', color: 'bg-yellow-400', textColor: 'text-black', domain: 'blinkit.com' },
  { id: 'instamart', name: 'Instamart', category: 'Mart', color: 'bg-orange-600', textColor: 'text-white', domain: 'swiggy.com' },
  
  // Stays
  { id: 'airbnb', name: 'Airbnb', category: 'Stays', color: 'bg-[#FF5A5F]', textColor: 'text-white', domain: 'airbnb.com' },
  { id: 'makemytrip', name: 'MakeMyTrip', category: 'Stays', color: 'bg-red-500', textColor: 'text-white', domain: 'makemytrip.com' },
  { id: 'bookingcom', name: 'Booking.com', category: 'Stays', color: 'bg-[#003580]', textColor: 'text-white', domain: 'booking.com' },
  { id: 'agoda', name: 'Agoda', category: 'Stays', color: 'bg-blue-500', textColor: 'text-white', domain: 'agoda.com' },
  { id: 'goibibo', name: 'Goibibo', category: 'Stays', color: 'bg-orange-500', textColor: 'text-white', domain: 'goibibo.com' },
  { id: 'cleartrip', name: 'Cleartrip', category: 'Stays', color: 'bg-green-500', textColor: 'text-white', domain: 'cleartrip.com' },
  
  // Travel
  { id: 'irctc', name: 'IRCTC', category: 'Travel', color: 'bg-blue-800', textColor: 'text-white', domain: 'irctc.co.in' },
  { id: 'ixigo', name: 'Ixigo', category: 'Travel', color: 'bg-orange-600', textColor: 'text-white', domain: 'ixigo.com' },
  { id: 'skyscanner', name: 'Skyscanner', category: 'Travel', color: 'bg-sky-500', textColor: 'text-white', domain: 'skyscanner.co.in' },
  { id: 'kayak', name: 'KAYAK', category: 'Travel', color: 'bg-orange-400', textColor: 'text-white', domain: 'kayak.co.in' },
];

export const LinkedAccountsView: React.FC<LinkedAccountsViewProps> = ({ onBack, linkedAccounts, setLinkedAccounts }) => {
  const [linkingProvider, setLinkingProvider] = useState<ProviderConfig | null>(null);
  const [loginStep, setLoginStep] = useState<'intro' | 'form' | 'loading'>('intro');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLinkClick = (provider: ProviderConfig) => {
    const existing = linkedAccounts.find(acc => acc.providerId === provider.id);
    if (existing) {
      setLinkedAccounts(prev => prev.filter(acc => acc.providerId !== provider.id));
    } else {
      setLinkingProvider(provider);
      setLoginStep('intro');
      setEmail('');
      setPassword('');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginStep('loading');
    setTimeout(() => {
      if (linkingProvider) {
        const newAccount: LinkedAccount = {
          id: `la-${Date.now()}`,
          providerId: linkingProvider.id,
          linkedSince: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          username: email
        };
        setLinkedAccounts(prev => [...prev, newAccount]);
      }
      setLinkingProvider(null);
    }, 2000);
  };

  const groupedProviders = PROVIDERS.reduce((acc, provider) => {
    if (!acc[provider.category]) acc[provider.category] = [];
    acc[provider.category].push(provider);
    return acc;
  }, {} as Record<string, ProviderConfig[]>);

  return (
    <div className="min-h-screen bg-brand-950 flex flex-col font-sans relative text-slate-100">
      {/* Header */}
      <div className="bg-slate-900/80 pt-12 pb-4 px-4 shadow-sm sticky top-0 z-20 border-b border-slate-800/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-800 active:bg-slate-700 transition-colors">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="font-bold text-xl text-white">Linked Accounts</h1>
            <p className="text-xs font-medium text-slate-400">Connect apps for seamless booking</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="bg-brand-500/10 border border-brand-500/20 rounded-2xl p-4 mb-6 flex gap-3">
          <ShieldCheck className="w-6 h-6 text-brand-400 flex-shrink-0" />
          <p className="text-xs font-medium text-brand-200 leading-relaxed">
            Securely link your accounts to compare prices, book directly, and track all your orders in one place. We never store your passwords.
          </p>
        </div>

        {Object.entries(groupedProviders).map(([category, providers]) => (
          <div key={category} className="mb-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">{category}</h2>
            <div className="bg-slate-900/80 rounded-3xl shadow-soft border border-slate-800/80 overflow-hidden">
              {providers.map((provider, index) => {
                const linkedAcc = linkedAccounts.find(acc => acc.providerId === provider.id);
                const isConnected = !!linkedAcc;
                return (
                  <div key={provider.id} className={`flex items-center p-4 ${index !== providers.length - 1 ? 'border-b border-slate-800/50' : ''}`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm overflow-hidden bg-white border border-slate-800`}>
                      <img 
                        src={`https://icon.horse/icon/${provider.domain}`} 
                        alt={provider.name} 
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.className = `w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm ${provider.color} ${provider.textColor}`;
                          e.currentTarget.parentElement!.innerHTML = provider.name.charAt(0);
                        }}
                      />
                    </div>
                    <div className="flex-1 ml-4">
                      <h3 className="font-bold text-white">{provider.name}</h3>
                      {isConnected ? (
                        <div>
                          <p className="text-xs font-medium text-emerald-400 flex items-center mt-0.5">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Connected
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Linked since {linkedAcc.linkedSince}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs font-medium text-slate-500 mt-0.5">Not connected</p>
                      )}
                    </div>
                    <button 
                      onClick={() => handleLinkClick(provider)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                        isConnected 
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                          : 'bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 border border-brand-500/20'
                      }`}
                    >
                      {isConnected ? 'Unlink' : 'Link'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Simulated OAuth Bottom Sheet */}
      {linkingProvider && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => loginStep !== 'loading' && setLinkingProvider(null)}></div>
          <div className="bg-slate-900 rounded-t-[2rem] p-6 relative z-10 border-t border-slate-800 animate-[slideUp_0.3s_ease-out] pb-12">
            <button 
              onClick={() => loginStep !== 'loading' && setLinkingProvider(null)}
              className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white"
              disabled={loginStep === 'loading'}
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col items-center text-center mt-4 mb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-14 h-14 bg-brand-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-md">C</div>
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-slate-700 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-slate-700 rounded-full animate-pulse delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-slate-700 rounded-full animate-pulse delay-150"></div>
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-md bg-white border border-slate-800 overflow-hidden`}>
                  <img src={`https://icon.horse/icon/${linkingProvider.domain}`} alt={linkingProvider.name} className="w-10 h-10 object-contain" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {loginStep === 'intro' ? `Connect ${linkingProvider.name}` : `Login to ${linkingProvider.name}`}
              </h2>
              <p className="text-sm text-slate-400 font-medium px-4">
                {loginStep === 'intro' 
                  ? `Chalo wants to access your ${linkingProvider.name} account to fetch prices and place orders on your behalf.`
                  : `Enter your ${linkingProvider.name} credentials to securely link your account.`}
              </p>
            </div>

            {loginStep === 'loading' ? (
              <div className="py-8 flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-brand-500 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                <p className="text-sm font-bold text-slate-400">Authenticating securely...</p>
              </div>
            ) : loginStep === 'intro' ? (
              <div className="space-y-3">
                <button 
                  onClick={() => setLoginStep('form')}
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-transform active:scale-[0.98] ${linkingProvider.color} ${linkingProvider.textColor}`}
                >
                  Continue to Login
                </button>
                <button 
                  onClick={() => setLinkingProvider(null)}
                  className="w-full py-4 rounded-xl font-bold text-slate-400 bg-slate-800 active:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    type="text" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email or Phone Number" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                  />
                </div>
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
                <button 
                  type="submit"
                  className={`w-full py-4 mt-2 rounded-xl font-bold text-lg shadow-md transition-transform active:scale-[0.98] ${linkingProvider.color} ${linkingProvider.textColor}`}
                >
                  Secure Login
                </button>
              </form>
            )}
            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <Smartphone className="w-3.5 h-3.5" /> Secured by Chalo OAuth
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
