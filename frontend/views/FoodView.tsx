import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Star, Clock, Percent, X, Flame, History, ChevronRight, Plus, Minus, ShoppingBag, ShieldCheck, Loader2, CheckCircle2, MapPin, CreditCard, Smartphone, Wallet, Banknote, AlertCircle, User } from 'lucide-react';
import { RESTAURANTS } from '../constants';
import { ProviderBadge } from '../components/ProviderBadge';
import { ChaloLogo } from '../components/Icons';
import { CartItem, Restaurant, FoodItem, ActivityItem, SavedAddress, SavedMethod, WalletItem } from '../types';
import { RazorpayCheckout } from '../components/RazorpayCheckout';

interface FoodViewProps {
  onBack: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  walletBalance: number;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
  preferredPayment: string;
  onUpdatePreferredPayment: (methodId: string) => void;
  onAddActivity: (newActivity: ActivityItem) => void;
  onAddRewards: (points: number, description?: string) => void;
  savedAddresses: SavedAddress[];
  upis: SavedMethod[];
  setUpis: React.Dispatch<React.SetStateAction<SavedMethod[]>>;
  cards: SavedMethod[];
  setCards: React.Dispatch<React.SetStateAction<SavedMethod[]>>;
  wallets: WalletItem[];
  setWallets: React.Dispatch<React.SetStateAction<WalletItem[]>>;
}

