import React from 'react';

// Premium Chalo Logo: An elegant, continuous-loop emblem combining a location pin, 
// a forward-pointing arrow, and the letter 'C'. It represents seamless connectivity, 
// endless possibilities, and forward momentum.
export const ChaloLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="chaloPrimaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4f46e5" /> {/* Indigo-600 */}
        <stop offset="50%" stopColor="#6366f1" /> {/* Indigo-500 */}
        <stop offset="100%" stopColor="#06b6d4" /> {/* Cyan-500 */}
      </linearGradient>
      <linearGradient id="chaloAccentGrad" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f43f5e" /> {/* Rose-500 */}
        <stop offset="100%" stopColor="#fb7185" /> {/* Rose-400 */}
      </linearGradient>
      <filter id="premiumGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Background subtle glow ring */}
    <circle cx="50" cy="50" r="40" stroke="url(#chaloPrimaryGrad)" strokeWidth="1.5" strokeOpacity="0.15" />
    
    {/* The main looping 'C' and location pin hybrid */}
    <path 
      d="M 50 14 
         C 28 14, 14 30, 14 50 
         C 14 70, 28 86, 50 86 
         C 68 86, 80 74, 84 58 
         C 85 52, 80 48, 74 48 
         C 68 48, 64 52, 62 58 
         C 59 66, 51 72, 42 70 
         C 32 68, 26 58, 28 48 
         C 30 38, 40 30, 50 30 
         C 62 30, 72 40, 72 52 
         L 72 64" 
      stroke="url(#chaloPrimaryGrad)" 
      strokeWidth="11" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />

    {/* Dynamic accent loop forming the forward arrow */}
    <path 
      d="M 72 64 L 84 52 L 92 64" 
      stroke="url(#chaloAccentGrad)" 
      strokeWidth="10" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    
    {/* Center core spark */}
    <circle cx="50" cy="50" r="5" fill="url(#chaloPrimaryGrad)" />
  </svg>
);

// High-fidelity simulated QR Code for downloading the Chalo App
export const ChaloDownloadQRCode: React.FC<{ className?: string }> = ({ className = "w-32 h-32" }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="12" fill="#ffffff" />
    <rect x="8" y="8" width="24" height="24" rx="4" fill="#0f172a" />
    <rect x="13" y="13" width="14" height="14" rx="2" fill="#ffffff" />
    <rect x="16" y="16" width="8" height="8" rx="1" fill="#4f46e5" />
    <rect x="68" y="8" width="24" height="24" rx="4" fill="#0f172a" />
    <rect x="73" y="13" width="14" height="14" rx="2" fill="#ffffff" />
    <rect x="76" y="16" width="8" height="8" rx="1" fill="#4f46e5" />
    <rect x="8" y="68" width="24" height="24" rx="4" fill="#0f172a" />
    <rect x="13" y="73" width="14" height="14" rx="2" fill="#ffffff" />
    <rect x="16" y="76" width="8" height="8" rx="1" fill="#4f46e5" />
    <rect x="74" y="74" width="10" height="10" rx="2" fill="#0f172a" />
    <rect x="77" y="77" width="4" height="4" rx="1" fill="#ffffff" />
    <g fill="#1e293b" opacity="0.85">
      <rect x="38" y="8" width="6" height="6" rx="1" />
      <rect x="48" y="12" width="12" height="4" rx="1" />
      <rect x="38" y="20" width="4" height="12" rx="1" />
      <rect x="48" y="22" width="8" height="6" rx="1" />
      <rect x="8" y="38" width="12" height="4" rx="1" />
      <rect x="14" y="46" width="6" height="12" rx="1" />
      <rect x="24" y="38" width="6" height="18" rx="1" />
      <rect x="38" y="38" width="24" height="6" rx="1" fill="#4f46e5" />
      <rect x="38" y="48" width="10" height="10" rx="1" />
      <rect x="52" y="48" width="10" height="16" rx="1" />
      <rect x="68" y="38" width="6" height="12" rx="1" />
      <rect x="80" y="38" width="12" height="6" rx="1" />
      <rect x="78" y="48" width="6" height="14" rx="1" />
      <rect x="38" y="68" width="12" height="6" rx="1" />
      <rect x="38" y="78" width="6" height="14" rx="1" />
      <rect x="48" y="78" width="14" height="6" rx="1" />
      <rect x="54" y="68" width="8" height="8" rx="1" />
    </g>
    <rect x="40" y="40" width="20" height="20" rx="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
    <circle cx="50" cy="50" r="6" fill="#4f46e5" />
    <circle cx="50" cy="50" r="3" fill="#ffffff" />
  </svg>
);

// --- Realistic Premium Service Icons ---

