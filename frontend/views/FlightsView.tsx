import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Calendar, Users, Plane, X, ArrowUpDown, Loader2, CheckCircle2, ShieldCheck, CreditCard, Smartphone, Wallet, UserCheck, ChevronRight } from 'lucide-react';
import { ChaloLogo } from '../components/Icons';
import { ProviderBadge } from '../components/ProviderBadge';
import { TravelProvider, ActivityItem, Guest } from '../types';
import { RazorpayCheckout } from '../components/RazorpayCheckout';

interface FlightsViewProps {
  onBack: () => void;
  onAddActivity: (newActivity: ActivityItem) => void;
  savedGuests: Guest[];
  onAddGuest: (guest: Guest) => void;
}

interface FlightOption {
  id: string;
  airline: string;
  logoUrl: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: 'Non-stop' | '1 Stop' | '2 Stops';
  provider: TravelProvider;
  price: number;
  originalPrice: number;
}

const FLIGHT_DATABASE: FlightOption[] = [
  { id: 'f-1', airline: 'IndiGo', logoUrl: 'https://icon.horse/icon/goindigo.in', flightNumber: '6E-2134', departureTime: '06:00 AM', arrivalTime: '08:45 AM', duration: '2h 45m', stops: 'Non-stop', provider: 'makemytrip', price: 4850, originalPrice: 5500 },
  { id: 'f-2', airline: 'IndiGo', logoUrl: 'https://icon.horse/icon/goindigo.in', flightNumber: '6E-2134', departureTime: '06:00 AM', arrivalTime: '08:45 AM', duration: '2h 45m', stops: 'Non-stop', provider: 'cleartrip', price: 4720, originalPrice: 5500 },
  { id: 'f-3', airline: 'Air India', logoUrl: 'https://icon.horse/icon/airindia.in', flightNumber: 'AI-804', departureTime: '08:15 AM', arrivalTime: '11:00 AM', duration: '2h 45m', stops: 'Non-stop', provider: 'ixigo', price: 5200, originalPrice: 6000 },
  { id: 'f-4', airline: 'Air India', logoUrl: 'https://icon.horse/icon/airindia.in', flightNumber: 'AI-804', departureTime: '08:15 AM', arrivalTime: '11:00 AM', duration: '2h 45m', stops: 'Non-stop', provider: 'skyscanner', price: 5100, originalPrice: 6000 },
  { id: 'f-5', airline: 'Vistara', logoUrl: 'https://icon.horse/icon/airvistara.com', flightNumber: 'UK-812', departureTime: '11:30 AM', arrivalTime: '02:15 PM', duration: '2h 45m', stops: 'Non-stop', provider: 'kayak', price: 6150, originalPrice: 7200 },
  { id: 'f-6', airline: 'Vistara', logoUrl: 'https://icon.horse/icon/airvistara.com', flightNumber: 'UK-812', departureTime: '11:30 AM', arrivalTime: '02:15 PM', duration: '2h 45m', stops: 'Non-stop', provider: 'makemytrip', price: 5999, originalPrice: 7200 },
  { id: 'f-7', airline: 'Akasa Air', logoUrl: 'https://icon.horse/icon/akasaair.com', flightNumber: 'QP-1102', departureTime: '04:45 PM', arrivalTime: '07:35 PM', duration: '2h 50m', stops: 'Non-stop', provider: 'cleartrip', price: 4350, originalPrice: 5000 },
];