const MOCK_MENUS: Record<string, FoodItem[]> = {
  'r1': [
    { id: 'f-m1', name: 'Special Chicken Biryani', price: 320, description: 'Andhra style spicy chicken biryani served with raita.', imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=200&q=80', isVeg: false },
    { id: 'f-m2', name: 'Paneer Biryani', price: 280, description: 'Fragrant basmati rice cooked with spiced paneer cubes.', imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=200&q=80', isVeg: true }
  ],
  'r3': [
    { id: 'f-t1', name: 'Classic Cheese Burger', price: 250, description: 'Juicy chicken patty with cheddar cheese, lettuce, and house sauce.', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=80', isVeg: false },
    { id: 'f-t2', name: 'Veg Supreme Burger', price: 210, description: 'Crispy veg patty with fresh veggies and mayo.', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=80', isVeg: true }
  ],
  'r5': [
    { id: 'f-e1', name: 'Butter Chicken', price: 280, description: 'Tender tandoori chicken cooked in a rich, creamy tomato gravy.', imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=200&q=80', isVeg: false },
    { id: 'f-e2', name: 'Dal Makhani', price: 220, description: 'Slow-cooked black lentils with butter and cream.', imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=200&q=80', isVeg: true }
  ]
};

const UPSELL_ITEMS: FoodItem[] = [
  { id: 'up-1', name: 'Extra Cheese Slice', price: 30, description: 'Add a premium cheddar cheese slice.', imageUrl: 'https://images.unsplash.com/photo-1528256446066-2485f49327e0?auto=format&fit=crop&w=100&q=80', isVeg: true },
  { id: 'up-2', name: 'Chilled Coca-Cola', price: 45, description: '330ml can of refreshing cola.', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=100&q=80', isVeg: true },
  { id: 'up-3', name: 'French Fries', price: 90, description: 'Crispy golden salted potato fries.', imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=100&q=80', isVeg: true }
];

export const FoodView: React.FC<FoodViewProps> = ({ onBack, cart, setCart, walletBalance, setWalletBalance, preferredPayment, onUpdatePreferredPayment, onAddActivity, onAddRewards, savedAddresses, upis, setUpis, cards, setCards, wallets, setWallets }) => {
  const [sortBy, setSortBy] = useState<'rating' | 'fee'>('rating');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  
  // Checkout & Sub-modal States
  const [showCheckout, setShowCheckout] = useState(false);
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showAddUpiModal, setShowAddUpiModal] = useState(false);
  const [showRazorpay, setShowRazorpay] = useState(false);
  
  // Selected Address & Payment
  const [selectedAddress, setSelectedAddress] = useState<SavedAddress>(
    savedAddresses.find(a => a.isPreferred) || savedAddresses[0]
  );
  const [selectedPayment, setSelectedPayment] = useState<string>(preferredPayment);

  // Add Card Form States
  const [newCardName, setNewCardName] = useState('');
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardCvv, setNewCardCvv] = useState('');
  const [cardError, setCardError] = useState('');

  // Add UPI Form States
  const [newUpiId, setNewUpiId] = useState('');

  // Processing States
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const filteredRestaurants = useMemo(() => {
    let result = RESTAURANTS;
    if (searchQuery.trim()) {
      result = RESTAURANTS.filter(r => 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return [...result].sort((a, b) => {
      if (sortBy === 'fee') return a.deliveryFee - b.deliveryFee;
      return b.rating - a.rating;
    });
  }, [searchQuery, sortBy]);

  const handleAddToCart = (item: FoodItem, provider: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1, imageUrl: item.imageUrl, provider, type: 'food' }];
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.id !== itemId);
    });
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCardNumber.replace(/\s/g, '').length < 15) {
      setCardError('Please enter a valid card number.');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      const newId = `card-${Date.now()}`;
      const last4 = newCardNumber.replace(/\s/g, '').slice(-4);
      const newCard: SavedMethod = {
        id: newId,
        type: 'card',
        title: `Visa Credit Card`,
        subtitle: `${newCardName.toUpperCase()} • **** ${last4}`,
        fallbackIcon: <CreditCard className="w-6 h-6 text-slate-600" />
      };
      setCards([...cards, newCard]);
      setSelectedPayment(newId);
      setIsProcessing(false);
      setShowAddCardModal(false);
      setNewCardName('');
      setNewCardNumber('');
      setNewCardExpiry('');
      setNewCardCvv('');
    }, 1500);
  };

  const handleAddUpiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpiId.includes('@')) {
      alert('Please enter a valid UPI ID.');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      const newId = `upi-${Date.now()}`;
      const newUpi: SavedMethod = {
        id: newId,
        type: 'upi',
        title: 'UPI ID',
        subtitle: newUpiId,
        fallbackIcon: <Smartphone className="w-6 h-6 text-slate-600" />
      };
      setUpis([...upis, newUpi]);
      setSelectedPayment(newId);
      setIsProcessing(false);
      setShowAddUpiModal(false);
      setNewUpiId('');
    }, 1500);
  };

  const handleCheckoutSubmit = () => {
    const grandTotal = cartTotal + (selectedRestaurant?.deliveryFee || 0);
    
    if (selectedPayment === 'wallet-paytm' || selectedPayment.startsWith('wallet-')) {
      const wallet = wallets.find(w => w.id === selectedPayment);
      if (wallet && wallet.balance < grandTotal) {
        alert('Insufficient wallet balance. Please top up or choose another payment method.');
        return;
      }
      processBooking(grandTotal);
    } else if (selectedPayment === 'chalo-pay') {
      if (walletBalance < grandTotal) {
        alert('Insufficient Chalo Pay balance. Please top up or choose another payment method.');
        return;
      }
      processBooking(grandTotal);
    } else if (selectedPayment === 'cash') {
      processBooking(grandTotal);
    } else {
      // UPI, Card
      setShowRazorpay(true);
    }
  };

  const processBooking = (amount: number) => {
    setShowRazorpay(false);
    setIsProcessing(true);
    setTimeout(() => {
      if (selectedPayment === 'chalo-pay') {
        setWalletBalance(prev => prev - amount);
      } else if (selectedPayment.startsWith('wallet-')) {
        setWallets(wallets.map(w => w.id === selectedPayment ? { ...w, balance: w.balance - amount } : w));
      }

      setIsProcessing(false);
      setBookingSuccess(true);
      
      // Log Activity
      onAddActivity({
        id: `act-${Date.now()}`,
        provider: selectedRestaurant?.provider || 'chalo',
        type: 'food',
        title: `${selectedRestaurant?.name || 'Food'} Order`,
        date: 'Just Now',
        status: 'completed',
        price: amount
      });

      // Add Reward Points (1 point per ₹10 spent)
      const earnedPoints = Math.floor(amount / 10);
      if (earnedPoints > 0) {
        onAddRewards(earnedPoints, `Food Order: ${selectedRestaurant?.name}`);
      }

      setCart([]); // Clear cart
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col text-slate-800 font-sans relative">
      {showRazorpay && (
        <RazorpayCheckout 
          amount={cartTotal + (selectedRestaurant?.deliveryFee || 0)} 
          onSuccess={() => processBooking(cartTotal + (selectedRestaurant?.deliveryFee || 0))} 
          onCancel={() => setShowRazorpay(false)} 
        />
      )}

      {/* Header */}
      <div className="bg-slate-950 pt-12 pb-5 px-4 shadow-sm sticky top-0 z-20 border-b border-slate-900 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={selectedRestaurant ? () => setSelectedRestaurant(null) : onBack} 
            className="p-2 -ml-2 rounded-full hover:bg-slate-800 active:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex-1 flex items-center gap-2">
            <button onClick={onBack} className="active:scale-95 transition-transform hover:scale-105 duration-200">
              <ChaloLogo className="w-8 h-8" />
            </button>
            <div>
              <p className="text-xs text-slate-400 font-medium">Delivering to</p>
              <p className="font-bold text-white text-sm truncate max-w-[200px]">{selectedAddress.address}</p>
            </div>
          </div>
        </div>
        
        {/* Light Grey Search Bar */}
        {!selectedRestaurant && (
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search restaurants or cuisines..." 
              className="w-full bg-slate-100 border-none rounded-xl py-3 pl-11 pr-10 text-sm focus:ring-2 focus:ring-brand-500 outline-none text-slate-800 font-semibold"
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
        )}
      </div>

      {/* Main Content */}
      {!selectedRestaurant ? (
        <div className="flex-1 flex flex-col">
          {/* Categories */}
          <div className="bg-slate-50 py-4 px-4 border-b border-slate-100">
            <div className="flex gap-4 overflow-x-auto hide-scrollbar">
              {['Offers', 'Healthy', 'Biryani', 'Pizza', 'Burger', 'Desserts'].map((cat, i) => (
                <button 
                  key={i} 
                  onClick={() => setSearchQuery(cat === 'Offers' ? '' : cat)}
                  className="flex flex-col items-center gap-2 min-w-[70px] active:scale-95 transition-transform hover:scale-105 duration-200"
                >
                  <div className="w-16 h-16 rounded-full bg-white overflow-hidden border border-slate-200 shadow-sm hover:border-brand-500 transition-colors">
                    <img src={`https://images.unsplash.com/photo-${i === 0 ? '1563379091339-03b21ab4a4f8' : i === 1 ? '1546069901-ba9599a7e63c' : i === 2 ? '1563379091339-03b21ab4a4f8' : i === 3 ? '1513104890138-7c749659a591' : i === 4 ? '1568901346375-23c9450c58cd' : '1551024601-bec78aea704b'}?auto=format&fit=crop&w=100&q=80`} alt={cat} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-bold text-slate-600">{cat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Restaurant List */}
          <div className="flex-1 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-slate-900">Compare & Order</h2>
              <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200">
                <button 
                  onClick={() => setSortBy('rating')} 
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${sortBy === 'rating' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
                >
                  Top Rated
                </button>
                <button 
                  onClick={() => setSortBy('fee')} 
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${sortBy === 'fee' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
                >
                  Lowest Fee
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredRestaurants.map((restaurant) => (
                <div 
                  key={restaurant.id} 
                  onClick={() => setSelectedRestaurant(restaurant)}
                  className="bg-white rounded-2xl overflow-hidden shadow-soft border border-slate-100 cursor-pointer active:scale-[0.98] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg flex flex-col"
                >
                  <div className="relative h-40">
                    <img src={restaurant.imageUrl} alt={restaurant.name} className="w-full h-full object-cover" />
                    {restaurant.offer && (
                      <div className="absolute top-3 left-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-r-lg flex items-center shadow-md">
                        <Percent className="w-3 h-3 mr-1" /> {restaurant.offer}
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3">
                      <ProviderBadge provider={restaurant.provider} className="shadow-md text-xs px-2 py-1" />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-lg text-slate-900">{restaurant.name}</h3>
                      <div className="flex items-center bg-green-500/10 text-green-700 px-1.5 py-0.5 rounded text-xs font-bold border border-green-500/20">
                        <Star className="w-3 h-3 mr-0.5 fill-green-700" /> {restaurant.rating}
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 mb-3">{restaurant.cuisine}</p>
                    <div className="flex items-center justify-between text-xs font-medium">
                      <div className="flex items-center text-slate-500">
                        <Clock className="w-4 h-4 mr-1" /> {restaurant.deliveryTime}
                      </div>
                      <div className={`px-2 py-1 rounded ${restaurant.deliveryFee === 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                        {restaurant.deliveryFee === 0 ? 'Free Delivery' : `Delivery: ₹${restaurant.deliveryFee}`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Restaurant Menu View */
        <div className="flex-1 flex flex-col p-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">{selectedRestaurant.name}</h2>
              <p className="text-sm text-slate-500 mt-1">{selectedRestaurant.cuisine}</p>
            </div>
            <ProviderBadge provider={selectedRestaurant.provider} className="text-xs px-2.5 py-1" />
          </div>

          <div className="space-y-6 pb-24">
            {(MOCK_MENUS[selectedRestaurant.id] || []).map((item) => {
              const cartItem = cart.find(i => i.id === item.id);
              return (
                <div key={item.id} className="flex gap-4 p-4 bg-slate-50 rounded-3xl border border-slate-100 shadow-soft">
                  <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-2xl object-cover border border-slate-200" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-3 h-3 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <h3 className="font-bold text-slate-900 text-base truncate">{item.name}</h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                    <p className="font-extrabold text-brand-600 text-base mt-2">₹{item.price}</p>
                  </div>
                  <div className="flex flex-col justify-end">
                    {cartItem ? (
                      <div className="flex items-center bg-brand-600 text-white rounded-xl p-1 shadow-md">
                        <button onClick={() => handleRemoveFromCart(item.id)} className="p-1 hover:bg-brand-700 rounded-lg">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 font-bold text-sm">{cartItem.quantity}</span>
                        <button onClick={() => handleAddToCart(item, selectedRestaurant.provider)} className="p-1 hover:bg-brand-700 rounded-lg">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleAddToCart(item, selectedRestaurant.provider)}
                        className="bg-brand-500/10 text-brand-600 border border-brand-500/20 font-bold text-xs px-4 py-2 rounded-xl hover:bg-brand-500/20 transition-all"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Cart Bar (Static above BottomNav) */}
      {cart.length > 0 && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[440px] bg-slate-900 text-white p-4 rounded-2xl shadow-float flex items-center justify-between z-40 border border-slate-800 animate-[slideUp_0.3s_ease-out]">
          <div className="flex items-center gap-3">
            <div className="bg-brand-500/20 p-2 rounded-xl border border-brand-500/30">
              <ShoppingBag className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold">{cart.length} Items</p>
              <p className="font-extrabold text-white text-base">₹{cartTotal}</p>
            </div>
          </div>
          <button 
            onClick={() => setShowCheckout(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-md"
          >
            View Cart
          </button>
        </div>
      )}

      {/* Checkout & Payment Gateway Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => !isProcessing && !bookingSuccess && setShowCheckout(false)}></div>
          <div className="bg-white rounded-t-[2.5rem] p-6 relative z-10 border-t border-slate-100 max-h-[90vh] w-full overflow-y-auto hide-scrollbar animate-[slideUp_0.3s_ease-out] text-slate-800 pb-12">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 cursor-grab"></div>
            <button 
              onClick={() => setShowCheckout(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
              disabled={isProcessing}
            >
              <X className="w-5 h-5" />
            </button>

            {bookingSuccess ? (
              <div className="flex flex-col items-center text-center py-8">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border border-emerald-100 shadow-sm">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900">Order Placed!</h2>
                <p className="text-sm text-slate-500 font-medium mt-1 max-w-[280px]">
                  Your food order has been successfully placed and is being prepared.
                </p>
                <button 
                  onClick={() => { setShowCheckout(false); setBookingSuccess(false); setSelectedRestaurant(null); }}
                  className="w-full mt-6 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-lg shadow-md transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-6 flex-1 flex flex-col">
                <div className="text-center">
                  <h2 className="text-2xl font-extrabold text-slate-900">Checkout</h2>
                  <p className="text-sm text-slate-500 font-medium mt-1">Review your order and pay securely</p>
                </div>

                {/* Cart Items Summary with Quantity Controls */}
                <div className="space-y-3 pr-1 border-b border-slate-100 pb-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex-1">
                        <span className="font-semibold text-slate-800">{item.name}</span>
                        <span className="text-xs text-slate-400 block">₹{item.price} each</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleRemoveFromCart(item.id)} className="p-1 bg-slate-100 rounded-lg hover:bg-slate-200">
                          <Minus className="w-3.5 h-3.5 text-slate-600" />
                        </button>
                        <span className="font-bold text-slate-800">{item.quantity}</span>
                        <button onClick={() => handleAddToCart(item as any, selectedRestaurant?.provider)} className="p-1 bg-slate-100 rounded-lg hover:bg-slate-200">
                          <Plus className="w-3.5 h-3.5 text-slate-600" />
                        </button>
                      </div>
                      <span className="font-bold text-slate-900 pl-4 w-16 text-right">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Upsell Section */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Complete Your Meal</h3>
                  <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
                    {UPSELL_ITEMS.map(item => (
                      <div key={item.id} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-3 min-w-[240px] flex-shrink-0">
                        <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-800 text-xs truncate">{item.name}</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">₹{item.price}</p>
                        </div>
                        <button 
                          onClick={() => handleAddToCart(item, selectedRestaurant?.provider)}
                          className="bg-brand-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm active:scale-95 transition-transform"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address Selector */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-brand-500/10 p-2 rounded-xl border border-brand-500/20 text-brand-600">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deliver To</p>
                      <p className="font-bold text-slate-800 text-sm truncate max-w-[200px]">{selectedAddress.address}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowAddressSelector(true)}
                    className="text-brand-600 text-xs font-bold hover:underline"
                  >
                    Change
                  </button>
                </div>

                {/* Payment Method Selector */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-brand-500/10 p-2 rounded-xl border border-brand-500/20 text-brand-600">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment Method</p>
                      <p className="font-bold text-slate-800 text-sm capitalize">{selectedPayment.replace('-', ' ')}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowPaymentSelector(true)}
                    className="text-brand-600 text-xs font-bold hover:underline"
                  >
                    Change
                  </button>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-sm font-semibold text-slate-500">
                    <span>Subtotal</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-slate-500">
                    <span>Delivery Fee</span>
                    <span>₹{selectedRestaurant?.deliveryFee || 0}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200/60">
                    <span>Total Amount</span>
                    <span className="text-brand-600">₹{cartTotal + (selectedRestaurant?.deliveryFee || 0)}</span>
                  </div>
                </div>

                {isProcessing ? (
                  <div className="py-4 flex flex-col items-center">
                    <Loader2 className="w-8 h-8 text-brand-600 animate-spin mb-4" />
                    <p className="text-sm font-bold text-slate-600">Processing payment securely...</p>
                  </div>
                ) : (
                  <button 
                    onClick={handleCheckoutSubmit}
                    className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-lg shadow-md transition-colors"
                  >
                    Pay ₹{cartTotal + (selectedRestaurant?.deliveryFee || 0)}
                  </button>
                )}

                <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" /> Secured by Chalo Pay
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Address Selector Sub-modal */}
      {showAddressSelector && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowAddressSelector(false)}></div>
          <div className="bg-white rounded-t-[2rem] p-6 relative z-10 border-t border-slate-100 max-h-[90vh] w-full overflow-y-auto hide-scrollbar animate-[slideUp_0.3s_ease-out] text-slate-800 pb-12">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 cursor-grab"></div>
            <button 
              onClick={() => setShowAddressSelector(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-900">Select Delivery Address</h3>
            </div>
            <div className="space-y-3">
              {savedAddresses.map(addr => (
                <button 
                  key={addr.id}
                  onClick={() => { setSelectedAddress(addr); setShowAddressSelector(false); }}
                  className={`w-full flex items-start p-4 rounded-2xl border text-left transition-all ${
                    selectedAddress.id === addr.id ? 'border-brand-500 bg-brand-50/30' : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <MapPin className="w-5 h-5 text-brand-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{addr.label}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{addr.address}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Selector Sub-modal */}
      {showPaymentSelector && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowPaymentSelector(false)}></div>
          <div className="bg-white rounded-t-[2rem] p-6 relative z-10 border-t border-slate-100 max-h-[90vh] w-full overflow-y-auto hide-scrollbar animate-[slideUp_0.3s_ease-out] text-slate-800 pb-12">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 cursor-grab"></div>
            <button 
              onClick={() => setShowPaymentSelector(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-900">Select Payment Method</h3>
            </div>

            <div className="space-y-4">
              {/* Chalo Pay Wallet */}
              <button 
                onClick={() => { setSelectedPayment('chalo-pay'); setShowPaymentSelector(false); }}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                  selectedPayment === 'chalo-pay' ? 'border-brand-500 bg-brand-500/10' : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-brand-600" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Chalo Pay Wallet</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Balance: ₹{walletBalance.toFixed(2)}</p>
                  </div>
                </div>
                {selectedPayment === 'chalo-pay' && <CheckCircle2 className="w-5 h-5 text-brand-600" />}
              </button>

              {/* Saved UPIs */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">UPI</p>
                {upis.map(upi => (
                  <button 
                    key={upi.id}
                    onClick={() => { setSelectedPayment(upi.id); setShowPaymentSelector(false); }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                      selectedPayment === upi.id ? 'border-brand-500 bg-brand-50/30' : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-slate-600" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{upi.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{upi.subtitle}</p>
                      </div>
                    </div>
                    {selectedPayment === upi.id && <CheckCircle2 className="w-5 h-5 text-brand-600" />}
                  </button>
                ))}
                <button 
                  onClick={() => setShowAddUpiModal(true)}
                  className="w-full flex items-center gap-2 p-3 text-brand-600 font-bold text-xs hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add New UPI ID
                </button>
              </div>

              {/* Saved Cards */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Credit & Debit Cards</p>
                {cards.map(card => (
                  <button 
                    key={card.id}
                    onClick={() => { setSelectedPayment(card.id); setShowPaymentSelector(false); }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                      selectedPayment === card.id ? 'border-brand-500 bg-brand-50/30' : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-slate-600" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{card.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{card.subtitle}</p>
                      </div>
                    </div>
                    {selectedPayment === card.id && <CheckCircle2 className="w-5 h-5 text-brand-600" />}
                  </button>
                ))}
                <button 
                  onClick={() => setShowAddCardModal(true)}
                  className="w-full flex items-center gap-2 p-3 text-brand-600 font-bold text-xs hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add New Card
                </button>
              </div>

              {/* Cash on Delivery */}
              <button 
                onClick={() => { setSelectedPayment('cash'); setShowPaymentSelector(false); }}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                  selectedPayment === 'cash' ? 'border-brand-500 bg-brand-50/30' : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Banknote className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Cash on Delivery</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Pay directly to the delivery partner</p>
                  </div>
                </div>
                {selectedPayment === 'cash' && <CheckCircle2 className="w-5 h-5 text-brand-600" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Card Sub-modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowAddCardModal(false)}></div>
          <div className="bg-white rounded-t-[2rem] p-6 relative z-10 border-t border-slate-100 max-h-[90vh] w-full overflow-y-auto hide-scrollbar animate-[slideUp_0.3s_ease-out] text-slate-800 pb-12">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 cursor-grab"></div>
            <button 
              onClick={() => setShowAddCardModal(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-900">Add New Card</h3>
            </div>

            <form onSubmit={handleAddCardSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Name on Card</label>
                <input 
                  type="text" 
                  required
                  value={newCardName}
                  onChange={(e) => setNewCardName(e.target.value)}
                  placeholder="JOHN DOE" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Card Number</label>
                <input 
                  type="text" 
                  required
                  maxLength={19}
                  value={newCardNumber}
                  onChange={(e) => setNewCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                  placeholder="0000 0000 0000 0000" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium tracking-wide"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Expiry Date</label>
                  <input 
                    type="text" 
                    required
                    maxLength={5}
                    value={newCardExpiry}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (val.length === 2 && newCardExpiry.length === 3) {
                        val = val.substring(0, 1);
                      } else {
                        val = val.replace(/\D/g, '');
                        if (val.length > 2) {
                          val = val.substring(0, 2) + '/' + val.substring(2, 4);
                        }
                      }
                      setNewCardExpiry(val);
                    }}
                    placeholder="MM/YY" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">CVV</label>
                  <input 
                    type="password" 
                    required
                    maxLength={3}
                    value={newCardCvv}
                    onChange={(e) => setNewCardCvv(e.target.value.replace(/\D/g, ''))}
                    placeholder="•••" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium text-center tracking-widest"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-base shadow-md transition-colors"
              >
                Save & Use Card
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add UPI Sub-modal */}
      {showAddUpiModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowAddUpiModal(false)}></div>
          <div className="bg-white rounded-t-[2rem] p-6 relative z-10 border-t border-slate-100 max-h-[90vh] w-full overflow-y-auto hide-scrollbar animate-[slideUp_0.3s_ease-out] text-slate-800 pb-12">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 cursor-grab"></div>
            <button 
              onClick={() => setShowAddUpiModal(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-900">Add New UPI ID</h3>
            </div>

            <form onSubmit={handleAddUpiSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">UPI ID</label>
                <input 
                  type="text" 
                  required
                  value={newUpiId}
                  onChange={(e) => setNewUpiId(e.target.value)}
                  placeholder="e.g. name@bank" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-base shadow-md transition-colors"
              >
                Verify & Use UPI
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
