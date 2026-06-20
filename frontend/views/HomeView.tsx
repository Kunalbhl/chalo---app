import React, { useState, useEffect, useMemo } from 'react';
import { Search, Car, Utensils, ShoppingCart, BedDouble, Bike, Map, Shield, ChevronRight, Wallet, Gift, Plane, Share2, Check, Info, X, Award, HelpCircle, Sparkles, Star, ArrowRight, ShoppingBag, Plus, ArrowUpRight, ArrowDownLeft, Smartphone, Navigation, Loader2, Coins, CreditCard, MapPin, Clock, Flame, History } from 'lucide-react';
import { AutoIcon, ChaloLogo, ChaloDownloadQRCode, PremiumRideIcon, PremiumFoodIcon, PremiumMartIcon, PremiumStaysIcon, AutoIcon as AutoIconPremium, PremiumMotoIcon, PremiumFlightIcon, PremiumIntercityIcon, PremiumInsuranceIcon, PremiumGiftsIcon, PremiumPayBillsIcon, PremiumMoreIcon } from '../components/Icons';
import { ViewState, AnyProvider, RewardTransaction, SavedAddress } from '../types';
import { ProviderBadge } from '../components/ProviderBadge';

interface HomeViewProps {
  onChangeView: (view: ViewState) => void;
  walletBalance: number;
  rewardPoints: number;
  onAddRewards: (points: number, description?: string) => void;
  onAddWalletMoney: (amount: number) => void;
  profileName: string;
  rewardTransactions: RewardTransaction[];
  currentLocation: string;
  onUpdateLocation: (loc: string) => void;
  onAddSavedAddress: (addr: SavedAddress) => void;
}

interface SearchableItem {
  id: string;
  category: 'Rides' | 'Food & Dining' | 'Groceries & Mart' | 'Stays & Hotels';
  title: string;
  subtitle: string;
  price: string;
  provider: AnyProvider;
  imageUrl: string;
  meta: string;
}

