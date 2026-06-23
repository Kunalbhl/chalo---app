import React, { useState } from 'react';
import { ChevronRight, Car, Utensils, ShoppingBag, BedDouble, Sparkles } from 'lucide-react';
import { ChaloLogo } from '../components/Icons';

interface OnboardingViewProps {
  onComplete: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Chalo",
      description: "India's Everyday Super App. Everything you need, all in one place.",
      icon: <ChaloLogo className="w-24 h-24" />,
      color: "bg-brand-600"
    },
    {
      title: "Compare & Save",
      description: "Compare prices across Uber, Ola, Zomato, Swiggy, and more to always get the best deal.",
      icon: (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-500/20 p-4 rounded-2xl"><Car className="w-10 h-10 text-blue-400" /></div>
          <div className="bg-orange-500/20 p-4 rounded-2xl"><Utensils className="w-10 h-10 text-orange-400" /></div>
          <div className="bg-emerald-500/20 p-4 rounded-2xl"><ShoppingBag className="w-10 h-10 text-emerald-400" /></div>
          <div className="bg-rose-500/20 p-4 rounded-2xl"><BedDouble className="w-10 h-10 text-rose-400" /></div>
        </div>
      ),
      color: "bg-slate-900"
    },
    {
      title: "Meet Chalo AI",
      description: "Your personal assistant. Ask for the cheapest ride, best biryani, or travel itineraries.",
      icon: <Sparkles className="w-24 h-24 text-amber-400 animate-pulse" />,
      color: "bg-indigo-950"
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className={`min-h-screen flex flex-col text-white transition-colors duration-500 ${steps[step].color}`}>
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-12 animate-[slideUp_0.5s_ease-out]">
          {steps[step].icon}
        </div>
        <h1 className="text-3xl font-black mb-4 animate-[fadeIn_0.5s_ease-out]">{steps[step].title}</h1>
        <p className="text-lg text-white/80 font-medium max-w-xs animate-[fadeIn_0.7s_ease-out]">
          {steps[step].description}
        </p>
      </div>

      <div className="p-8 pb-safe">
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}
            />
          ))}
        </div>
        <button 
          onClick={handleNext}
          className="w-full py-4 bg-white text-slate-900 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          {step === steps.length - 1 ? 'Get Started' : 'Next'} <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
