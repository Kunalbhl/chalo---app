import React from 'react';
import { AnyProvider } from '../types';

interface ProviderBadgeProps {
  provider: AnyProvider;
  className?: string;
}

export const ProviderBadge: React.FC<ProviderBadgeProps> = ({ provider, className = '' }) => {
  const config: Record<AnyProvider, { bg: string, text: string, label: string }> = {
    chalo: { bg: 'bg-brand-600', text: 'text-white', label: 'Chalo' },
    uber: { bg: 'bg-black', text: 'text-white', label: 'Uber' },
    ola: { bg: 'bg-[#cddc39]', text: 'text-black', label: 'Ola' },
    rapido: { bg: 'bg-[#f9c935]', text: 'text-black', label: 'Rapido' },
    namma_yatri: { bg: 'bg-[#ffcc00]', text: 'text-black', label: 'Namma Yatri' },
    zomato: { bg: 'bg-red-600', text: 'text-white', label: 'Zomato' },
    swiggy: { bg: 'bg-orange-500', text: 'text-white', label: 'Swiggy' },
    eatsure: { bg: 'bg-purple-500', text: 'text-white', label: 'EatSure' },
    zepto: { bg: 'bg-purple-600', text: 'text-white', label: 'Zepto' },
    blinkit: { bg: 'bg-yellow-400', text: 'text-black', label: 'Blinkit' },
    instamart: { bg: 'bg-orange-600', text: 'text-white', label: 'Instamart' },
    makemytrip: { bg: 'bg-red-500', text: 'text-white', label: 'MakeMyTrip' },
    agoda: { bg: 'bg-blue-500', text: 'text-white', label: 'Agoda' },
    oyo: { bg: 'bg-red-600', text: 'text-white', label: 'OYO' },
    airbnb: { bg: 'bg-[#FF5A5F]', text: 'text-white', label: 'Airbnb' },
    bookingcom: { bg: 'bg-[#003580]', text: 'text-white', label: 'Booking.com' },
    goibibo: { bg: 'bg-orange-500', text: 'text-white', label: 'Goibibo' },
    cleartrip: { bg: 'bg-green-500', text: 'text-white', label: 'Cleartrip' },
    irctc: { bg: 'bg-blue-800', text: 'text-white', label: 'IRCTC' },
    ixigo: { bg: 'bg-orange-600', text: 'text-white', label: 'Ixigo' },
    skyscanner: { bg: 'bg-sky-500', text: 'text-white', label: 'Skyscanner' },
    kayak: { bg: 'bg-orange-400', text: 'text-white', label: 'KAYAK' },
    redbus: { bg: 'bg-red-600', text: 'text-white', label: 'redBus' },
  };

  const { bg, text, label } = config[provider] || config.chalo;

  return (
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${bg} ${text} ${className}`}>
      {label}
    </span>
  );
};