// 1. Ride (Sleek Modern Sedan - Side Profile)
export const PremiumRideIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="rideGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
    </defs>
    {/* Car Body */}
    <path d="M 12 38 C 10 38, 8 36, 8 34 L 8 30 C 8 26, 12 22, 18 20 L 32 16 C 38 14, 46 16, 50 22 L 54 28 C 56 30, 56 34, 56 36 C 56 38, 54 40, 52 40 L 12 40 Z" fill="url(#rideGrad)" />
    {/* Windows */}
    <path d="M 20 22 L 30 18 C 34 17, 40 18, 44 22 L 48 28 L 20 28 Z" fill="#93c5fd" opacity="0.8" />
    {/* Window Divider */}
    <line x1="34" y1="18" x2="34" y2="28" stroke="#1d4ed8" strokeWidth="2" />
    {/* Wheels */}
    <circle cx="20" cy="40" r="6" fill="#1e293b" />
    <circle cx="44" cy="40" r="6" fill="#1e293b" />
    <circle cx="20" cy="40" r="2" fill="#94a3b8" />
    <circle cx="44" cy="40" r="2" fill="#94a3b8" />
    {/* Headlight & Taillight */}
    <path d="M 54 30 L 56 30 L 56 34 L 54 34 Z" fill="#fef08a" />
    <path d="M 8 30 L 10 30 L 10 34 L 8 34 Z" fill="#ef4444" />
  </svg>
);

// 2. Food (Delicious Cloche/Plate)
export const PremiumFoodIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="foodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
    </defs>
    <path d="M12 44 C12 24, 52 24, 52 44 Z" fill="url(#foodGrad)" />
    <rect x="8" y="46" width="48" height="6" rx="3" fill="#ea580c" />
    <circle cx="32" cy="20" r="4" fill="#f97316" />
    <path d="M24 14 Q28 8, 32 14 T36 14" stroke="#fdba74" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 3. Mart (Premium Shopping Bag)
export const PremiumMartIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="martGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
    </defs>
    <path d="M16 24 L48 24 L44 54 L20 54 Z" fill="url(#martGrad)" />
    <path d="M24 24 C24 14, 40 14, 40 24" stroke="#a7f3d0" strokeWidth="4" strokeLinecap="round" />
    <circle cx="28" cy="36" r="3" fill="#ffffff" />
    <circle cx="36" cy="36" r="3" fill="#ffffff" />
    <path d="M26 44 Q32 48, 38 44" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// 4. Stays (Luxury Resort/Hotel)
export const PremiumStaysIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="staysGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f43f5e" />
        <stop offset="100%" stopColor="#be123c" />
      </linearGradient>
    </defs>
    <rect x="16" y="14" width="32" height="40" rx="4" fill="url(#staysGrad)" />
    <rect x="22" y="20" width="6" height="6" rx="1" fill="#fecdd3" />
    <rect x="36" y="20" width="6" height="6" rx="1" fill="#fecdd3" />
    <rect x="22" y="32" width="6" height="6" rx="1" fill="#fecdd3" />
    <rect x="36" y="32" width="6" height="6" rx="1" fill="#fecdd3" />
    <path d="M28 54 L28 46 C28 44, 36 44, 36 46 L36 54 Z" fill="#9f1239" />
  </svg>
);

// 5. Auto Rickshaw (Highly Detailed Indian Auto - Side Profile)
export const AutoIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="autoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#eab308" /> {/* Yellow top */}
        <stop offset="100%" stopColor="#15803d" /> {/* Green bottom */}
      </linearGradient>
    </defs>
    {/* Roof */}
    <path d="M 14 26 C 14 20, 20 16, 34 16 C 46 16, 50 20, 50 26 L 52 34 L 12 34 Z" fill="#eab308" />
    {/* Body */}
    <path d="M 12 34 L 52 34 L 50 48 C 50 50, 46 52, 42 52 L 22 52 C 18 52, 14 50, 14 48 Z" fill="#15803d" />
    {/* Windshield & Side Window */}
    <path d="M 18 26 L 46 26 L 44 32 L 20 32 Z" fill="#93c5fd" opacity="0.7" />
    <line x1="32" y1="26" x2="32" y2="32" stroke="#15803d" strokeWidth="2" />
    {/* Wheels */}
    <circle cx="22" cy="52" r="6" fill="#1e293b" />
    <circle cx="42" cy="52" r="6" fill="#1e293b" />
    <circle cx="22" cy="52" r="2" fill="#94a3b8" />
    <circle cx="42" cy="52" r="2" fill="#94a3b8" />
    {/* Headlight */}
    <circle cx="50" cy="40" r="2" fill="#ffffff" />
  </svg>
);

