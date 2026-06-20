import React from 'react';
import { Clock, User } from 'lucide-react';
import { ViewState } from '../types';
import { ChaloLogo } from './Icons';

interface BottomNavProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChangeView }) => {
  if (currentView === 'booking') return null;

  const isHomeActive = currentView === 'home';
  const isActivityActive = currentView === 'activity';
  const isAccountActive = currentView === 'account';

  return (
    <div className="fixed bottom-0 w-full max-w-[480px] bg-white/95 border-t border-slate-100 pb-safe pt-1 px-4 flex justify-between items-center z-50 shadow-[0_-8px_30px_-10px_rgba(0,0,0,0.05)] font-sans backdrop-blur-md h-14">
      {/* Activity Button */}
      <button
        onClick={() => onChangeView('activity')}
        className={`flex flex-col items-center p-1 flex-1 transition-all duration-300 hover:scale-105 active:scale-95 ${
          isActivityActive ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <div className={`p-1.5 rounded-lg border transition-all duration-300 shadow-sm ${
          isActivityActive 
            ? 'bg-brand-50 border-brand-200 text-brand-600 shadow-indigo-100 scale-105' 
            : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100 hover:border-slate-200'
        }`}>
          <Clock className="w-4 h-4" strokeWidth={isActivityActive ? 2.5 : 2} />
        </div>
        <span className={`text-[9px] mt-0.5 font-bold tracking-wide transition-colors duration-300 ${isActivityActive ? 'text-brand-600' : 'text-slate-500'}`}>
          Activity
        </span>
      </button>

      {/* Central Chalo Logo Home Button - Highly Reactive with Hover Zoom & Click Scale */}
      <button
        onClick={() => onChangeView('home')}
        className="flex flex-col items-center -mt-4 relative z-50 flex-1 transition-all duration-300 hover:scale-110 active:scale-90 group"
      >
        <div className={`p-1 rounded-full bg-white border-2 transition-all duration-300 shadow-md ${
          isHomeActive 
            ? 'border-brand-500 shadow-glow-indigo scale-105' 
            : 'border-slate-100 hover:border-slate-300'
        }`}>
          <ChaloLogo className="w-8 h-8 transition-transform duration-300 group-hover:rotate-6" />
        </div>
        <span className={`text-[9px] mt-0.5 font-extrabold tracking-wide transition-colors duration-300 ${isHomeActive ? 'text-brand-600' : 'text-slate-500'}`}>
          Chalo Home
        </span>
      </button>

      {/* Account Button */}
      <button
        onClick={() => onChangeView('account')}
        className={`flex flex-col items-center p-1 flex-1 transition-all duration-300 hover:scale-105 active:scale-95 ${
          isAccountActive ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <div className={`p-1.5 rounded-lg border transition-all duration-300 shadow-sm ${
          isAccountActive 
            ? 'bg-brand-50 border-brand-200 text-brand-600 shadow-indigo-100 scale-105' 
            : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100 hover:border-slate-200'
        }`}>
          <User className="w-4 h-4" strokeWidth={isAccountActive ? 2.5 : 2} />
        </div>
        <span className={`text-[9px] mt-0.5 font-bold tracking-wide transition-colors duration-300 ${isAccountActive ? 'text-brand-600' : 'text-slate-500'}`}>
          Account
        </span>
      </button>
    </div>
  );
};