export const FlightsView: React.FC<FlightsViewProps> = ({ onBack, onAddActivity, savedGuests, onAddGuest }) => {
  const [fromCity, setFromView] = useState('Bengaluru (BLR)');
  const [toCity, setToView] = useState('Delhi (DEL)');
  const [departureDate, setDepartureDate] = useState('18 Oct 2024');
  const [passengers, setPassengers] = useState<number>(1);
  
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'duration'>('price');
  const [selectedFlight, setSelectedFlight] = useState<FlightOption | null>(null);
  
  // Booking Flow States
  const [bookingStep, setBookingStep] = useState<'details' | 'guest' | 'payment' | 'success'>('details');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showRazorpay, setShowRazorpay] = useState(false);
  
  // Guest Details (Multiple Passengers)
  const [passengerDetails, setPassengerDetails] = useState<Guest[]>([
    { id: 'temp-0', name: '', phone: '', email: '' }
  ]);
  const [saveGuestDetails, setSaveGuestDetails] = useState(true);
  const [showSavedGuests, setShowSavedGuests] = useState<number | null>(null);
  
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
    setFromView(toCity);
    setToView(temp);
  };

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
    }, 2000);
  };

  const sortedFlights = useMemo(() => {
    return [...FLIGHT_DATABASE].sort((a, b) => {
      if (sortBy === 'duration') {
        return a.duration.localeCompare(b.duration);
      }
      return a.price - b.price;
    });
  }, [sortBy]);

  const handleBookFlight = (flight: FlightOption) => {
    setSelectedFlight(flight);
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
    updated[index] = { ...guest, id: `temp-${Date.now()}` };
    setPassengerDetails(updated);
    setShowSavedGuests(null);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
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

  const handleConfirmBooking = () => {
    setShowRazorpay(true);
  };

  const processBooking = () => {
    setShowRazorpay(false);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setBookingSuccess(true);
      setBookingStep('success');

      onAddActivity({
        id: `act-${Date.now()}`,
        provider: selectedFlight?.provider || 'chalo',
        type: 'flights',
        title: `${selectedFlight?.airline} to ${toCity.split(' ')[0]}`,
        date: 'Just Now',
        status: 'completed',
        price: (selectedFlight?.price || 0) * passengers
      });
    }, 2000);
  };

  const closeBookingModal = () => {
    if (isProcessing) return;
    setSelectedFlight(null);
    setBookingStep('details');
    setBookingSuccess(false);
    if (bookingStep === 'success') {
      setShowResults(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-800 relative">
      {showRazorpay && selectedFlight && (
        <RazorpayCheckout 
          amount={selectedFlight.price * passengers} 
          onSuccess={processBooking} 
          onCancel={() => setShowRazorpay(false)} 
        />
      )}

      {/* Header */}
      <div className="bg-slate-950 pt-12 pb-4 px-4 shadow-sm sticky top-0 z-20 border-b border-slate-900 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-800 active:bg-slate-700 transition-colors">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <button onClick={onBack} className="active:scale-95 transition-transform hover:scale-105 duration-200">
            <ChaloLogo className="w-8 h-8" />
          </button>
          <h1 className="font-bold text-xl text-white">Book Flights</h1>
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
                  <Plane className="w-5 h-5 text-slate-400 rotate-45" />
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">From</p>
                    <input 
                      type="text" 
                      value={fromCity} 
                      onChange={(e) => setFromView(e.target.value)}
                      className="w-full bg-transparent border-none outline-none font-bold text-slate-800 text-sm mt-0.5"
                    />
                  </div>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 flex items-center gap-3">
                  <Plane className="w-5 h-5 text-slate-400 rotate-[135deg]" />
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">To</p>
                    <input 
                      type="text" 
                      value={toCity} 
                      onChange={(e) => setToView(e.target.value)}
                      className="w-full bg-transparent border-none outline-none font-bold text-slate-800 text-sm mt-0.5"
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
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Departure Date</p>
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
              Search Flights
            </button>
          </div>
        )}

        {/* Loading State */}
        {isSearching && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Loader2 className="w-12 h-12 text-brand-600 animate-spin mb-4" />
            <h3 className="font-bold text-lg text-slate-900">Comparing Flight Deals</h3>
            <p className="text-xs text-slate-500 max-w-[280px] mt-1">
              Fetching real-time prices from MakeMyTrip, Cleartrip, Ixigo, Skyscanner, and Kayak...
            </p>
          </div>
        )}

        {/* Flight Results */}
        {showResults && !isSearching && (
          <div className="space-y-4">
            {/* Search Summary Header */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{fromCity} to {toCity}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{departureDate} • {passengers} Passenger(s)</p>
              </div>
              <button 
                onClick={() => setShowResults(false)}
                className="text-brand-600 text-xs font-bold bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-100"
              >
                Modify
              </button>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-base">Compare Flight Deals</h2>
              <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200">
                <button 
                  onClick={() => setSortBy('price')} 
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${sortBy === 'price' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
                >
                  Cheapest
                </button>
                <button 
                  onClick={() => setSortBy('duration')} 
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${sortBy === 'duration' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
                >
                  Fastest
                </button>
              </div>
            </div>

            {/* Flight Cards */}
            <div className="space-y-4">
              {sortedFlights.map((flight) => (
                <div key={flight.id} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft flex flex-col gap-4 hover:scale-[1.02] transition-transform duration-300">
                  {/* Airline Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center overflow-hidden bg-slate-50">
                        <img src={flight.logoUrl} alt={flight.airline} className="w-6 h-6 object-contain" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{flight.airline}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{flight.flightNumber}</p>
                      </div>
                    </div>
                    <ProviderBadge provider={flight.provider} />
                  </div>

                  {/* Flight Times & Duration */}
                  <div className="flex items-center justify-between text-center">
                    <div className="text-left">
                      <p className="font-extrabold text-slate-900 text-base">{flight.departureTime}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">BLR</p>
                    </div>
                    <div className="flex-1 px-4 relative flex flex-col items-center">
                      <p className="text-xs text-slate-500 font-semibold">{flight.duration}</p>
                      <div className="w-full h-0.5 bg-slate-200 my-1.5 relative">
                        <div className="absolute w-1.5 h-1.5 bg-brand-500 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{flight.stops}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-slate-900 text-base">{flight.arrivalTime}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">DEL</p>
                    </div>
                  </div>

                  {/* Price & Book Button */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total for {passengers}</p>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="font-black text-xl text-brand-600">₹{flight.price * passengers}</span>
                        <span className="text-xs text-slate-400 line-through font-medium">₹{flight.originalPrice * passengers}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleBookFlight(flight)}
                      className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-md active:scale-95"
                    >
                      Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Multi-step Booking Modal */}
      {selectedFlight && (
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
                  <h2 className="text-2xl font-extrabold text-slate-900">Flight Details</h2>
                  <p className="text-sm text-slate-500 font-medium mt-1">Review selection and provide guest info</p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden bg-white">
                        <img src={selectedFlight.logoUrl} alt={selectedFlight.airline} className="w-6 h-6 object-contain" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{selectedFlight.airline}</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{selectedFlight.flightNumber}</p>
                      </div>
                    </div>
                    <ProviderBadge provider={selectedFlight.provider} />
                  </div>

                  <div className="flex items-center justify-between text-center pt-2">
                    <div className="text-left">
                      <p className="font-extrabold text-slate-900 text-lg">{selectedFlight.departureTime}</p>
                      <p className="text-xs text-slate-500 font-bold mt-0.5">{fromCity.split(' ')[0]}</p>
                    </div>
                    <div className="flex-1 px-4 relative flex flex-col items-center">
                      <p className="text-xs text-slate-500 font-semibold">{selectedFlight.duration}</p>
                      <div className="w-full h-0.5 bg-slate-200 my-1.5 relative">
                        <div className="absolute w-1.5 h-1.5 bg-brand-500 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{selectedFlight.stops}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-slate-900 text-lg">{selectedFlight.arrivalTime}</p>
                      <p className="text-xs text-slate-500 font-bold mt-0.5">{toCity.split(' ')[0]}</p>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-slate-200/60 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date</span>
                    <span className="font-bold text-slate-800">{departureDate}</span>
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
                    <span>₹{(selectedFlight.price - 450) * passengers}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-slate-500">
                    <span>Taxes & Fees</span>
                    <span>₹{450 * passengers}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200/60">
                    <span>Total Amount</span>
                    <span className="text-brand-600">₹{selectedFlight.price * passengers}</span>
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
                    onClick={handleConfirmBooking}
                    className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-lg shadow-md transition-colors"
                  >
                    Pay ₹{selectedFlight.price * passengers}
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
                  Your flight ticket has been successfully booked via <span className="font-bold text-slate-800 capitalize">{selectedFlight.provider}</span>.
                </p>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 w-full my-6 text-left space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <span>Flight</span>
                    <span>PNR / Reference</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-800">
                    <span>{selectedFlight.airline} ({selectedFlight.flightNumber})</span>
                    <span className="font-mono">CH{Math.floor(Math.random() * 900000 + 100000)}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-slate-200">
                    <p className="text-xs text-slate-500">E-ticket sent to: <span className="font-bold text-slate-700">{passengerDetails[0]?.email || passengerDetails[0]?.phone}</span></p>
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
