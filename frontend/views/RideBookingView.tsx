import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, MapPin, Navigation, Clock, User, ShieldCheck } from 'lucide-react';
import { BookingStep, Location, VehicleOption } from '../types';
import { RECENT_LOCATIONS, VEHICLES } from '../constants';
import { getVehicleIcon } from '../components/Icons';
import { ProviderBadge } from '../components/ProviderBadge';

interface RideBookingViewProps {
  onBack: () => void;
}

export const RideBookingView: React.FC<RideBookingViewProps> = ({ onBack }) => {
  const [step, setStep] = useState<BookingStep>('search');
  const [pickup, setPickup] = useState<string>('Current Location');
  const [dropoff, setDropoff] = useState<string>('');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleOption | null>(null);
  const [sortBy, setSortBy] = useState<'price' | 'eta'>('price');
  const [filterType, setFilterType] = useState<'all' | 'auto' | 'bike' | 'car'>('all');

  // Simulate finding a driver
  useEffect(() => {
    if (step === 'confirming') {
      const timer = setTimeout(() => {
        setStep('on_way');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleLocationSelect = (loc: Location) => {
    setDropoff(loc.name);
    setStep('select_vehicle');
  };

  const handleBook = () => {
    if (selectedVehicle) {
      setStep('confirming');
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
          {step === 'search' ? 'Plan your ride' : step === 'select_vehicle' ? 'Compare & Choose' : 'Booking'}
        </h1>
      </div>

      {/* Map Background (Mock) */}
      <div className="absolute inset-0 z-0 bg-slate-950">
        {/* Fake map pattern */}
        <div className="w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        {/* Fake Route Line (only show when vehicle selected) */}
        {step !== 'search' && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            <path d="M 150 300 Q 250 200 300 400 T 200 600" fill="none" stroke="#6366f1" strokeWidth="4" strokeDasharray="8 8" className="animate-[dash_20s_linear_infinite]" />
          </svg>
        )}

        {/* Fake Pins */}
        {step !== 'search' && (
          <>
            <div className="absolute top-[300px] left-[150px] -translate-x-1/2 -translate-y-full z-10">
              <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg border-2 border-white">
                <Navigation className="w-4 h-4" />
              </div>
            </div>
            <div className="absolute top-[600px] left-[200px] -translate-x-1/2 -translate-y-full z-10">
              <div className="bg-brand-600 text-white p-2 rounded-full shadow-lg border-2 border-white">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
          </>
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                    placeholder="Pickup location"
                  />
                </div>
                <div className="relative">
                  <div className="absolute -left-8 top-3 w-2 h-2 rounded-sm bg-brand-500 ring-4 ring-brand-950"></div>
                  <input 
                    type="text" 
                    value={dropoff}
                    onChange={(e) => setDropoff(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                    placeholder="Where to?"
                    autoFocus
                  />
                </div>
              </div>

              {/* Recent Locations */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Recent</h3>
                <div className="space-y-0">
                  {RECENT_LOCATIONS.map((loc, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleLocationSelect(loc)}
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
            </div>
          </div>
        )}

        {/* Step 2: Select Vehicle (Aggregator View) */}
        {step === 'select_vehicle' && (
          <div className="bg-slate-900 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pointer-events-auto flex flex-col max-h-[75vh] border-t border-slate-800">
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
            
            <div className="flex-1 overflow-y-auto px-4 py-2 pb-24 bg-slate-950/50">
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

            {/* Bottom Action Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-slate-900 p-4 border-t border-slate-800 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.5)]">
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

        {/* Step 4: Driver on the way */}
        {step === 'on_way' && (
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
    </div>
  );
};