// 6. Moto (Sleek Scooter - Side Profile)
export const PremiumMotoIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="motoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#0891b2" />
      </linearGradient>
    </defs>
    {/* Wheels */}
    <circle cx="18" cy="46" r="8" fill="#1e293b" />
    <circle cx="46" cy="46" r="8" fill="#1e293b" />
    <circle cx="18" cy="46" r="3" fill="#94a3b8" />
    <circle cx="46" cy="46" r="3" fill="#94a3b8" />
    {/* Body */}
    <path d="M 14 46 C 14 36, 20 30, 28 30 L 36 30 L 42 20 L 48 20 L 50 36 C 50 42, 46 46, 40 46 L 14 46 Z" fill="url(#motoGrad)" />
    {/* Seat */}
    <rect x="24" y="26" width="14" height="4" rx="2" fill="#1e293b" />
    {/* Handlebar */}
    <path d="M 42 20 L 38 14 L 44 14" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    {/* Headlight */}
    <circle cx="48" cy="22" r="2" fill="#ffffff" />
  </svg>
);

// 7. Flights (Realistic Airplane - Side Profile)
export const PremiumFlightIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="flightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#4338ca" />
      </linearGradient>
    </defs>
    {/* Fuselage */}
    <path d="M 10 36 C 10 32, 14 30, 20 30 L 46 30 C 54 30, 58 34, 58 36 C 58 38, 54 42, 46 42 L 20 42 C 14 42, 10 40, 10 36 Z" fill="url(#flightGrad)" />
    {/* Tail */}
    <path d="M 14 30 L 20 16 L 26 16 L 22 30 Z" fill="url(#flightGrad)" />
    {/* Wing */}
    <path d="M 30 36 L 40 50 L 46 50 L 40 36 Z" fill="#818cf8" />
    {/* Windows */}
    <circle cx="26" cy="36" r="1.5" fill="#ffffff" />
    <circle cx="32" cy="36" r="1.5" fill="#ffffff" />
    <circle cx="38" cy="36" r="1.5" fill="#ffffff" />
    <circle cx="44" cy="36" r="1.5" fill="#ffffff" />
  </svg>
);

// 8. Intercity (Highway Road)
export const PremiumIntercityIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="100%" stopColor="#1e293b" />
      </linearGradient>
    </defs>
    <path d="M12 54 L28 14 L36 14 L52 54 Z" fill="url(#roadGrad)" />
    <path d="M31 14 L31 22 M31 28 L31 38 M31 44 L31 54" stroke="#fef08a" strokeWidth="3" strokeDasharray="2" />
  </svg>
);

// 9. Insurance (Shield with Check)
export const PremiumInsuranceIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="insGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <path d="M14 16 L32 10 L50 16 L50 36 C50 46, 32 54, 32 54 C32 54, 14 46, 14 36 Z" fill="url(#insGrad)" />
    <path d="M24 30 L30 36 L40 24" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 10. Gifts (Wrapped Gift Box)
export const PremiumGiftsIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="giftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#db2777" />
      </linearGradient>
    </defs>
    <rect x="14" y="24" width="36" height="30" rx="4" fill="url(#giftGrad)" />
    <rect x="10" y="18" width="44" height="8" rx="2" fill="#f472b6" />
    <rect x="30" y="18" width="4" height="36" fill="#ffffff" />
    <path d="M32 18 C26 10, 32 6, 32 18 C32 6, 38 10, 32 18 Z" fill="#ffffff" />
  </svg>
);

// 11. Pay Bills (Mobile Receipt)
export const PremiumPayBillsIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="billGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#0891b2" />
      </linearGradient>
    </defs>
    <rect x="18" y="12" width="28" height="40" rx="4" fill="url(#billGrad)" />
    <rect x="22" y="18" width="20" height="24" rx="2" fill="#ffffff" />
    <line x1="26" y1="24" x2="38" y2="24" stroke="#0891b2" strokeWidth="3" strokeLinecap="round" />
    <line x1="26" y1="30" x2="34" y2="30" stroke="#0891b2" strokeWidth="3" strokeLinecap="round" />
    <circle cx="32" cy="46" r="2" fill="#ffffff" />
  </svg>
);

// 12. More (Grid of Dots)
export const PremiumMoreIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="20" cy="20" r="6" fill="#6366f1" />
    <circle cx="44" cy="20" r="6" fill="#3b82f6" />
    <circle cx="20" cy="44" r="6" fill="#10b981" />
    <circle cx="44" cy="44" r="6" fill="#f43f5e" />
  </svg>
);

export const getVehicleIcon = (type: string, className: string = "w-6 h-6") => {
  switch (type) {
    case 'auto': return <AutoIcon className={className} />;
    case 'bike': return <PremiumMotoIcon className={className} />;
    case 'car': return <PremiumRideIcon className={className} />;
    case 'suv': return <PremiumRideIcon className={className} />;
    case 'truck': return <PremiumRideIcon className={className} />;
    default: return <PremiumRideIcon className={className} />;
  }
};