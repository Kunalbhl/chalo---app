import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Loader2, CheckCircle2, ChevronRight } from 'lucide-react';

interface RazorpayCheckoutProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({ amount, onSuccess, onCancel }) => {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const handlePay = () => {
    setStatus('processing');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-[slideUp_0.3s_ease-out]">
        {/* Razorpay Header */}
        <div className="bg-[#02042b] p-5 text-white flex justify-between items-start">
          <div>
            <p className="text-xs text-blue-200 font-medium mb-1">Chalo Super App</p>
            <p className="text-2xl font-bold">₹{amount.toFixed(2)}</p>
          </div>
          <button onClick={onCancel} disabled={status !== 'idle'} className="p-1 bg-white/10 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6">
          {status === 'idle' && (
            <div className="space-y-5">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                <ShieldCheck className="w-5 h-5 text-emerald-500" /> Razorpay Trusted Business
              </div>
              <p className="text-sm text-slate-600 text-center mb-4">
                You are about to make a secure payment.
              </p>
              <button 
                onClick={handlePay} 
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-base shadow-md transition-colors flex justify-between items-center px-5"
              >
                <span>Pay Now</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
          
          {status === 'processing' && (
            <div className="py-10 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-5" />
              <p className="font-bold text-slate-800 text-lg">Processing Payment...</p>
              <p className="text-sm text-slate-500 mt-2">Please do not close this window or press back</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="py-10 flex flex-col items-center justify-center text-center animate-[fadeIn_0.3s_ease-out]">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-5" />
              <p className="font-bold text-slate-800 text-xl">Payment Successful</p>
              <p className="text-sm text-slate-500 mt-2">Redirecting back to app...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