const SEARCH_DATABASE: SearchableItem[] = [
  // Rides
  { id: 's-r1', category: 'Rides', title: 'Chalo Auto', subtitle: 'Quick, affordable auto rickshaw ride', price: '₹85', provider: 'chalo', imageUrl: 'https://images.unsplash.com/photo-1566008889998-f5c43b7e5b4b?auto=format&fit=crop&w=120&q=80', meta: '3 mins away' },
  { id: 's-r2', category: 'Rides', title: 'Uber Go', subtitle: 'Affordable compact hatchback cabs', price: '₹175', provider: 'uber', imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=120&q=80', meta: '4 mins away' },
  { id: 's-r3', category: 'Rides', title: 'Rapido Bike', subtitle: 'Fastest way to beat city traffic', price: '₹45', provider: 'rapido', imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=120&q=80', meta: '1 min away' },
  { id: 's-r4', category: 'Rides', title: 'Ola Prime Sedan', subtitle: 'Spacious, top-rated sedan cars', price: '₹230', provider: 'ola', imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=120&q=80', meta: '5 mins away' },
  
  // Food
  { id: 's-f1', category: 'Food & Dining', title: 'Meghana Foods Biryani', subtitle: 'Spicy Andhra Style Chicken Biryani', price: '₹320', provider: 'zomato', imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=120&q=80', meta: '4.5 ★ • 30 mins' },
  { id: 's-f2', category: 'Food & Dining', title: 'Truffles Classic Burger', subtitle: 'Juicy chicken patty with cheese & fries', price: '₹250', provider: 'swiggy', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=120&q=80', meta: '4.7 ★ • 25 mins' },
  { id: 's-f3', category: 'Food & Dining', title: 'Empire Butter Chicken', subtitle: 'Rich, creamy North Indian curry', price: '₹280', provider: 'chalo', imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=120&q=80', meta: '4.3 ★ • 40 mins' },
  
  // Mart
  { id: 's-m1', category: 'Groceries & Mart', title: 'Fresh Red Onions', subtitle: 'Farm fresh organic onions (1 kg)', price: '₹42', provider: 'blinkit', imageUrl: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=120&q=80', meta: '14 mins delivery' },
  { id: 's-m2', category: 'Groceries & Mart', title: 'Amul Taaza Fresh Milk', subtitle: 'Pasteurized homogenized milk (500 ml)', price: '₹27', provider: 'zepto', imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=120&q=80', meta: '10 mins delivery' },
  { id: 's-m3', category: 'Groceries & Mart', title: 'Organic Cavendish Bananas', subtitle: 'Fresh robust yellow bananas (1 dozen)', price: '₹60', provider: 'instamart', imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=120&q=80', meta: '12 mins delivery' },
  
  // Stays
  { id: 's-s1', category: 'Stays & Hotels', title: 'Luxury Pool Villa', subtitle: 'Private pool villa in Vagator, Goa', price: '₹15,000/night', provider: 'airbnb', imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=120&q=80', meta: '4.9 ★ • Wifi' },
  { id: 's-s2', category: 'Stays & Hotels', title: 'The Taj Mahal Palace', subtitle: 'Iconic luxury hotel in Colaba, Mumbai', price: '₹12,500/night', provider: 'makemytrip', imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=120&q=80', meta: '4.9 ★ • Sea View' },
  { id: 's-s3', category: 'Stays & Hotels', title: 'Zostel Backpacker Hostel', subtitle: 'Vibrant social hostel in Rishikesh', price: '₹800/night', provider: 'bookingcom', imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=120&q=80', meta: '4.5 ★ • Cafe' },
];

const POPULAR_SEARCHES = [
  { query: 'Biryani', category: 'Food & Dining' },
  { query: 'Chalo Auto', category: 'Rides' },
  { query: 'Luxury Pool Villa', category: 'Stays & Hotels' },
  { query: 'Amul Milk', category: 'Groceries & Mart' }
];

const RECENT_SEARCHES = [
  { query: 'Uber Go', category: 'Rides' },
  { query: 'Truffles Burger', category: 'Food & Dining' }
];

// Mock Pincode to City/State mapping
const PINCODE_MAP: Record<string, { city: string, state: string }> = {
  '560038': { city: 'Bengaluru', state: 'Karnataka' },
  '560103': { city: 'Bengaluru', state: 'Karnataka' },
  '400050': { city: 'Mumbai', state: 'Maharashtra' },
  '110001': { city: 'New Delhi', state: 'Delhi' },
};

export const HomeView: React.FC<HomeViewProps> = ({ onChangeView, walletBalance, rewardPoints, onAddRewards, onAddWalletMoney, profileName, rewardTransactions, currentLocation, onUpdateLocation, onAddSavedAddress }) => {
  const [activeGlow, setActiveGlow] = useState<'none' | 'ride' | 'food' | 'mart' | 'stays'>('none');
  const [copied, setCopied] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [showRewardsHistoryModal, setShowRewardsHistoryModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showSaveAddressModal, setShowSaveAddressModal] = useState(false);
  const [greeting, setGreeting] = useState('Good Morning');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [addAmount, setAddAmount] = useState('500');
  const [addMoneyTab, setAddMoneyTab] = useState<'pay' | 'convert'>('pay');
  const [pointsToConvert, setPointsToConvert] = useState<number>(100);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');

  // Save Address Form States
  const [addressLabel, setAddressLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [customAddressName, setCustomName] = useState('');
  const [flatNo, setFlatNo] = useState('');
  const [area, setArea] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [isPrimaryAddress, setIsPrimaryAddress] = useState(false);
  const [isPreferredAddress, setIsPreferredAddress] = useState(true);

  // Dynamic Greeting based on Indian Standard Time
  useEffect(() => {
    const hrs = new Date().getHours();
    if (hrs < 12) setGreeting('Good Morning ☀️');
    else if (hrs >= 12 && hrs < 17) setGreeting('Good Afternoon 🌤️');
    else setGreeting('Good Evening 🌙');
  }, []);

  // Auto-generate referral code from profile name
  const referralCode = `${profileName.split(' ')[0].toUpperCase()}1000`;

  const handleCopyReferral = () => {
    setCopied(true);
    navigator.clipboard.writeText(referralCode);
    onAddRewards(1000, `Referral: ${referralCode}`); // Instantly reward user with 1000 points for testing referral
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFetchLocation = () => {
    setIsFetchingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          let detectedAddress = "Indiranagar, Bengaluru, Karnataka";
          let detectedPincode = "560038";
          if (latitude > 18 && latitude < 20 && longitude > 72 && longitude < 74) {
            detectedAddress = "Bandra West, Mumbai, Maharashtra";
            detectedPincode = "400050";
          } else if (latitude > 28 && latitude < 29 && longitude > 76 && longitude < 78) {
            detectedAddress = "Connaught Place, New Delhi";
            detectedPincode = "110001";
          }
          onUpdateLocation(detectedAddress);
          setArea(detectedAddress.split(',')[0]);
          setPincode(detectedPincode);
          handlePincodeChange(detectedPincode);
          setIsFetchingLocation(false);
          setShowLocationModal(false);
        },
        (error) => {
          console.error(error);
          const fallbacks = [
            { addr: "Indiranagar, Bengaluru, Karnataka", pin: "560038" },
            { addr: "Connaught Place, New Delhi", pin: "110001" },
            { addr: "Bandra West, Mumbai, Maharashtra", pin: "400050" }
          ];
          const randomLoc = fallbacks[Math.floor(Math.random() * fallbacks.length)];
          onUpdateLocation(randomLoc.addr);
          setArea(randomLoc.addr.split(',')[0]);
          setPincode(randomLoc.pin);
          handlePincodeChange(randomLoc.pin);
          setIsFetchingLocation(false);
          setShowLocationModal(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setIsFetchingLocation(false);
    }
  };

  const handlePincodeChange = (val: string) => {
    setPincode(val);
    if (val.length === 6) {
      const mapped = PINCODE_MAP[val];
      if (mapped) {
        setCity(mapped.city);
        setState(mapped.state);
      } else {
        // Mock fallback
        setCity('Bengaluru');
        setState('Karnataka');
      }
    } else {
      setCity('');
      setState('');
    }
  };

  const handleSaveAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullAddress = `${flatNo}, ${area}, ${city}, ${state} ${pincode}`;
    const newAddr: SavedAddress = {
      id: `addr-${Date.now()}`,
      label: addressLabel,
      customName: addressLabel === 'Other' ? customAddressName : undefined,
      flatNo,
      area,
      city,
      state,
      pincode,
      fullAddress,
      address: fullAddress, // For backward compatibility in UI
      isPrimary: isPrimaryAddress,
      isPreferred: isPreferredAddress,
      lat: 12.9716,
      lng: 77.5946
    };
    onAddSavedAddress(newAddr);
    setShowSaveAddressModal(false);
    setShowLocationModal(false);
    onUpdateLocation(fullAddress);
    setCustomName('');
    setFlatNo('');
    setArea('');
    setPincode('');
    setCity('');
    setState('');
    setIsPrimaryAddress(false);
    alert(`Successfully saved "${addressLabel === 'Other' ? customAddressName : addressLabel}" to Saved Places!`);
  };

  const handleAddMoneySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(addAmount);
    if (amt > 0) {
      onAddWalletMoney(amt);
      setShowAddMoneyModal(false);
      alert(`Successfully added ₹${amt} to your Chalo Pay Wallet!`);
    }
  };

  const handleConvertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rewardPoints >= pointsToConvert && pointsToConvert > 0) {
      const cashAmount = pointsToConvert / 20;
      onAddRewards(-pointsToConvert, 'Converted to Wallet Cash');
      onAddWalletMoney(cashAmount);
      setShowAddMoneyModal(false);
      alert(`Successfully converted ${pointsToConvert} points to ₹${cashAmount} Wallet Cash!`);
    } else {
      alert('Insufficient reward points.');
    }
  };

  // Filtered search results grouped by category
  const groupedSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return {};
    const filtered = SEARCH_DATABASE.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groups: Record<string, SearchableItem[]> = {};
    filtered.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [searchQuery]);

  const hasResults = Object.keys(groupedSearchResults).length > 0;

  // Dynamic header glow based on hovered/selected service
  const getGlowClass = () => {
    switch (activeGlow) {
      case 'ride': return 'from-blue-500/20 via-slate-950 to-slate-950 shadow-[0_20px_50px_rgba(59,130,246,0.15)]';
      case 'food': return 'from-orange-500/20 via-slate-950 to-slate-950 shadow-[0_20px_50px_rgba(249,115,22,0.15)]';
      case 'mart': return 'from-emerald-500/20 via-slate-950 to-slate-950 shadow-[0_20px_50px_rgba(16,185,129,0.15)]';
      case 'stays': return 'from-rose-500/20 via-slate-950 to-slate-950 shadow-[0_20px_50px_rgba(244,63,94,0.15)]';
      default: return 'from-indigo-500/10 via-slate-950 to-slate-950';
    }
  };

  const handleResultClick = (category: string) => {
    setSearchQuery(''); // Clear search
    setIsSearchFocused(false);
    if (category === 'Rides') onChangeView('booking');
    else if (category === 'Food & Dining') onChangeView('food');
    else if (category === 'Groceries & Mart') onChangeView('mart');
    else if (category === 'Stays & Hotels') onChangeView('stays');
  };

  return (
    <div className="pb-28 bg-white min-h-screen font-sans text-slate-800 transition-all duration-500">
      {/* Premium Black Header Area with Reactive Glow - Optimized Space */}
      <div className={`bg-gradient-to-b ${getGlowClass()} bg-slate-950 px-6 pt-10 pb-14 relative z-10 rounded-b-[2.5rem] transition-all duration-500 border-b border-slate-900`}>
        
        {/* Top Bar with Clickable App Logo */}
        <div className="flex justify-between items-center mb-5">
          <button 
            onClick={() => onChangeView('home')}
            className="flex items-center gap-3 text-left active:scale-95 transition-transform duration-200 hover:scale-105"
          >
            <ChaloLogo className="w-11 h-11" />
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-black tracking-tight text-white">Chalo</h1>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
              </div>
              <p className="text-[8px] text-indigo-300 font-bold uppercase tracking-[0.1em] leading-none">India's Everyday Super App</p>
            </div>
          </button>
          
          <div className="flex items-center gap-3">
            {/* Referral Quick Badge */}
            <button 
              onClick={() => setShowReferralModal(true)}
              className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3.5 py-2 rounded-full text-amber-400 text-xs font-bold transition-all active:scale-95 shadow-lg shadow-amber-500/5 hover:scale-105"
            >
              <Gift className="w-3.5 h-3.5 animate-bounce" />
              <span>Refer & Earn</span>
            </button>
          </div>
        </div>

        {/* Location Fetcher & Clickable Greeting to Profile */}
        <div className="flex justify-between items-end mb-4 text-white gap-4">
          <button 
            onClick={() => onChangeView('account')}
            className="flex-1 min-w-0 text-left hover:opacity-80 transition-opacity group"
          >
            <p className="text-slate-400 text-xs font-medium">{greeting},</p>
            <h2 className="text-xl font-extrabold tracking-tight text-white mt-0.5 truncate flex items-center gap-1 group-hover:text-indigo-300 transition-colors">
              {profileName} <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-300 transition-colors" />
            </h2>
          </button>
          {/* Increased width for location button to show more address text */}
          <button 
            onClick={() => setShowLocationModal(true)}
            className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-xl text-xs font-bold text-indigo-400 hover:bg-slate-800 hover:scale-105 transition-all active:scale-95 shadow-sm max-w-[220px] flex-shrink-0"
          >
            <Navigation className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate font-semibold">{currentLocation}</span>
          </button>
        </div>

        {/* Search Bar - Light Grey Shade */}
        <div className="flex items-center gap-3 relative">
          <div className="flex-1 bg-slate-100/90 border border-slate-200/60 rounded-2xl p-3.5 flex items-center text-slate-800 shadow-sm focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
            <Search className="w-5 h-5 ml-1 mr-3 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rides, food, stays..." 
              className="bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 w-full text-[14px] font-semibold"
            />
            {(searchQuery || isSearchFocused) && (
              <button onClick={() => { setSearchQuery(''); setIsSearchFocused(false); }} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search Results & Suggestions Overlay */}
      {(searchQuery.trim() || isSearchFocused) && (
        <div className="absolute inset-x-0 top-[240px] bottom-0 bg-white z-30 px-6 pt-4 overflow-y-auto animate-[fadeIn_0.2s_ease-out]">
          
          {/* Default Suggestions when Search is Empty but Focused */}
          {!searchQuery.trim() && (
            <div className="space-y-6 pb-24">
              {/* Recent Searches */}
              <div>
                <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <History className="w-3.5 h-3.5" /> Recent Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {RECENT_SEARCHES.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSearchQuery(item.query)}
                      className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 transition-all hover:scale-105 active:scale-95"
                    >
                      <span>{item.query}</span>
                      <span className="text-[9px] text-slate-400 font-medium">({item.category})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Searches */}
              <div>
                <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <Flame className="w-3.5 h-3.5 text-orange-500" /> Popular Searches
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {POPULAR_SEARCHES.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSearchQuery(item.query)}
                      className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-98"
                    >
                      <div>
                        <p className="font-bold text-slate-800 text-xs">{item.query}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{item.category}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Active Search Results */}
          {searchQuery.trim() && (
            <div className="space-y-6 pb-24">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider">Search Results</h3>
                <button onClick={() => setSearchQuery('')} className="text-brand-600 text-xs font-bold">Clear Search</button>
              </div>

              {hasResults ? (
                Object.entries(groupedSearchResults).map(([category, items]) => (
                  <div key={category} className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1">{category}</h4>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div 
                          key={item.id} 
                          onClick={() => handleResultClick(item.category)}
                          className="flex items-center p-3 rounded-2xl border border-slate-100 hover:border-brand-500/30 hover:bg-slate-50/50 transition-all cursor-pointer active:scale-[0.99] hover:scale-[1.02]"
                        >
                          <img src={item.imageUrl} alt={item.title} className="w-14 h-14 rounded-xl object-cover mr-4 border border-slate-100 shadow-sm" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <ProviderBadge provider={item.provider} />
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm truncate">{item.title}</h4>
                            <p className="text-xs text-slate-500 truncate mt-0.5">{item.subtitle}</p>
                          </div>
                          <div className="text-right pl-3">
                            <p className="font-extrabold text-slate-900 text-sm">{item.price}</p>
                            <p className="text-[10px] font-semibold text-slate-400 mt-1 whitespace-nowrap">{item.meta}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-400 font-medium">No matches found for "{searchQuery}"</p>
                  <p className="text-xs text-slate-400 mt-1">Try searching for "Biryani", "Auto", "Villa", or "Onion"</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Wallet & Rewards Card (Overlapping Header) - Redesigned with Premium Midnight-Indigo Gradient */}
      <div className="px-6 -mt-10 relative z-20 mb-8">
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl shadow-float p-5 flex items-center justify-between border border-slate-800/80 backdrop-blur-md">
          {/* Clickable Chalo Pay Wallet */}
          <button 
            onClick={() => { setAddMoneyTab('pay'); setShowAddMoneyModal(true); }}
            className="flex items-center gap-3 flex-1 text-left hover:opacity-90 transition-opacity hover:scale-105 duration-300"
          >
            <div className="bg-indigo-500/10 p-3 rounded-2xl border border-indigo-500/20 shadow-sm">
              <Wallet className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                Chalo Pay <Plus className="w-3 h-3 text-brand-400" />
              </p>
              <p className="font-extrabold text-white text-xl">₹{walletBalance.toFixed(2)}</p>
            </div>
          </button>
          
          <div className="w-px h-12 bg-slate-800 mx-3"></div>
          
          {/* Clickable Rewards Section */}
          <button 
            onClick={() => setShowRewardsHistoryModal(true)}
            className="flex items-center gap-3 flex-1 justify-end text-right hover:opacity-90 transition-opacity hover:scale-105 duration-300"
          >
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-end gap-1">
                Rewards <ChevronRight className="w-3 h-3 text-amber-400" />
              </p>
              <p className="font-extrabold text-amber-400 text-xl">{rewardPoints} pts</p>
            </div>
            <div className="bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20 shadow-sm">
              <Gift className="w-6 h-6 text-amber-400" />
            </div>
          </button>
        </div>
      </div>

      {/* Primary Services Grid (The Big 4) - Updated with Premium Realistic Icons */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-4 gap-4">
          <PrimaryServiceCard 
            icon={<PremiumRideIcon className="w-10 h-10" />} 
            label="Ride" 
            color="bg-blue-50/80 text-blue-600 border-blue-100 hover:bg-blue-100/60 shadow-sm hover:scale-110" 
            onClick={() => onChangeView('booking')} 
            onMouseEnter={() => setActiveGlow('ride')}
            onMouseLeave={() => setActiveGlow('none')}
          />
          <PrimaryServiceCard 
            icon={<PremiumFoodIcon className="w-10 h-10" />} 
            label="Food" 
            color="bg-orange-50/80 text-orange-600 border-orange-100 hover:bg-orange-100/60 shadow-sm hover:scale-110" 
            onClick={() => onChangeView('food')} 
            onMouseEnter={() => setActiveGlow('food')}
            onMouseLeave={() => setActiveGlow('none')}
          />
          <PrimaryServiceCard 
            icon={<PremiumMartIcon className="w-10 h-10" />} 
            label="Mart" 
            color="bg-emerald-50/80 text-emerald-600 border-emerald-100 hover:bg-emerald-100/60 shadow-sm hover:scale-110" 
            onClick={() => onChangeView('mart')} 
            onMouseEnter={() => setActiveGlow('mart')}
            onMouseLeave={() => setActiveGlow('none')}
          />
          <PrimaryServiceCard 
            icon={<PremiumStaysIcon className="w-10 h-10" />} 
            label="Stays" 
            color="bg-rose-50/80 text-rose-600 border-rose-100 hover:bg-rose-100/60 shadow-sm hover:scale-110" 
            onClick={() => onChangeView('stays')} 
            onMouseEnter={() => setActiveGlow('stays')}
            onMouseLeave={() => setActiveGlow('none')}
          />
        </div>
      </div>

      {/* Secondary Services Grid - Updated with Premium Realistic Icons */}
      <div className="px-6 mb-8">
        <div className="bg-slate-50 rounded-[2rem] p-6 shadow-soft border border-slate-100 grid grid-cols-4 gap-y-6 gap-x-2">
          <SecondaryServiceCard icon={<AutoIcon className="w-8 h-8" />} label="Auto" onClick={() => onChangeView('booking')} />
          <SecondaryServiceCard icon={<PremiumMotoIcon className="w-8 h-8" />} label="Bike" onClick={() => onChangeView('booking')} />
          <SecondaryServiceCard icon={<PremiumFlightIcon className="w-8 h-8" />} label="Flights" onClick={() => onChangeView('flights')} />
          <SecondaryServiceCard icon={<PremiumIntercityIcon className="w-8 h-8" />} label="Intercity" onClick={() => onChangeView('intercity')} />
          <SecondaryServiceCard icon={<PremiumInsuranceIcon className="w-8 h-8" />} label="Insurance" onClick={() => onChangeView('insurance')} />
          <SecondaryServiceCard icon={<PremiumGiftsIcon className="w-8 h-8" />} label="Gifts" onClick={() => onChangeView('gifts')} />
          <SecondaryServiceCard icon={<PremiumPayBillsIcon className="w-8 h-8" />} label="Pay Bills" onClick={() => onChangeView('pay_bills')} />
          <SecondaryServiceCard icon={<PremiumMoreIcon className="w-8 h-8" />} label="More" onClick={() => onChangeView('more')} />
        </div>
      </div>

      {/* Premium Chalo Club VIP Banner */}
      <div className="px-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 rounded-[2rem] p-6 border border-indigo-500/20 relative overflow-hidden shadow-lg hover:scale-[1.02] transition-transform duration-300">
          <div className="relative z-10">
            <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-indigo-500/30 flex items-center gap-1 w-fit mb-3">
              <Star className="w-3 h-3 fill-indigo-300" /> Chalo Club VIP
            </span>
            <h3 className="font-extrabold text-xl text-white mb-1.5 leading-tight">Save up to ₹500/month</h3>
            <p className="text-xs text-slate-400 mb-5 font-medium leading-relaxed">
              Get free delivery on food, zero surge pricing on rides, and exclusive stay discounts.
            </p>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors shadow-md hover:scale-105">
              Join VIP for ₹99
            </button>
          </div>
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* Location Selection Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowLocationModal(false)}></div>
          <div className="bg-white rounded-t-[2.5rem] p-6 relative z-10 border-t border-slate-100 max-h-[92vh] w-full overflow-y-auto hide-scrollbar animate-[slideUp_0.3s_ease-out] text-slate-800 pb-8">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 cursor-grab"></div>
            <button 
              onClick={() => setShowLocationModal(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mt-2 mb-6">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 border border-indigo-100 shadow-sm">
                <MapPin className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Select Location</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Choose your delivery or pickup address</p>
            </div>

            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  value={locationSearchQuery}
                  onChange={(e) => setLocationSearchQuery(e.target.value)}
                  placeholder="Search area, street, or building..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-sm text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                />
              </div>

              {/* Current Location Button */}
              <button 
                onClick={handleFetchLocation}
                disabled={isFetchingLocation}
                className="w-full flex items-center gap-3 p-4 bg-brand-50 border border-brand-100 rounded-2xl hover:bg-brand-100 transition-colors text-left"
              >
                <div className="bg-white p-2 rounded-full shadow-sm">
                  {isFetchingLocation ? <Loader2 className="w-5 h-5 text-brand-600 animate-spin" /> : <Navigation className="w-5 h-5 text-brand-600" />}
                </div>
                <div>
                  <h4 className="font-bold text-brand-700 text-sm">Use Current Location</h4>
                  <p className="text-xs text-brand-600/70 mt-0.5">Using GPS</p>
                </div>
              </button>

              {/* Add New Address Button */}
              <button 
                onClick={() => { setShowLocationModal(false); setShowSaveAddressModal(true); }}
                className="w-full flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 transition-colors text-left"
              >
                <div className="bg-white p-2 rounded-full shadow-sm border border-slate-200">
                  <Plus className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Add New Address</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Save a new location</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Address Modal */}
      {showSaveAddressModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowSaveAddressModal(false)}></div>
          <div className="bg-white rounded-t-[2.5rem] p-6 relative z-10 border-t border-slate-100 max-h-[92vh] w-full overflow-y-auto hide-scrollbar animate-[slideUp_0.3s_ease-out] text-slate-800 pb-8">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 cursor-grab"></div>
            <button 
              onClick={() => setShowSaveAddressModal(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mt-2 mb-6">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 border border-indigo-100 shadow-sm">
                <MapPin className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Save Address</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Add this address to your Saved Places</p>
            </div>

            <form onSubmit={handleSaveAddressSubmit} className="space-y-5">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Detected Address</p>
                <p className="text-sm font-semibold text-slate-800 mt-1 leading-relaxed">{currentLocation}</p>
              </div>

              {/* Label Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Save As</label>
                <div className="flex gap-2">
                  {(['Home', 'Work', 'Other'] as const).map(lbl => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setAddressLabel(lbl)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        addressLabel === lbl 
                          ? 'bg-brand-600 text-white border-brand-600 shadow-sm' 
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              {addressLabel === 'Other' && (
                <div className="animate-[fadeIn_0.2s_ease-out]">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Custom Label Name</label>
                  <input 
                    type="text" 
                    required
                    value={customAddressName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Gym, Friend's House" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Flat / House No. / Floor / Building</label>
                  <input 
                    type="text" 
                    required
                    value={flatNo}
                    onChange={(e) => setFlatNo(e.target.value)}
                    placeholder="e.g. Flat 402, Block B" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Area / Sector / Locality</label>
                  <input 
                    type="text" 
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Indiranagar" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Pincode</label>
                    <input 
                      type="text" 
                      required
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => handlePincodeChange(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 560038" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">City</label>
                    <input 
                      type="text" 
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">State</label>
                  <input 
                    type="text" 
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="setPreferredAddr" 
                    checked={isPreferredAddress}
                    onChange={(e) => setIsPreferredAddress(e.target.checked)}
                    className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500 accent-brand-600"
                  />
                  <label htmlFor="setPreferredAddr" className="text-sm font-medium text-slate-700 cursor-pointer">
                    Set as Preferred Address
                  </label>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-base shadow-md transition-colors"
              >
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Money & Convert Points Modal */}
      {showAddMoneyModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowAddMoneyModal(false)}></div>
          <div className="bg-white rounded-t-[2.5rem] p-6 relative z-10 border-t border-slate-100 max-h-[92vh] w-full overflow-y-auto hide-scrollbar animate-[slideUp_0.3s_ease-out] text-slate-800 pb-8">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 cursor-grab"></div>
            <button 
              onClick={() => setShowAddMoneyModal(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mt-2 mb-6">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 border border-indigo-100 shadow-sm">
                <Wallet className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Chalo Pay Wallet</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Top up or convert reward points instantly</p>
            </div>

            {/* Tab Selector */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200">
              <button 
                type="button" 
                onClick={() => setAddMoneyTab('pay')} 
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${addMoneyTab === 'pay' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
              >
                <CreditCard className="w-4 h-4" /> Add Money
              </button>
              <button 
                type="button" 
                onClick={() => setAddMoneyTab('convert')} 
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${addMoneyTab === 'convert' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
              >
                <Coins className="w-4 h-4" /> Convert Points
              </button>
            </div>

            {addMoneyTab === 'pay' ? (
              <form onSubmit={handleAddMoneySubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">Enter Amount (₹)</label>
                  <input 
                    type="number" 
                    required
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    placeholder="Amount" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-extrabold text-center text-3xl"
                  />
                </div>

                {/* Quick Add Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  {['100', '500', '1000'].map(amt => (
                    <button 
                      key={amt}
                      type="button"
                      onClick={() => setAddAmount(amt)}
                      className={`py-3 rounded-xl font-bold text-sm border transition-all ${
                        addAmount === amt 
                          ? 'bg-brand-600 text-white border-brand-600 shadow-md' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      + ₹{amt}
                    </button>
                  ))}
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-lg shadow-md transition-colors"
                >
                  Proceed to Pay
                </button>
              </form>
            ) : (
              <form onSubmit={handleConvertSubmit} className="space-y-6">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Conversion Rate</p>
                  <p className="text-lg font-bold text-amber-600">20 Points = ₹1.00 Cash</p>
                  <p className="text-xs text-slate-500 mt-1">Available: {rewardPoints} pts</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">Points to Convert</label>
                  <input 
                    type="number" 
                    required
                    value={pointsToConvert}
                    onChange={(e) => setPointsToConvert(Math.min(rewardPoints, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-extrabold text-center text-3xl"
                  />
                </div>

                <div className="flex justify-between text-sm font-semibold text-slate-500 px-1">
                  <span>You will receive:</span>
                  <span className="text-emerald-600 font-bold">₹{(pointsToConvert / 20).toFixed(2)}</span>
                </div>

                <button 
                  type="submit"
                  disabled={pointsToConvert <= 0 || pointsToConvert > rewardPoints}
                  className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-lg shadow-md transition-colors disabled:opacity-50"
                >
                  Confirm Conversion
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Rewards History Modal */}
      {showRewardsHistoryModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowRewardsHistoryModal(false)}></div>
          <div className="bg-white rounded-t-[2.5rem] p-6 relative z-10 border-t border-slate-100 max-h-[92vh] w-full overflow-y-auto hide-scrollbar animate-[slideUp_0.3s_ease-out] text-slate-800 flex flex-col pb-8">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 cursor-grab"></div>
            <button 
              onClick={() => setShowRewardsHistoryModal(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mt-2 mb-6">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-4 border border-amber-100 shadow-sm">
                <Gift className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Rewards History</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Track your earned and spent reward points</p>
            </div>

            {/* Transaction List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {rewardTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${tx.type === 'earned' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {tx.type === 'earned' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{tx.description}</h4>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{tx.date}</p>
                    </div>
                  </div>
                  <span className={`font-extrabold text-sm ${tx.type === 'earned' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {tx.type === 'earned' ? '+' : '-'}{tx.points} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Referral Bonus Modal with QR Code */}
      {showReferralModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowReferralModal(false)}></div>
          <div className="bg-white rounded-t-[2.5rem] p-6 relative z-10 border-t border-slate-100 max-h-[92vh] w-full overflow-y-auto hide-scrollbar animate-[slideUp_0.3s_ease-out] text-slate-800 pb-8">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 cursor-grab"></div>
            <button 
              onClick={() => setShowReferralModal(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mt-2 mb-6">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-4 border border-amber-200 shadow-sm">
                <Award className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Referral Program</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Earn unlimited wallet cash by inviting friends</p>
            </div>

            {/* QR Code Section */}
            <div className="flex flex-col items-center justify-center bg-slate-50 rounded-3xl p-6 border border-slate-100 mb-6 shadow-inner">
              <ChaloDownloadQRCode className="w-36 h-32 shadow-md rounded-2xl border border-slate-200/60" />
              <p className="text-xs font-bold text-slate-700 mt-3 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-brand-600" /> Scan to Download Chalo App
              </p>
              <p className="text-[10px] text-slate-400 mt-1 text-center">Available on iOS & Android</p>
            </div>

            {/* Steps */}
            <div className="space-y-4 mb-6">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">How it works</h3>
              <div className="space-y-3">
                <StepItem number="1" title="Share your code" description={`Send your unique referral code ${referralCode} to your friends.`} />
                <StepItem number="2" title="Friend registers" description="Your friend signs up on Chalo and links any of their accounts." />
                <StepItem number="3" title="First transaction" description="Your friend completes their first ride, food order, grocery delivery, or stay booking." />
                <StepItem number="4" title="Get rewarded!" description="You instantly receive 1000 Reward Points (worth ₹50) in your account!" />
              </div>
            </div>

            {/* Conversion Details */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-6">
              <h4 className="font-bold text-slate-900 text-sm mb-3">Point Conversion Rate</h4>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 font-medium">20 Reward Points</span>
                <span className="font-bold text-brand-600">₹1.00 Wallet Cash</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-3 pt-3 border-t border-slate-200/60">
                <span className="text-slate-600 font-medium">1000 Points (1 Referral)</span>
                <span className="font-bold text-emerald-600">₹50.00 Wallet Cash</span>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="space-y-2 text-xs text-slate-500">
              <h4 className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Info className="w-3.5 h-3.5" /> Terms & Conditions
              </h4>
              <ul className="list-disc pl-4 space-y-1.5 leading-relaxed">
                <li>The referred friend must be a new user on the Chalo platform.</li>
                <li>The bonus points are credited only after the friend's first successful transaction is completed.</li>
                <li>Points can be converted to wallet cash instantly from the Payment Methods page.</li>
                <li>Chalo reserves the right to revoke referral bonuses in case of fraudulent activities.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StepItem = ({ number, title, description }: { number: string, title: string, description: string }) => (
  <div className="flex gap-4 items-start">
    <div className="w-8 h-8 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm flex-shrink-0">
      {number}
    </div>
    <div>
      <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>
    </div>
  </div>
);

const PrimaryServiceCard = ({ icon, label, color, onClick, onMouseEnter, onMouseLeave }: { icon: React.ReactNode, label: string, color: string, onClick: () => void, onMouseEnter?: () => void, onMouseLeave?: () => void }) => (
  <button 
    onClick={onClick} 
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className="flex flex-col items-center justify-center gap-2.5 group transition-all duration-300 hover:scale-105 active:scale-95"
  >
    <div className={`w-full aspect-square rounded-[1.5rem] flex items-center justify-center transition-all duration-300 shadow-sm border ${color}`}>
      {icon}
    </div>
    <span className="text-[13px] font-bold text-slate-700 group-hover:text-brand-600 transition-colors">{label}</span>
  </button>
);

const SecondaryServiceCard = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) => (
  <button onClick={onClick} className="flex flex-col items-center justify-center gap-2 group transition-all duration-300 hover:scale-110 active:scale-95">
    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-600 transition-all border border-slate-200 group-hover:bg-slate-50 group-hover:text-brand-600 shadow-sm">
      {icon}
    </div>
    <span className="text-[11px] font-semibold text-slate-600 text-center leading-tight group-hover:text-slate-800 transition-colors">{label}</span>
  </button>
);
