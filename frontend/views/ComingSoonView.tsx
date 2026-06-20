import React from 'react';
import { ArrowLeft, Clock } from 'lucide-react';

interface ComingSoonViewProps {
  title: string;
  onBack: () => void;
}

export const ComingSoonView: React.FC<ComingSoonViewProps> = ({ title, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white pt-12 pb-4 px-4 shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:bg-gray-200">
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="font-bold text-xl text-gray-800">{title}</h1>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <Clock className="w-12 h-12 text-brand-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Coming Soon!</h2>
        <p className="text-gray-500 max-w-[250px]">
          We are working hard to bring <span className="font-semibold text-gray-700">{title}</span> to you. Stay tuned for updates.
        </p>
        <button 
          onClick={onBack} 
          className="mt-8 px-8 py-3 bg-brand-600 text-white font-bold rounded-xl active:bg-brand-700 transition-colors shadow-sm"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};