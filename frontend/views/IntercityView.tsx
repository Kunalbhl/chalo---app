import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Calendar, Users, MapPin, ArrowUpDown, Loader2, CheckCircle2, ShieldCheck, Info, X, CreditCard, Smartphone, Wallet, UserPlus, UserCheck, Trash2 } from 'lucide-react';
import { ChaloLogo } from '../components/Icons';
import { ProviderBadge } from '../components/ProviderBadge';
import { IntercityVehicleOption, ActivityItem, Guest } from '../types';

interface IntercityViewProps {
  onBack: () => void;
  onAddActivity: (newActivity: ActivityItem) => void;
  savedGuests: Guest[];
  onAddGuest: (guest: Guest) => void;
}

const INTERCITY_DATABASE: IntercityVehicleOption[] = [
  { id: 'ic-1', provider: 'chalo', name: 'Chalo Outstation Mini', type: 'Hatchback', description: 'Comfy hatchback for quick getaways', price: 2500, capacity: 4, features: ['AC', 'Music', 'Toll Included'], imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=200&q=80' },
  { id: 'ic-2', provider: 'ola', name: 'Ola Outstation Sedan', type: 'Sedan', description: 'Spacious sedan for family trips', price: 3200, capacity: 4, features: ['AC', 'Extra Legroom', 'Toll Included'], imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=200&q=80' },
  { id: 'ic-3', provider: 'uber', name: 'Uber Intercity SUV', type: 'SUV', description: 'Premium SUV for group travel', price: 4500, capacity: 6, features: ['AC', 'Carrier', 'Toll Included'], imageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=200&q=80' },
  { id: 'ic-4', provider: 'makemytrip', name: 'MMT Tempo Traveller', type: 'Tempo Traveller', description: '12-seater AC Tempo Traveller', price: 8500, capacity: 12, features: ['AC', 'Pushback Seats', 'Music System'], imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=200&q=80' },
  { id: 'ic-5', provider: 'redbus', name: 'Volvo Multi-Axle AC Sleeper', type: 'Bus', description: 'Premium sleeper bus service', price: 1200, capacity: 40, features: ['AC', 'Sleeper', 'Blanket', 'Water Bottle'], imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=200&q=80' },
  { id: 'ic-6', provider: 'chalo', name: 'Chalo AC Seater Bus', type: 'Bus', description: 'Comfortable seater bus', price: 800, capacity: 45, features: ['AC', 'Pushback Seats', 'Charging Point'], imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=200&q=80' },
];

export const IntercityView: React.FC<IntercityViewProps> = ({ onBack, onAddActivity, savedGuests, onAddGuest }) => {
  const [fromCity, setFromCity] = useState('Bengaluru');
  const [toCity, setToCity] = useState('Mysuru');
  const [departureDate, setDepartureDate] = useState('Tomorrow');
  const [passengers, setPassengers] = useState<number>(2);
  
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<IntercityVehicleOption | null>(null);
  
  // Booking Flow States
  const [bookingStep, setBookingStep] = useState<'details' | 'guest' | 'payment' | 'success'>('details');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  // Guest Details (Multiple Passengers)
  const [passengerDetails, setPassengerDetails] = useState<Guest[]>(
    Array.from({ length: passengers }, (_, i) => ({ id: `temp-${i}`, name: '', phone: '', email: '' }))
  );
  const [saveGuestDetails, setSaveGuestDetails] = useState(true);
  const [showSavedGuests, setShowSavedGuests] = useState<number | null>(null); // Index of passenger being edited
  
  // Payment
  const [selectedPayment, setSelectedPayment] = useState('upi');

  // Update passenger array when count changes
  React.useEffect(() => {
    setPassengerDetails(prev => {
      if (prev.length === passengers) return prev;
      if (prev.length < passengers) {
        return [...prev, ...Array.from({ length: passengers - prev.length }, (_, i) => ({ id: `temp-${Date.now()}-${i}`, name: '', phone: '', email: '' }))];
      }
      return prev.slice(0, passengers);
    });
  }, [passengers]);

  const handleSwapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const handleSearch = () => {
    if (!fromCity || !toCity) {
      alert("Please enter both pickup and drop locations.");
      return;
    }
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
    }, 2000);
  };

  const recommendedType = useMemo(() => {
    if (passengers <= 4) return 'Sedan';
    if (passengers <= 6) return 'SUV';
    if (passengers <= 14) return 'Tempo Traveller';
    return 'Bus';
  }, [passengers]);

  const filteredVehicles = useMemo(() => {
    return INTERCITY_DATABASE.filter(v => v.type === 'Bus' || v.capacity >= passengers).sort((a, b) => {
      if (a.type === recommendedType && b.type !== recommendedType) return -1;
      if (a.type !== recommendedType && b.type === recommendedType) return 1;
      return a.price - b.price;
    });
  }, [passengers, recommendedType]);

  const handleBook = (vehicle: IntercityVehicleOption) => {
    setSelectedVehicle(vehicle);
    setBookingStep('details');
  };

  const handleProceedToGuest = () => {
    setBookingStep('guest');
  };

  const handlePassengerChange = (index: number, field: keyof Guest, value: string) => {
    const updated = [...passengerDetails];
    updated[index] = { ...updated[index], [field]: value };
    setPassengerDetails(updated);
  };

  const handleSelectSavedGuest = (index: number, guest: Guest) => {
    const updated = [...passengerDetails];
    updated[index] = { ...guest, id: `temp-${Date.now()}` }; // Keep temp ID for form management
    setPassengerDetails(updated);
    setShowSavedGuests(null);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all passengers have names
    const isValid = passengerDetails.every(p => p.name.trim() !== '');
    if (!isValid) {
      alert('Please enter names for all passengers.');
      return;
    }

    if (saveGuestDetails) {
      passengerDetails.forEach(p => {
        if (p.name && p.phone) {
          const exists = savedGuests.some(g => g.phone === p.phone);
          if (!exists) {
            onAddGuest({
              id: `g-${Date.now()}-${Math.random()}`,
              name: p.name,
              phone: p.phone,
              email: p.email || ''
            });
          }
        }
      });
    }
    setBookingStep('payment');
  };

  const confirmBooking = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setBookingSuccess(true);
      setBookingStep('success');
      
      const totalAmount = selectedVehicle?.type === 'Bus' ? (selectedVehicle.price * passengers) : selectedVehicle?.price || 0;

      onAddActivity({
        id: `act-${Date.now()}`,
        provider: selectedVehicle?.provider || 'chalo',
        type: 'intercity',
        title: `${selectedVehicle?.name} to ${toCity}`,
        date: 'Just Now',
        status: 'completed',
        price: totalAmount
      });
    }, 2000);
  };

  const closeBookingModal = () => {
    if (isProcessing) return;
    setSelectedVehicle(null);
    setBookingStep('details');
    setBookingSuccess(false);
    if (bookingStep === 'success') {
      setShowResults(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-800 relative">
      {/* Header */}
      <div className="bg-slate-950 pt-12 pb-4 px-4 shadow-sm sticky top-0 z-20 border-b border-slate-900 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-800 active:bg-slate-700 transition-colors">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <button onClick={onBack} className="active:scale-95 transition-transform hover:scale-105 duration-200">
            <ChaloLogo className="w-8 h-8" />
          </button>
          <h1 className="font-bold text-xl text-white">Intercity Travel</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-6">
        {/* Search Form */}
        {!showResults && (
          <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 shadow-soft space-y-4">
            {/* From & To Swap */}
            <div className="relative">
              <div className="space-y-3">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-50"></div>
                  <div className="flex-1 ml-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pickup City</p>
                    <input 
                      type="text" 
                      value={fromCity} 
                      onChange={(e) => setFromCity(e.target.value)}
                      className="w-full bg-transparent border-none outline-none font-bold text-slate-800 text-sm mt-0.5"
                      placeholder="Enter pickup city"
                    />
                  </div>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-sm bg-brand-600 ring-4 ring-brand-50"></div>
                  <div className="flex-1 ml-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Drop City</p>
                    <input 
                      type="text" 
                      value={toCity} 
                      onChange={(e) => setToCity(e.target.value)}
                      className="w-full bg-transparent border-none outline-none font-bold text-slate-800 text-sm mt-0.5"
                      placeholder="Enter drop city"
                    />
                  </div>
                </div>
              </div>
              {/* Swap Button */}
              <button 
                onClick={handleSwapCities}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-brand-600 text-white p-2.5 rounded-xl shadow-md border border-brand-500/30 active:scale-95 transition-transform"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>

            {/* Date & Travellers */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Departure</p>
                <input 
                  type="text" 
                  value={departureDate} 
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full bg-transparent border-none outline-none font-bold text-slate-800 text-sm mt-0.5"
                />
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Passengers</p>
                <div className="flex items-center justify-between mt-0.5">
                  <button onClick={() => setPassengers(Math.max(1, passengers - 1))} className="w-6 h-6 bg-slate-100 rounded-md flex items-center justify-center font-bold text-slate-600">-</button>
                  <span className="font-bold text-slate-800 text-sm">{passengers}</span>
                  <button onClick={() => setPassengers(passengers + 1)} className="w-6 h-6 bg-slate-100 rounded-md flex items-center justify-center font-bold text-slate-600">+</button>
                </div>
              </div>
            </div>

            <button 
              onClick={handleSearch}
              className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-base shadow-md transition-colors flex items-center justify-center gap-2"
            >
              Search Vehicles
            </button>
          </div>
        )}

        {/* Loading State */}
        {isSearching && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Loader2 className="w-12 h-12 text-brand-600 animate-spin mb-4" />
            <h3 className="font-bold text-lg text-slate-900">Finding Best Options</h3>
            <p className="text-xs text-slate-500 max-w-[280px] mt-1">
              Searching Cabs, Tempo Travellers, and Buses for your route...
            </p>
          </div>
        )}

        {/* Results */}
        {showResults && !isSearching && (
          <div className="space-y-4">
            {/* Search Summary Header */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{fromCity} to {toCity}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{departureDate} • {passengers} Passengers</p>
              </div>
              <button 
                onClick={() => setShowResults(false)}
                className="text-brand-600 text-xs font-bold bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-100"
              >
                Modify
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-3 items-start">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 font-medium leading-relaxed">
                Based on {passengers} passengers, we recommend booking a <span className="font-bold">{recommendedType}</span> for a comfortable journey.
              </p>
            </div>

            {/* Vehicle Cards */}
            <div className="space-y-4">
              {filteredVehicles.map((vehicle) => {
                const isRecommended = vehicle.type === recommendedType;
                const isBus = vehicle.type === 'Bus';
                const displayPrice = isBus ? vehicle.price * passengers : vehicle.price;

                return (
                  <div key={vehicle.id} className={`bg-white rounded-3xl p-5 border shadow-soft flex flex-col gap-4 hover:scale-[1.02] transition-transform duration-300 ${isRecommended ? 'border-brand-500 shadow-glow-indigo' : 'border-slate-100'}`}>
                    {isRecommended && (
                      <div className="absolute -top-3 left-4 bg-brand-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                        Recommended
                      </div>
                    )}
                    
                    <div className="flex items-start gap-4">
                      <img src={vehicle.imageUrl} alt={vehicle.name} className="w-20 h-20 rounded-2xl object-cover border border-slate-200" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-slate-900 text-base">{vehicle.name}</h4>
                          <ProviderBadge provider={vehicle.provider} />
                        </div>
                        <p className="text-xs text-slate-500 font-medium">{vehicle.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md flex items-center gap-1">
                            <Users className="w-3 h-3" /> Up to {vehicle.capacity}
                          </span>
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                            {vehicle.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {vehicle.features.map((feat, idx) => (
                        <span key={idx} className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                          ✓ {feat}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          {isBus ? `Total for ${passengers} Tickets` : 'Total Fare'}
                        </p>
                        <p className="font-black text-xl text-slate-900">₹{displayPrice}</p>
                      </div>
                      <button 
                        onClick={() => handleBook(vehicle)}
                        className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-colors shadow-md active:scale-95"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Multi-step Booking Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={closeBookingModal}></div>
          <div className="bg-white rounded-t-[2.5rem] p-6 relative z-10 border-t border-slate-100 max-h-[92vh] w-full overflow-y-auto hide-scrollbar animate-[slideUp_0.3s_ease-out] text-slate-800 pb-8">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 cursor-grab"></div>
            <button 
              onClick={closeBookingModal}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
              disabled={isProcessing}
            >
              <X className="w-5 h-5" />
            </button>

            {bookingStep === 'details' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-extrabold text-slate-900">Booking Details</h2>
                  <p className="text-sm text-slate-500 font-medium mt-1">Review selection and provide guest info</p>
                </div>

                <div className="flex gap-4 items-center">
                  <img src={selectedVehicle.imageUrl} alt={selectedVehicle.name} className="w-24 h-24 object-cover rounded-2xl border border-slate-200" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-lg text-slate-900">{selectedVehicle.name}</h3>
                      <ProviderBadge provider={selectedVehicle.provider} />
                    </div>
                    <p className="text-xs text-slate-600">{selectedVehicle.description}</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Route</span>
                    <span className="font-bold text-slate-800">{fromCity} → {toCity}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date</span>
                    <span className="font-bold text-slate-800">{departureDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Passengers</span>
                    <span className="font-bold text-slate-800">{passengers}</span>
                  </div>
                </div>

                <button 
                  onClick={handleProceedToGuest}
                  className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-lg shadow-md transition-colors"
                >
                  Proceed to Passenger Details
                </button>
              </div>
            )}

            {bookingStep === 'guest' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <button onClick={() => setBookingStep('details')} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <h2 className="text-2xl font-extrabold text-slate-900">Passenger Details</h2>
                </div>
                <p className="text-sm text-slate-500 font-medium">Please provide details for all {passengers} passengers.</p>

                <form onSubmit={handleProceedToPayment} className="space-y-6">
                  {passengerDetails.map((passenger, index) => (
                    <div key={passenger.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4 relative">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Passenger {index + 1} {index === 0 && '(Primary)'}</h3>
                        {savedGuests.length > 0 && (
                          <button 
                            type="button"
                            onClick={() => setShowSavedGuests(showSavedGuests === index ? null : index)}
                            className="text-brand-600 text-xs font-bold flex items-center gap-1"
                          >
                            <UserCheck className="w-3.5 h-3.5" /> Saved
                          </button>
                        )}
                      </div>

                      {showSavedGuests === index && savedGuests.length > 0 && (
                        <div className="bg-white rounded-xl p-2 border border-slate-200 space-y-1 animate-[fadeIn_0.2s_ease-out] absolute z-10 w-[calc(100%-2rem)] shadow-lg">
                          {savedGuests.map(guest => (
                            <div 
                              key={guest.id} 
                              onClick={() => handleSelectSavedGuest(index, guest)}
                              className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                            >
                              <div>
                                <p className="font-bold text-slate-800 text-sm">{guest.name}</p>
                                <p className="text-xs text-slate-500">{guest.phone}</p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            </div>
                          ))}
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={passenger.name}
                          onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                          placeholder="Enter full name as per ID" 
                          className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                        />
                      </div>
                      
                      {/* Only require phone/email for primary passenger */}
                      {index === 0 && (
                        <>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mobile Number</label>
                            <input 
                              type="tel" 
                              required
                              value={passenger.phone}
                              onChange={(e) => handlePassengerChange(index, 'phone', e.target.value)}
                              placeholder="Enter mobile number" 
                              className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                            <input 
                              type="email" 
                              value={passenger.email}
                              onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                              placeholder="Enter email address (optional)" 
                              className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  
                  <div className="flex items-center gap-3 pt-2">
                    <input 
                      type="checkbox" 
                      id="saveGuest" 
                      checked={saveGuestDetails}
                      onChange={(e) => setSaveGuestDetails(e.target.checked)}
                      className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500 accent-brand-600"
                    />
                    <label htmlFor="saveGuest" className="text-sm font-medium text-slate-700 cursor-pointer">
                      Save these details for future bookings
                    </label>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 mt-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-lg shadow-md transition-colors"
                  >
                    Proceed to Payment
                  </button>
                </form>
              </div>
            )}

            {bookingStep === 'payment' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <button onClick={() => setBookingStep('guest')} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <h2 className="text-2xl font-extrabold text-slate-900">Payment</h2>
                </div>

                {/* Price Breakdown */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                  <div className="flex justify-between text-sm font-semibold text-slate-500">
                    <span>Base Fare ({passengers}x)</span>
                    <span>₹{selectedVehicle.type === 'Bus' ? (selectedVehicle.price * passengers) - 150 : selectedVehicle.price - 250}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-slate-500">
                    <span>Taxes & Tolls</span>
                    <span>₹{selectedVehicle.type === 'Bus' ? 150 : 250}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200/60">
                    <span>Total Amount</span>
                    <span className="text-brand-600">₹{selectedVehicle.type === 'Bus' ? (selectedVehicle.price * passengers) : selectedVehicle.price}</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Payment Method</h3>
                  
                  <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${selectedPayment === 'upi' ? 'border-brand-500 bg-brand-50/50' : 'border-slate-200 bg-white'}`}>
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-slate-600" />
                      <span className="font-bold text-slate-800 text-sm">UPI (GPay, PhonePe)</span>
                    </div>
                    <input type="radio" name="payment" checked={selectedPayment === 'upi'} onChange={() => setSelectedPayment('upi')} className="w-4 h-4 text-brand-600 accent-brand-600" />
                  </label>

                  <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${selectedPayment === 'card' ? 'border-brand-500 bg-brand-50/50' : 'border-slate-200 bg-white'}`}>
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-slate-600" />
                      <span className="font-bold text-slate-800 text-sm">Credit / Debit Card</span>
                    </div>
                    <input type="radio" name="payment" checked={selectedPayment === 'card'} onChange={() => setSelectedPayment('card')} className="w-4 h-4 text-brand-600 accent-brand-600" />
                  </label>

                  <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${selectedPayment === 'wallet' ? 'border-brand-500 bg-brand-50/50' : 'border-slate-200 bg-white'}`}>
                    <div className="flex items-center gap-3">
                      <Wallet className="w-5 h-5 text-slate-600" />
                      <span className="font-bold text-slate-800 text-sm">Wallets</span>
                    </div>
                    <input type="radio" name="payment" checked={selectedPayment === 'wallet'} onChange={() => setSelectedPayment('wallet')} className="w-4 h-4 text-brand-600 accent-brand-600" />
                  </label>
                </div>

                {isProcessing ? (
                  <div className="py-4 flex flex-col items-center">
                    <Loader2 className="w-8 h-8 text-brand-600 animate-spin mb-4" />
                    <p className="text-sm font-bold text-slate-600">Processing payment securely...</p>
                  </div>
                ) : (
                  <button 
                    onClick={confirmBooking}
                    className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-lg shadow-md transition-colors"
                  >
                    Pay ₹{selectedVehicle.type === 'Bus' ? (selectedVehicle.price * passengers) : selectedVehicle.price}
                  </button>
                )}

                <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" /> Secured by Chalo Pay
                </div>
              </div>
            )}

            {bookingStep === 'success' && (
              <div className="flex flex-col items-center text-center py-8">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border border-emerald-100 shadow-sm">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900">Booking Confirmed!</h2>
                <p className="text-sm text-slate-500 font-medium mt-1 max-w-[280px]">
                  Your intercity travel has been successfully booked via <span className="font-bold text-slate-800 capitalize">{selectedVehicle.provider}</span>.
                </p>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 w-full my-6 text-left space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <span>Vehicle</span>
                    <span>Booking ID</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-800">
                    <span>{selectedVehicle.name}</span>
                    <span className="font-mono">IC{Math.floor(Math.random() * 900000 + 100000)}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-slate-200">
                    <p className="text-xs text-slate-500">Receipt sent to: <span className="font-bold text-slate-700">{passengerDetails[0]?.email || passengerDetails[0]?.phone}</span></p>
                  </div>
                </div>
                <button 
                  onClick={closeBookingModal}
                  className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-lg shadow-md transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
