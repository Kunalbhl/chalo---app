import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Calendar, Users, MapPin, Star, Filter, Wifi, Coffee, Waves, X, Flame, History, ChevronRight, Loader2, CheckCircle2, ShieldCheck, CreditCard, Smartphone, Wallet, UserPlus, UserCheck } from 'lucide-react';
import { STAYS } from '../constants';
import { ProviderBadge } from '../components/ProviderBadge';
import { StayType, Stay, ActivityItem, Guest } from '../types';
import { ChaloLogo } from '../components/Icons';
import { RazorpayCheckout } from '../components/RazorpayCheckout';

interface StaysViewProps {
  onBack: () => void;
  onAddActivity: (newActivity: ActivityItem) => void;
  savedGuests: Guest[];
  onAddGuest: (guest: Guest) => void;
}

const POPULAR_STAY_SEARCHES = [
  { query: 'Goa', desc: 'Beach villas & resorts' },
  { query: 'Mumbai', desc: 'Luxury business hotels' },
  { query: 'Rishikesh', desc: 'Backpacker hostels' },
  { query: 'Coorg', desc: 'Nature resorts & homestays' }
];

const RECENT_STAY_SEARCHES = [
  { query: 'Taj Mahal Palace' },
  { query: 'Zostel Rishikesh' }
];

