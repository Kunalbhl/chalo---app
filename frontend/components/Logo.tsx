import React from 'react';

export const Logo: React.FC = () => (
  <div className="flex items-center gap-2">
    <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 4C11.1634 4 4 11.1634 4 20C4 28.8366 11.1634 36 20 36C24.4183 36 28.4183 34.2091 31.3137 31.3137" stroke="#6366F1" strokeWidth="5" strokeLinecap="round"/>
      <path d="M20 12C15.5817 12 12 15.5817 12 20C12 24.4183 15.5817 28 20 28C22.2091 28 24.2091 27.1046 25.6569 25.6569" stroke="#A855F7" strokeWidth="5" strokeLinecap="round"/>
      <path d="M22 26L34 14M34 14H24M34 14V24" stroke="#F43F5E" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <div className="flex flex-col justify-center">
      <span className="text-white font-extrabold text-xl leading-none tracking-tight">Chalo</span>
      <span className="text-[7px] text-blue-300 font-bold tracking-widest uppercase mt-0.5">INDIA'S EVERYDAY SUPER APP</span>
    </div>
  </div>
);
