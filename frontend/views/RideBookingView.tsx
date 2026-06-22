import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, MapPin, Navigation, Clock, User, ShieldCheck, CreditCard, Smartphone, Wallet, Banknote, CheckCircle2, X, Loader2, ChevronRight } from 'lucide-react';
import { BookingStep, Location, VehicleOption, SavedMethod, WalletItem, ActivityItem } from '../types';
import { RECENT_LOCATIONS, VEHICLES } from '../constants';
import { getVehicleIcon } from '../components/Icons';
import { ProviderBadge } from '../components/ProviderBadge';

interface RideBookingViewProps {
  onBack: () => void;
  currentLocation: string;
  preferredPayment: string;
  upis: SavedMethod[];
  cards: SavedMethod[];
  wallets: WalletItem[];
  walletBalance: number;
  onAddActivity: (newActivity: ActivityItem) => void;
}

const MOCK_PLACES = [
  'Indiranagar, Bengaluru, Karnataka',
  'Koramangala, Bengaluru, Karnataka',
  'Whitefield, Bengaluru, Karnataka',
  'MG Road, Bengaluru, Karnataka',
  'Mumbai Airport',
  'Delhi Airport',
  'Connaught Place, New Delhi'
];

export const RideBookingView: React.FC<RideBookingViewProps> = ({ onBack, currentLocation, preferredPayment, upis, cards, wallets, walletBalance, onAddActivity }) => {
  const [step, setStep] = useState<BookingStep>('search');
  const [pickup, setPickup] = useState<string>(currentLocation);
  const [dropoff, setDropoff] = useState<string>('');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleOption | null>(null);
  const [sortBy, setSortBy] = useState<'price' | 'eta'>('price');
  const [filterType, setFilterType] = useState<'all' | 'auto' | 'bike' | 'car'>('all');
  
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>(preferredPayment);
  
  // Tracking state
  const [carPos, setCarPos] = useState({ top: '80%', left: '20%' });

  // Mock Autocomplete
  const [dropoffSearchQuery, setDropoffSearchQuery] = useState('');
  const dropoffSuggestions = useMemo(() => {
    if (!dropoffSearchQuery.trim()) return [];
    return MOCK_PLACES.filter(place => place.toLowerCase().includes(dropoffSearchQuery.toLowerCase()));
  }, [dropoffSearchQuery]);

  // Simulate finding a driver and tracking
  useEffect(() => {
    if (step === 'confirming') {
      const timer = setTimeout(() => {
        setStep('accepted');
      }, 3000);
      return () => clearTimeout(timer);
    }
    
    if (step === 'accepted') {
      const timer = setTimeout(() => {
        setStep('on_way');
      }, 2000);
      return () => clearTimeout(timer);
    }

    if (step === 'on_way') {
      const interval = setInterval(() => {
        setCarPos(prev => ({
          top: `${Math.max(30, parseInt(prev.top) - 5)}%`,
          left: `${Math.min(70, parseInt(prev.left) + 5)}%`
        }));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleLocationSelect = (locName: string) => {
    setDropoff(locName);
    setDropoffSearchQuery('');
    setStep('verify_pickup');
  };

  const handleConfirmPickup = () => {
    setStep('select_vehicle');
  };

  const handleBook = () => {
    if (selectedVehicle) {
      setStep('confirming');
      onAddActivity({
        id: `act-${Date.now()}`,
        provider: selectedVehicle.provider,
        type: 'ride',
        title: `${selectedVehicle.name} to ${dropoff.split(',')[0]}`,
        date: 'Just Now',
        status: 'ongoing',
        price: selectedVehicle.price
      });
    }
  };

  const sortedAndFilteredVehicles = useMemo(() => {
    let filtered = VEHICLES;
    if (filterType !== 'all') {
      filtered = VEHICLES.filter(v => v.iconType === filterType || (filterType === 'car' && v.iconType === 'suv'));
    }
    
    return [...filtered].sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      return a.eta - b.eta;
    });
  }, [sortBy, filterType]);

  return (
    <div className="h-screen flex flex-col bg-brand-950 relative overflow-hidden text-slate-100">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-slate-900/90 backdrop-blur-md pt-12 pb-4 px-4 flex items-center shadow-sm border-b border-slate-800/50">
        <button onClick={step === 'search' ? onBack : () => setStep('search')} className="p-2 -ml-2 rounded-full hover:bg-slate-800 active:bg-slate-700 transition-colors">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-lg font-semibold ml-2 text-white">
          {step === 'search' ? 'Plan your ride' : 
           step === 'verify_pickup' ? 'Confirm Pickup' : 
           step === 'select_vehicle' ? 'Compare & Choose' : 'Booking'}
        </h1>
      </div>

      {/* Map Background (OSM Iframe) */}
      <div className="absolute inset-0 z-0 bg-slate-100">
        <iframe 
          width="100%" 
          height="100%" 
          frameBorder="0" 
          scrolling="no" 
          marginHeight={0} 
          marginWidth={0} 
          src={`https://www.openstreetmap.org/export/embed.html?bbox=77.58,12.96,77.61,12.98&layer=mapnik`}
          className="absolute inset-0 opacity-70"
        ></iframe>
        
        {/* Overlay to darken map slightly for better contrast with dark UI */}
        <div className="absolute inset-0 bg-slate-950/40 pointer-events-none"></div>

        {/* Simulated Tracking Car */}
        {(step === 'accepted' || step === 'on_way') && (
          <div 
            className="absolute z-10 transition-all duration-[2000ms] ease-linear"
            style={{ top: carPos.top, left: carPos.left }}
          >
            <div className="bg-white p-2 rounded-full shadow-lg border-2 border-brand-500">
              {getVehicleIcon(selectedVehicle?.iconType || 'car', "w-6 h-6 text-brand-600")}
            </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="relative z-20 flex-1 flex flex-col justify-end pointer-events-none">
        
        {/* Step 1: Search */}
        {step === 'search' && (
          <div className="bg-slate-900 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pointer-events-auto flex flex-col h-[80vh] border-t border-slate-800">
            <div className="p-6 flex-1 overflow-y-auto">
              {/* Input Fields */}
              <div className="relative pl-8 mb-6">
                {/* Timeline line */}
                <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-slate-800"></div>
                
                <div className="mb-4 relative">
                  <div className="absolute -left-8 top-3 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-950"></div>
                  <input 
                    type="text" 
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                    placeholder="Pickup location"
                  />
                </div>
                <div className="relative">
                  <div className="absolute -left-8 top-3 w-2 h-2 rounded-sm bg-brand-500 ring-4 ring-brand-950"></div>
                  <input 
                    type="text" 
                    value={dropoffSearchQuery}
                    onChange={(e) => setDropoffSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                    placeholder="Where to?"
                    autoFocus
                  />
                  
                  {/* Autocomplete Suggestions */}
                  {dropoffSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-lg z-30 overflow-hidden">
                      {dropoffSuggestions.map((place, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleLocationSelect(place)}
                          className="w-full text-left px-4 py-3 hover:bg-slate-700 border-b border-slate-700/50 last:border-0 text-sm font-medium text-slate-200 flex items-center gap-2"
                        >
                          <MapPin className="w-4 h-4 text-slate-400" /> {place}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Locations */}
              {!dropoffSearchQuery && (
                <div>
                  <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Recent</h3>
                  <div className="space-y-0">
                    {RECENT_LOCATIONS.map((loc, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleLocationSelect(loc.address)}
                        className="w-full flex items-center py-4 border-b border-slate-800/50 last:border-0 active:bg-slate-800/40 text-left"
                      >
                        <div className="bg-slate-950 p-2.5 rounded-xl mr-4 border border-slate-800">
                          <Clock className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{loc.name}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[250px] mt-0.5">{loc.address}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 1.5: Verify Pickup */}
        {step === 'verify_pickup' && (
          <div className="bg-slate-900 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pointer-events-auto p-6 border-t border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-500/20 p-2 rounded-full">
                <MapPin className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pickup Location</p>
                <p className="font-bold text-white text-sm truncate max-w-[280px]">{pickup}</p>
              </div>
            </div>
            <button 
              onClick={handleConfirmPickup}
              className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-lg shadow-md transition-colors"
            >
              Confirm Pickup
            </button>
          </div>
        )}

        {/* Step 2: Select Vehicle (Aggregator View) */}
        {step === 'select_vehicle' && (
          <div className="bg-slate-900 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pointer-events-auto flex flex-col max-h-[80vh] border-t border-slate-800">
            <div className="w-12 h-1.5 bg-slate-800 rounded-full mx-auto mt-3 mb-2"></div>
            
            {/* Filters & Sorting */}
            <div className="px-4 pb-3 border-b border-slate-800/50">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-white">Available Rides</h2>
                <div className="flex bg-slate-950 rounded-xl p-1 border border-slate-800">
                  <button 
                    onClick={() => setSortBy('price')} 
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${sortBy === 'price' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}
                  >
                    Cheapest
                  </button>
                  <button 
                    onClick={() => setSortBy('eta')} 
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${sortBy === 'eta' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}
                  >
                    Fastest
                  </button>
                </div>
              </div>
              
              {/* Vehicle Type Filter */}
              <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                {(['all', 'auto', 'bike', 'car'] as const).map(type => (
                  <button 
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-colors ${
                      filterType === type 
                        ? 'bg-brand-600 text-white border-brand-600' 
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto px-4 py-2 pb-32 bg-slate-950/50">
              <div className="space-y-3">
                {sortedAndFilteredVehicles.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle)}
                    className={`w-full flex items-center p-3 rounded-2xl border-2 transition-all ${
                      selectedVehicle?.id === vehicle.id 
                        ? 'border-brand-500 bg-brand-500/10 shadow-glow-indigo' 
                        : 'border-transparent bg-slate-900 shadow-sm hover:border-slate-800'
                    }`}
                  >
                    <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center mr-3 bg-slate-950 rounded-xl border border-slate-800">
                      {getVehicleIcon(vehicle.iconType, "w-8 h-8 text-slate-300")}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center mb-0.5">
                        <ProviderBadge provider={vehicle.provider} />
                        <div className="flex items-center ml-2 text-[10px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                          <User className="w-3 h-3 mr-0.5" /> {vehicle.capacity}
                        </div>
                      </div>
                      <h3 className="font-bold text-white text-sm">{vehicle.name}</h3>
                      <p className="text-xs text-slate-400">{vehicle.eta} min away</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-white">₹{vehicle.price}</p>
                      {vehicle.isPromo && <p className="text-[10px] text-brand-400 font-bold">PROMO</p>}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Action Bar with Payment Selector */}
            <div className="absolute bottom-0 left-0 right-0 bg-slate-900 p-4 border-t border-slate-800 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-bold text-white capitalize">{selectedPayment.replace('-', ' ')}</span>
                </div>
                <button onClick={() => setShowPaymentSelector(true)} className="text-brand-400 text-xs font-bold">Change</button>
              </div>
              <button 
                onClick={handleBook}
                disabled={!selectedVehicle}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center ${
                  selectedVehicle 
                    ? 'bg-brand-600 text-white active:bg-brand-700' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {selectedVehicle ? `Book via ${selectedVehicle.provider.replace('_', ' ').toUpperCase()}` : 'Select a ride'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirming / Finding Driver */}
        {step === 'confirming' && (
          <div className="bg-slate-900 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pointer-events-auto p-8 flex flex-col items-center justify-center h-[40vh] border-t border-slate-800">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                {selectedVehicle && getVehicleIcon(selectedVehicle.iconType, "w-8 h-8 text-brand-400")}
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Connecting to {selectedVehicle?.provider.replace('_', ' ')}...</h2>
            <p className="text-slate-400 text-center text-sm">Finding the nearest driver for your {selectedVehicle?.name}.</p>
          </div>
        )}

        {/* Step 4: Driver Accepted & On Way */}
        {(step === 'accepted' || step === 'on_way') && (
          <div className="bg-slate-900 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pointer-events-auto p-6 border-t border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-white">Arriving in 3 mins</h2>
                </div>
                <p className="text-slate-400 flex items-center gap-2 text-sm">
                  Your <ProviderBadge provider={selectedVehicle?.provider || 'chalo'} /> is on the way
                </p>
              </div>
              <div className="bg-brand-500/10 text-brand-400 px-3 py-1 rounded-lg font-bold text-xl border border-brand-500/20">
                OTP: 4921
              </div>
            </div>

            <div className="flex items-center p-4 bg-slate-950 rounded-2xl mb-6 border border-slate-800">
              <div className="w-12 h-12 bg-slate-800 rounded-full overflow-hidden mr-4">
                <img src="https://picsum.photos/100/100?random=1" alt="Driver" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white">Ramesh Kumar</h3>
                <div className="flex items-center text-sm text-slate-400">
                  <span className="font-medium">4.8</span>
                  <span className="text-yellow-400 ml-1">★</span>
                  <span className="mx-2">•</span>
                  <span className="font-mono bg-slate-800 px-1.5 rounded text-xs text-slate-200">KA 01 AB 1234</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center shadow-sm border border-slate-700 text-brand-400">
                  <ShieldCheck className="w-5 h-5" />
                </button>
              </div>
            </div>

            <button onClick={onBack} className="w-full py-4 bg-red-500/10 text-red-400 rounded-xl font-bold active:bg-red-500/20 transition-colors border border-red-500/20">
              Cancel Ride
            </button>
          </div>
        )}

      </div>

      {/* Payment Method Selector Sub-modal */}
      {showPaymentSelector && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-auto">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowPaymentSelector(false)}></div>
          <div className="bg-slate-900 rounded-t-[2rem] p-6 relative z-10 border-t border-slate-800 max-h-[90vh] w-full overflow-y-auto hide-scrollbar animate-[slideUp_0.3s_ease-out] text-slate-100 pb-8">
            <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-4 cursor-grab"></div>
            <button 
              onClick={() => setShowPaymentSelector(false)}
              className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-white">Select Payment Method</h3>
            </div>

            <div className="space-y-4">
              {/* Chalo Pay Wallet */}
              <button 
                onClick={() => { setSelectedPayment('chalo-pay'); setShowPaymentSelector(false); }}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                  selectedPayment === 'chalo-pay' ? 'border-brand-500 bg-brand-500/10' : 'border-slate-700 bg-slate-800 hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-brand-400" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Chalo Pay Wallet</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Balance: ₹{walletBalance.toFixed(2)}</p>
                  </div>
                </div>
                {selectedPayment === 'chalo-pay' && <CheckCircle2 className="w-5 h-5 text-brand-500" />}
              </button>

              {/* Saved UPIs */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">UPI</p>
                {upis.map(upi => (
                  <button 
                    key={upi.id}
                    onClick={() => { setSelectedPayment(upi.id); setShowPaymentSelector(false); }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                      selectedPayment === upi.id ? 'border-brand-500 bg-brand-500/10' : 'border-slate-700 bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-slate-400" />
                      <div>
                        <h4 className="font-bold text-white text-sm">{upi.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{upi.subtitle}</p>
                      </div>
                    </div>
                    {selectedPayment === upi.id && <CheckCircle2 className="w-5 h-5 text-brand-500" />}
                  </button>
                ))}
              </div>

              {/* Saved Cards */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Credit & Debit Cards</p>
                {cards.map(card => (
                  <button 
                    key={card.id}
                    onClick={() => { setSelectedPayment(card.id); setShowPaymentSelector(false); }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                      selectedPayment === card.id ? 'border-brand-500 bg-brand-500/10' : 'border-slate-700 bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-slate-400" />
                      <div>
                        <h4 className="font-bold text-white text-sm">{card.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{card.subtitle}</p>
                      </div>
                    </div>
                    {selectedPayment === card.id && <CheckCircle2 className="w-5 h-5 text-brand-500" />}
                  </button>
                ))}
              </div>

              {/* Cash on Delivery */}
              <button 
                onClick={() => { setSelectedPayment('cash'); setShowPaymentSelector(false); }}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                  selectedPayment === 'cash' ? 'border-brand-500 bg-brand-500/10' : 'border-slate-700 bg-slate-800 hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Banknote className="w-5 h-5 text-emerald-500" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Cash</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Pay directly to the driver</p>
                  </div>
                </div>
                {selectedPayment === 'cash' && <CheckCircle2 className="w-5 h-5 text-brand-500" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
