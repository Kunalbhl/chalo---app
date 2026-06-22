import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ArrowLeft, MapPin, Calendar, Users, Search, CheckCircle2, ShieldCheck, Loader2, X, Navigation, Briefcase, Plane, CreditCard, Smartphone, Wallet, Banknote, Sparkles } from 'lucide-react';
import { ChaloLogo, getVehicleIcon } from '../components/Icons';
import { ActivityItem, SavedMethod, WalletItem } from '../types';
import { ProviderBadge } from '../components/ProviderBadge';
import { RazorpayCheckout } from '../components/RazorpayCheckout';

interface IntercityViewProps {
  onBack: () => void;
  currentLocation: string;
  preferredPayment: string;
  upis: SavedMethod[];
  cards: SavedMethod[];
  wallets: WalletItem[];
  walletBalance: number;
  onAddActivity: (newActivity: ActivityItem) => void;
}

interface IntercityVehicle {
  id: string;
  name: string;
  type: string;
  capacity: number;
  pricePerKm: number;
  baseFare: number;
  imageUrl: string;
  provider: 'chalo' | 'uber' | 'ola';
}

const VEHICLES: IntercityVehicle[] = [
  { id: 'v1', name: 'Sedan', type: 'Dzire, Etios', capacity: 4, pricePerKm: 12, baseFare: 500, imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=200&q=80', provider: 'chalo' },
  { id: 'v2', name: 'SUV', type: 'Innova, Ertiga', capacity: 6, pricePerKm: 16, baseFare: 800, imageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=200&q=80', provider: 'ola' },
  { id: 'v3', name: 'Premium SUV', type: 'Innova Crysta', capacity: 7, pricePerKm: 20, baseFare: 1000, imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=200&q=80', provider: 'uber' },
  { id: 'v4', name: 'Tempo Traveller', type: 'Force Traveller', capacity: 12, pricePerKm: 25, baseFare: 1500, imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=200&q=80', provider: 'chalo' },
  { id: 'v5', name: 'Mini Bus', type: '20 Seater Bus', capacity: 20, pricePerKm: 40, baseFare: 2500, imageUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=200&q=80', provider: 'chalo' },
];

const MOCK_CITIES = [
  'Bengaluru', 'Mysuru', 'Chennai', 'Hyderabad', 'Mumbai', 'Pune', 'Delhi', 'Jaipur'
];

export const IntercityView: React.FC<IntercityViewProps> = ({ onBack, currentLocation, preferredPayment, upis, cards, wallets, walletBalance, onAddActivity }) => {
  const [step, setStep] = useState<'search' | 'verify_pickup' | 'results' | 'booking' | 'confirming' | 'accepted' | 'on_way'>('search');
  const [fromCity, setFromCity] = useState(currentLocation);
  const [toCity, setToCity] = useState('');
  const [date, setDate] = useState('Tomorrow');
  const [passengers, setPassengers] = useState(4);
  const [luggage, setLuggage] = useState(2);
  
  const [isSearching, setIsSearching] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<IntercityVehicle | null>(null);
  
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>(preferredPayment);
  const [showRazorpay, setShowRazorpay] = useState(false);

  // Tracking state
  const [carPos, setCarPos] = useState({ top: '80%', left: '20%' });

  // Map States
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const autocompleteInputRef = useRef<HTMLInputElement>(null);
  const pickupInputRef = useRef<HTMLInputElement>(null);

  // Initialize Google Map
  useEffect(() => {
    if (mapRef.current && !map && window.google) {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: 12.9716, lng: 77.5946 }, // Default Bengaluru
        zoom: 13,
        disableDefaultUI: true,
      });
      
      const newDirectionsRenderer = new window.google.maps.DirectionsRenderer({
        map: newMap,
        suppressMarkers: false,
      });

      setMap(newMap);
      setDirectionsRenderer(newDirectionsRenderer);
    }
  }, [mapRef.current]);

  // Initialize Autocomplete for Dropoff
  useEffect(() => {
    if (step === 'search' && autocompleteInputRef.current && window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(autocompleteInputRef.current, {
        types: ['geocode', 'establishment'],
        componentRestrictions: { country: 'in' }
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address || place.name) {
          const address = place.formatted_address || place.name || '';
          setToCity(address);
        }
      });
    }
  }, [step]);

  // Initialize Autocomplete for Pickup
  useEffect(() => {
    if (step === 'search' && pickupInputRef.current && window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(pickupInputRef.current, {
        types: ['geocode', 'establishment'],
        componentRestrictions: { country: 'in' }
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address || place.name) {
          setFromCity(place.formatted_address || place.name || '');
        }
      });
    }
  }, [step]);

  // Draw Route when pickup and dropoff are set
  useEffect(() => {
    if ((step === 'verify_pickup' || step === 'results') && fromCity && toCity && window.google && directionsRenderer) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: fromCity,
          destination: toCity,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  }, [step, fromCity, toCity, directionsRenderer]);

  // Mock distance calculation based on cities
  const distance = useMemo(() => {
    if (fromCity.includes('Bengaluru') && toCity.includes('Chennai')) return 350;
    if (fromCity.includes('Bengaluru') && toCity.includes('Hyderabad')) return 570;
    return 145; // Default Mysuru
  }, [fromCity, toCity]);

  const recommendedVehicle = useMemo(() => {
    if (passengers <= 4 && luggage <= 2) return VEHICLES[0];
    if (passengers <= 6 && luggage <= 4) return VEHICLES[1];
    if (passengers <= 7) return VEHICLES[2];
    if (passengers <= 12) return VEHICLES[3];
    return VEHICLES[4];
  }, [passengers, luggage]);

  // Flight Recommendation Logic
  const flightAlternative = useMemo(() => {
    if (distance > 300) {
      return {
        airline: 'IndiGo',
        price: 3500 * passengers,
        duration: '1h 15m',
        provider: 'makemytrip' as const
      };
    }
    return null;
  }, [distance, passengers]);

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

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setStep('verify_pickup');
    }, 1500);
  };

  const handleConfirmPickup = () => {
    setStep('results');
  };

  const handleBook = (vehicle: IntercityVehicle) => {
    setSelectedVehicle(vehicle);
    setStep('booking');
  };

  const handleConfirmBooking = () => {
    if (selectedPayment !== 'cash') {
      setShowRazorpay(true);
    } else {
      processBooking();
    }
  };

  const processBooking = () => {
    setShowRazorpay(false);
    setStep('confirming');
    onAddActivity({
      id: `act-${Date.now()}`,
      provider: selectedVehicle?.provider || 'chalo',
      type: 'intercity',
      title: `Intercity to ${toCity.split(',')[0]}`,
      date: 'Just Now',
      status: 'ongoing',
      price: (selectedVehicle?.baseFare || 0) + ((selectedVehicle?.pricePerKm || 0) * distance)
    });
  };

  return (
    <div className="min-h-screen bg-brand-950 flex flex-col font-sans text-slate-100 relative overflow-hidden">
      {showRazorpay && selectedVehicle && (
        <RazorpayCheckout 
          amount={(selectedVehicle.baseFare || 0) + ((selectedVehicle.pricePerKm || 0) * distance)} 
          onSuccess={processBooking} 
          onCancel={() => setShowRazorpay(false)} 
        />
      )}

      {/* Header */}
      <div className="bg-slate-900/90 pt-12 pb-4 px-4 shadow-sm sticky top-0 z-20 border-b border-slate-800/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button onClick={step === 'search' ? onBack : () => setStep('search')} className="p-2 -ml-2 rounded-full hover:bg-slate-800 active:bg-slate-700 transition-colors">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <button onClick={onBack} className="active:scale-95 transition-transform hover:scale-105 duration-200">
            <ChaloLogo className="w-8 h-8" />
          </button>
          <h1 className="font-bold text-xl text-white">Intercity Rides</h1>
        </div>
      </div>

      {/* Map Background */}
      <div className="absolute inset-0 z-0 bg-slate-100">
        <div ref={mapRef} className="absolute inset-0"></div>
        <div className="absolute inset-0 bg-slate-950/40 pointer-events-none"></div>

        {/* Simulated Tracking Car */}
        {(step === 'accepted' || step === 'on_way') && (
          <div 
            className="absolute z-10 transition-all duration-[2000ms] ease-linear"
            style={{ top: carPos.top, left: carPos.left }}
          >
            <div className="bg-white p-2 rounded-full shadow-lg border-2 border-brand-500">
              {getVehicleIcon('suv', "w-6 h-6 text-brand-600")}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-6 relative z-10 pointer-events-none">
        {step === 'search' && (
          <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl p-5 border border-slate-800 shadow-lg space-y-4 mt-4 pointer-events-auto">
            <div className="relative pl-8 mb-2">
              <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-slate-700"></div>
              <div className="mb-4 relative">
                <div className="absolute -left-8 top-3 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-900"></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pickup City</p>
                <input 
                  ref={pickupInputRef}
                  type="text" 
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-brand-500 outline-none font-bold text-sm"
                />
              </div>
              <div className="relative">
                <div className="absolute -left-8 top-3 w-2 h-2 rounded-sm bg-brand-500 ring-4 ring-brand-900"></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Drop City</p>
                <input 
                  ref={autocompleteInputRef}
                  type="text" 
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-brand-500 outline-none font-bold text-sm"
                  placeholder="Where to?"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Calendar className="w-3 h-3" /> Date</p>
                <input 
                  type="text" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent border-none outline-none font-bold text-white text-sm mt-1"
                />
              </div>
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Users className="w-3 h-3" /> Passengers</p>
                <div className="flex items-center justify-between mt-1">
                  <button onClick={() => setPassengers(Math.max(1, passengers - 1))} className="w-6 h-6 bg-slate-800 rounded-md flex items-center justify-center font-bold text-slate-300">-</button>
                  <span className="font-bold text-white text-sm">{passengers}</span>
                  <button onClick={() => setPassengers(passengers + 1)} className="w-6 h-6 bg-slate-800 rounded-md flex items-center justify-center font-bold text-slate-300">+</button>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Briefcase className="w-3 h-3" /> Luggage Bags</p>
              <div className="flex items-center justify-between mt-1">
                <button onClick={() => setLuggage(Math.max(0, luggage - 1))} className="w-6 h-6 bg-slate-800 rounded-md flex items-center justify-center font-bold text-slate-300">-</button>
                <span className="font-bold text-white text-sm">{luggage}</span>
                <button onClick={() => setLuggage(luggage + 1)} className="w-6 h-6 bg-slate-800 rounded-md flex items-center justify-center font-bold text-slate-300">+</button>
              </div>
            </div>

            <button 
              onClick={handleSearch}
              disabled={isSearching || !toCity}
              className="w-full py-4 mt-2 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-base shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              {isSearching ? 'Finding Cabs...' : 'Search Cabs'}
            </button>
          </div>
        )}

        {/* Step 1.5: Verify Pickup */}
        {step === 'verify_pickup' && (
          <div className="bg-slate-900 rounded-3xl shadow-lg pointer-events-auto p-6 border border-slate-800 mt-auto absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-500/20 p-2 rounded-full">
                <MapPin className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pickup Location</p>
                <p className="font-bold text-white text-sm truncate max-w-[280px]">{fromCity}</p>
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

        {step === 'results' && (
          <div className="space-y-4 animate-[fadeIn_0.2s_ease-out] pointer-events-auto">
            <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 border border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm">{fromCity.split(',')[0]} to {toCity.split(',')[0]}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{date} • {passengers} Pax • {luggage} Bags • ~{distance} km</p>
              </div>
              <button onClick={() => setStep('search')} className="text-brand-400 text-xs font-bold bg-brand-500/10 px-3 py-1.5 rounded-lg border border-brand-500/20">Modify</button>
            </div>

            {/* Flight Recommendation if distance is long */}
            {flightAlternative && (
              <div className="bg-gradient-to-r from-sky-900 to-blue-900 rounded-3xl p-1 border border-sky-700 shadow-md">
                <div className="bg-slate-900 rounded-[1.3rem] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Plane className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Faster Alternative</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700">
                      <Plane className="w-8 h-8 text-slate-300" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white">Flight to {toCity.split(',')[0]}</h4>
                      <p className="text-xs text-slate-400">{flightAlternative.airline} • {flightAlternative.duration}</p>
                      <p className="font-extrabold text-sky-400 mt-1">₹{flightAlternative.price} total</p>
                    </div>
                    <button className="bg-sky-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm">View</button>
                  </div>
                </div>
              </div>
            )}

            {/* AI Recommendation */}
            <div className="bg-gradient-to-r from-indigo-900 to-brand-900 rounded-3xl p-1 border border-indigo-700 shadow-md">
              <div className="bg-slate-900 rounded-[1.3rem] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">AI Recommended for {passengers} Pax & {luggage} Bags</span>
                </div>
                <div className="flex gap-4 items-center">
                  <img src={recommendedVehicle.imageUrl} alt={recommendedVehicle.name} className="w-24 h-16 object-cover rounded-xl border border-slate-700" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-white">{recommendedVehicle.name}</h4>
                      <ProviderBadge provider={recommendedVehicle.provider} />
                    </div>
                    <p className="text-xs text-slate-400">{recommendedVehicle.type}</p>
                    <p className="font-extrabold text-brand-400 mt-1">₹{recommendedVehicle.baseFare + (recommendedVehicle.pricePerKm * distance)}</p>
                  </div>
                  <button onClick={() => handleBook(recommendedVehicle)} className="bg-brand-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm">Book</button>
                </div>
              </div>
            </div>

            <h3 className="font-bold text-white text-lg pt-2 drop-shadow-sm">Other Options</h3>
            <div className="space-y-3">
              {VEHICLES.filter(v => v.id !== recommendedVehicle.id).map(vehicle => (
                <div key={vehicle.id} className="bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 border border-slate-800 shadow-sm flex gap-4 items-center">
                  <img src={vehicle.imageUrl} alt={vehicle.name} className="w-20 h-14 object-cover rounded-xl border border-slate-700" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-white text-sm">{vehicle.name}</h4>
                      <ProviderBadge provider={vehicle.provider} />
                    </div>
                    <p className="text-[10px] text-slate-400">{vehicle.type} • Up to {vehicle.capacity} seats</p>
                    <p className="font-extrabold text-slate-200 mt-1">₹{vehicle.baseFare + (vehicle.pricePerKm * distance)}</p>
                  </div>
                  <button onClick={() => handleBook(vehicle)} className="bg-slate-800 text-slate-300 px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-700">Book</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {step === 'booking' && selectedVehicle && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-auto">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setStep('results')}></div>
          <div className="bg-slate-900 rounded-t-[2.5rem] p-6 relative z-10 border-t border-slate-800 max-h-[92vh] w-full overflow-y-auto hide-scrollbar animate-[slideUp_0.3s_ease-out] text-slate-100 pb-12">
            <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-4 cursor-grab"></div>
            <button 
              onClick={() => setStep('results')}
              className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-extrabold text-white">Confirm Booking</h2>
              <p className="text-sm text-slate-400 font-medium mt-1">Review your intercity ride details</p>
            </div>

            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-4 mb-6">
              <div className="flex items-center gap-4">
                <img src={selectedVehicle.imageUrl} alt={selectedVehicle.name} className="w-20 h-14 object-cover rounded-xl border border-slate-700" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-white">{selectedVehicle.name}</h4>
                    <ProviderBadge provider={selectedVehicle.provider} />
                  </div>
                  <p className="text-xs text-slate-400">{selectedVehicle.type}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-800/60 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Route</span>
                <span className="font-bold text-slate-200">{fromCity.split(',')[0]} → {toCity.split(',')[0]}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Distance</span>
                <span className="font-bold text-slate-200">~{distance} km</span>
              </div>
              <div className="pt-3 border-t border-slate-800/60 flex justify-between items-center">
                <span className="font-bold text-white">Total Fare</span>
                <span className="font-black text-xl text-brand-400">₹{selectedVehicle.baseFare + (selectedVehicle.pricePerKm * distance)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Method</h3>
                <button onClick={() => setShowPaymentSelector(true)} className="text-brand-400 text-xs font-bold">Change</button>
              </div>
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-slate-400" />
                <span className="font-bold text-white text-sm capitalize">{selectedPayment.replace('-', ' ')}</span>
              </div>
            </div>

            <button 
              onClick={handleConfirmBooking}
              className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-lg shadow-md transition-colors"
            >
              Confirm & Pay
            </button>
            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-4">
              <ShieldCheck className="w-4 h-4" /> Secured by Chalo Pay
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Selector Sub-modal */}
      {showPaymentSelector && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-auto">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowPaymentSelector(false)}></div>
          <div className="bg-slate-900 rounded-t-[2rem] p-6 relative z-10 border-t border-slate-800 max-h-[90vh] w-full overflow-y-auto hide-scrollbar animate-[slideUp_0.3s_ease-out] text-slate-100 pb-12">
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

      {/* Step 3: Confirming / Finding Driver */}
      {step === 'confirming' && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-auto">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>
          <div className="bg-slate-900 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] p-8 flex flex-col items-center justify-center h-[40vh] border-t border-slate-800 relative z-10">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                {selectedVehicle && getVehicleIcon('suv', "w-8 h-8 text-brand-400")}
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Connecting to {selectedVehicle?.provider.replace('_', ' ')}...</h2>
            <p className="text-slate-400 text-center text-sm">Finding the nearest driver for your {selectedVehicle?.name}.</p>
          </div>
        </div>
      )}

      {/* Step 4: Driver Accepted & On Way */}
      {(step === 'accepted' || step === 'on_way') && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-auto">
          <div className="bg-slate-900 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] p-6 border-t border-slate-800 relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-white">Arriving in 15 mins</h2>
                </div>
                <p className="text-slate-400 flex items-center gap-2 text-sm">
                  Your <ProviderBadge provider={selectedVehicle?.provider || 'chalo'} /> is on the way
                </p>
              </div>
              <div className="bg-brand-500/10 text-brand-400 px-3 py-1 rounded-lg font-bold text-xl border border-brand-500/20">
                OTP: 8821
              </div>
            </div>

            <div className="flex items-center p-4 bg-slate-950 rounded-2xl mb-6 border border-slate-800">
              <div className="w-12 h-12 bg-slate-800 rounded-full overflow-hidden mr-4">
                <img src="https://picsum.photos/100/100?random=2" alt="Driver" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white">Suresh Patil</h3>
                <div className="flex items-center text-sm text-slate-400">
                  <span className="font-medium">4.9</span>
                  <span className="text-yellow-400 ml-1">★</span>
                  <span className="mx-2">•</span>
                  <span className="font-mono bg-slate-800 px-1.5 rounded text-xs text-slate-200">KA 05 XY 9876</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center shadow-sm border border-slate-700 text-brand-400">
                  <ShieldCheck className="w-5 h-5" />
                </button>
              </div>
            </div>

            <button onClick={() => { setStep('search'); onBack(); }} className="w-full py-4 bg-red-500/10 text-red-400 rounded-xl font-bold active:bg-red-500/20 transition-colors border border-red-500/20">
              Cancel Ride
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