export const StaysView: React.FC<StaysViewProps> = ({ onBack, onAddActivity, savedGuests, onAddGuest }) => {
  const [activeType, setActiveType] = useState<StayType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Booking Flow States
  const [selectedStay, setSelectedStay] = useState<Stay | null>(null);
  const [bookingStep, setBookingStep] = useState<'details' | 'payment' | 'success'>('details');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showRazorpay, setShowRazorpay] = useState(false);
  
  // Guest Details
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [saveGuestDetails, setSaveGuestDetails] = useState(true);
  const [showSavedGuests, setShowSavedGuests] = useState(false);
  
  // Payment
  const [selectedPayment, setSelectedPayment] = useState('upi');

  // Filter stays based on search query and active category
  const filteredStays = useMemo(() => {
    let result = STAYS;
    if (activeType !== 'all') {
      result = result.filter(stay => stay.type === activeType);
    }
    if (searchQuery.trim()) {
      result = result.filter(stay => 
        stay.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stay.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [activeType, searchQuery]);

  const categories: { id: StayType | 'all', label: string }[] = [
    { id: 'all', label: 'All Stays' },
    { id: 'hotel', label: 'Hotels' },
    { id: 'villa', label: 'Villas' },
    { id: 'hostel', label: 'Hostels' },
    { id: 'apartment', label: 'Apartments' },
    { id: 'resort', label: 'Resorts' },
  ];

  const handleBookStay = (stay: Stay) => {
    setSelectedStay(stay);
    setBookingStep('details');
  };

  const handleSelectSavedGuest = (guest: Guest) => {
    setGuestName(guest.name);
    setGuestPhone(guest.phone);
    setGuestEmail(guest.email);
    setShowSavedGuests(false);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (saveGuestDetails && guestName && guestPhone && guestEmail) {
      // Check if already exists
      const exists = savedGuests.some(g => g.email === guestEmail || g.phone === guestPhone);
      if (!exists) {
        onAddGuest({
          id: `g-${Date.now()}`,
          name: guestName,
          phone: guestPhone,
          email: guestEmail
        });
      }
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
        provider: selectedStay?.provider || 'chalo',
        type: 'stays',
        title: selectedStay?.name || 'Stay Booking',
        date: 'Just Now',
        status: 'completed',
        price: selectedStay?.price || 0
      });
    }, 2000);
  };

  const closeBookingModal = () => {
    if (isProcessing) return;
    setSelectedStay(null);
    setBookingStep('details');
    setBookingSuccess(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-800 relative">
      {showRazorpay && selectedStay && (
        <RazorpayCheckout 
          amount={selectedStay.price} 
          onSuccess={processBooking} 
          onCancel={() => setShowRazorpay(false)} 
        />
      )}

      {/* Premium Dark Header with Light Grey Search Bar */}
      <div className="bg-slate-950 pt-12 pb-4 px-4 shadow-sm sticky top-0 z-20 border-b border-slate-900 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-800 active:bg-slate-700 transition-colors">
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <button onClick={onBack} className="active:scale-95 transition-transform hover:scale-105 duration-200">
              <ChaloLogo className="w-8 h-8" />
            </button>
            <h1 className="font-bold text-xl text-white">Book Stays</h1>
          </div>
          <button className="p-2 bg-slate-800/60 rounded-full border border-slate-700 text-slate-300">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Light Grey Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            value={searchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Where are you going?" 
            className="w-full bg-slate-100 border-none rounded-2xl py-3.5 pl-11 pr-10 text-[15px] font-semibold text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none"
          />
          {(searchQuery || isSearchFocused) && (
            <button 
              onClick={() => { setSearchQuery(''); setIsSearchFocused(false); }} 
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* Search Suggestions Overlay */}
      {!searchQuery.trim() && isSearchFocused && (
        <div className="absolute inset-x-0 top-[180px] bottom-0 bg-white z-30 px-6 pt-6 overflow-y-auto animate-[fadeIn_0.2s_ease-out]">
          <div className="space-y-6 pb-24">
            {/* Recent Searches */}
            <div>
              <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <History className="w-3.5 h-3.5" /> Recent Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {RECENT_STAY_SEARCHES.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSearchQuery(item.query)}
                    className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 transition-all hover:scale-105 active:scale-95"
                  >
                    <span>{item.query}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Searches */}
            <div>
              <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <Flame className="w-3.5 h-3.5 text-orange-500" /> Popular Destinations
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {POPULAR_STAY_SEARCHES.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSearchQuery(item.query)}
                    className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-98"
                  >
                    <div>
                      <p className="font-bold text-slate-800 text-xs">{item.query}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {/* Quick Filters */}
        <div className="bg-slate-50 py-3 px-4 border-b border-slate-100">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {categories.map((cat) => {
              const isActive = activeType === cat.id;
              return (
                <button 
                  key={cat.id}
                  onClick={() => setActiveType(cat.id as any)}
                  className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 hover:scale-105 ${
                    isActive 
                      ? 'bg-brand-600 text-white shadow-md' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Date & Guest Summary */}
        <div className="px-4 py-4">
          <div className="bg-slate-50 rounded-2xl shadow-soft border border-slate-100 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-brand-500/10 p-2 rounded-lg text-brand-400 border border-brand-500/20">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Dates</p>
                <p className="font-semibold text-slate-800 text-sm">Oct 12 - Oct 15</p>
              </div>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="bg-brand-500/10 p-2 rounded-lg text-brand-400 border border-brand-500/20">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Guests</p>
                <p className="font-semibold text-slate-800 text-sm">2 Adults, 1 Room</p>
              </div>
            </div>
          </div>
        </div>

        {/* Aggregated Stays List */}
        <div className="px-4 pb-24 space-y-5">
          <h2 className="font-bold text-lg text-slate-900">Top Picks for You</h2>
          
          {filteredStays.map((stay) => (
            <div key={stay.id} className="bg-white rounded-3xl overflow-hidden shadow-soft border border-slate-100 flex flex-col hover:scale-[1.02] hover:shadow-lg transition-all duration-300">
              <div className="relative h-48">
                <img src={stay.imageUrl} alt={stay.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-slate-950/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl flex items-center text-xs font-bold text-white shadow-sm">
                  <Star className="w-3.5 h-3.5 mr-1 text-amber-500 fill-amber-500" /> {stay.rating}
                </div>
                <div className="absolute top-3 left-3">
                  <ProviderBadge provider={stay.provider} className="shadow-md text-xs px-2.5 py-1 rounded-lg" />
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {stay.type}
                      </span>
                    </div>
                    <h3 className="font-bold text-xl text-slate-900 leading-tight">{stay.name}</h3>
                    <p className="text-sm text-slate-500 flex items-center mt-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 mr-1" /> {stay.location}
                    </p>
                  </div>
                </div>
                
                {/* Amenities */}
                <div className="flex gap-2 mt-3">
                  {stay.amenities.map((amenity, idx) => (
                    <span key={idx} className="text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-800 px-2 py-1 rounded-lg flex items-center">
                      {amenity === 'Wifi' || amenity === 'Free Wifi' ? <Wifi className="w-3 h-3 mr-1" /> : 
                       amenity === 'Private Pool' || amenity === 'Sea View' ? <Waves className="w-3 h-3 mr-1" /> :
                       <Coffee className="w-3 h-3 mr-1" />}
                      {amenity}
                    </span>
                  ))}
                </div>
                
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-0.5">Total for 3 nights</p>
                    <p className="text-xs text-slate-400 line-through font-medium">₹{stay.originalPrice}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-2xl text-brand-600">₹{stay.price}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleBookStay(stay)}
                  className="w-full mt-4 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl active:bg-brand-700 transition-colors shadow-md hover:scale-105"
                >
                  Book
                </button>
              </div>
            </div>
          ))}

          {filteredStays.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 font-medium">No stays found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Multi-step Booking Modal */}
      {selectedStay && (
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
                  <h2 className="text-2xl font-extrabold text-slate-900">Stay Details</h2>
                  <p className="text-sm text-slate-500 font-medium mt-1">Review selection and provide guest info</p>
                </div>

                <div className="flex gap-4 items-center">
                  <img src={selectedStay.imageUrl} alt={selectedStay.name} className="w-24 h-24 object-cover rounded-2xl border border-slate-200" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-lg text-slate-900">{selectedStay.name}</h3>
                      <ProviderBadge provider={selectedStay.provider} />
                    </div>
                    <p className="text-xs text-slate-600 flex items-center"><MapPin className="w-3 h-3 mr-1" /> {selectedStay.location}</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dates</span>
                    <span className="font-bold text-slate-800">Oct 12 - Oct 15 (3 Nights)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Guests</span>
                    <span className="font-bold text-slate-800">2 Adults, 1 Room</span>
                  </div>
                </div>

                <form onSubmit={handleProceedToPayment} className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Guest Details</h3>
                    {savedGuests.length > 0 && (
                      <button 
                        type="button"
                        onClick={() => setShowSavedGuests(!showSavedGuests)}
                        className="text-brand-600 text-xs font-bold flex items-center gap-1"
                      >
                        <UserCheck className="w-3.5 h-3.5" /> Saved Guests
                      </button>
                    )}
                  </div>

                  {showSavedGuests && savedGuests.length > 0 && (
                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 space-y-2 mb-4 animate-[fadeIn_0.2s_ease-out]">
                      {savedGuests.map(guest => (
                        <div 
                          key={guest.id} 
                          onClick={() => handleSelectSavedGuest(guest)}
                          className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100 cursor-pointer hover:border-brand-300 active:bg-slate-50 transition-colors"
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
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Enter full name as per ID" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mobile Number</label>
                    <input 
                      type="tel" 
                      required
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="Enter mobile number" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="Enter email address" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                    />
                  </div>
                  
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
                  <button onClick={() => setBookingStep('details')} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <h2 className="text-2xl font-extrabold text-slate-900">Payment</h2>
                </div>

                {/* Price Breakdown */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                  <div className="flex justify-between text-sm font-semibold text-slate-500">
                    <span>Base Price (3 Nights)</span>
                    <span>₹{selectedStay.price - 1500}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-slate-500">
                    <span>Taxes & Fees</span>
                    <span>₹1500</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200/60">
                    <span>Total Amount</span>
                    <span className="text-brand-600">₹{selectedStay.price}</span>
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
                    Pay ₹{selectedStay.price}
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
                  Your stay has been successfully booked via <span className="font-bold text-slate-800 capitalize">{selectedStay.provider}</span>.
                </p>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 w-full my-6 text-left space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <span>Stay</span>
                    <span>Booking ID</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-800">
                    <span>{selectedStay.name}</span>
                    <span className="font-mono">CH{Math.floor(Math.random() * 900000 + 100000)}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-slate-200">
                    <p className="text-xs text-slate-500">Confirmation sent to: <span className="font-bold text-slate-700">{guestEmail}</span></p>
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
