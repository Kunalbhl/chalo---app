import React, { useState, useEffect } from 'react';
import { ViewState, RewardTransaction, SavedAddress, CartItem, ActivityItem, SavedMethod, WalletItem, Guest } from './types';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './views/HomeView';
import { RideBookingView } from './views/RideBookingView';
import { ActivityView } from './views/ActivityView';
import { AccountView } from './views/AccountView';
import { FoodView } from './views/FoodView';
import { MartView } from './views/MartView';
import { StaysView } from './views/StaysView';
import { FlightsView } from './views/FlightsView';
import { IntercityView } from './views/IntercityView';
import { ComingSoonView } from './views/ComingSoonView';
import { LinkedAccountsView } from './views/LinkedAccountsView';
import { PaymentMethodsView } from './views/PaymentMethodsView';
import { AddressManagementView } from './views/AddressManagementView';
import { RECENT_ACTIVITY } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [walletBalance, setWalletBalance] = useState<number>(1240.50);
  const [rewardPoints, setRewardPoints] = useState<number>(1450);
  const [profileName, setProfileName] = useState<string>('Kunal Pareek');
  const [preferredPayment, setPreferredPayment] = useState<string>('upi-gpay');
  const [currentLocation, setCurrentLocation] = useState<string>('Indiranagar, Bengaluru');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>(RECENT_ACTIVITY);
  
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([
    { id: 'addr-1', label: 'Home', flatNo: '123', area: 'Palm Grove Apartments, Indiranagar', city: 'Bengaluru', state: 'Karnataka', pincode: '560038', fullAddress: '123, Palm Grove Apartments, Indiranagar, Bengaluru, Karnataka 560038', isPreferred: true, lat: 12.9716, lng: 77.5946 },
    { id: 'addr-2', label: 'Work', flatNo: 'Block B', area: 'Tech Park, Outer Ring Road, Bellandur', city: 'Bengaluru', state: 'Karnataka', pincode: '560103', fullAddress: 'Block B, Tech Park, Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103', isPreferred: false, lat: 12.9279, lng: 77.6801 }
  ]);

  const [savedGuests, setSavedGuests] = useState<Guest[]>([
    { id: 'g-1', name: 'Kunal Pareek', phone: '+91 98765 43210', email: 'kunal.pareek@gmail.com' }
  ]);

  // Lifted Payment Methods State
  const [upis, setUpis] = useState<SavedMethod[]>([
    { id: 'upi-gpay', type: 'upi', title: 'Google Pay', subtitle: 'arjun@okhdfcbank', iconUrl: 'https://icon.horse/icon/pay.google.com' },
  ]);

  const [cards, setCards] = useState<SavedMethod[]>([
    { id: 'card-hdfc', type: 'card', title: 'HDFC Bank Visa Credit Card', subtitle: 'ARJUN KUMAR • **** 4242', iconUrl: 'https://icon.horse/icon/hdfcbank.com' },
  ]);

  const [wallets, setWallets] = useState<WalletItem[]>([
    { id: 'wallet-paytm', title: 'Paytm Wallet', balance: 350, isLinked: true, iconUrl: 'https://icon.horse/icon/paytm.com', domain: 'paytm.com' },
    { id: 'wallet-amazon', title: 'Amazon Pay', balance: 0, isLinked: false, iconUrl: 'https://icon.horse/icon/amazon.in', domain: 'amazon.in' },
    { id: 'wallet-mobikwik', title: 'MobiKwik', balance: 0, isLinked: false, iconUrl: 'https://icon.horse/icon/mobikwik.com', domain: 'mobikwik.com' },
  ]);
  
  const [rewardTransactions, setRewardTransactions] = useState<RewardTransaction[]>([
    { id: 'rt-1', description: 'Welcome Bonus', points: 500, type: 'earned', date: '10 Oct, 10:00 AM' },
    { id: 'rt-2', description: 'Referral: AMAN1000', points: 1000, type: 'earned', date: '12 Oct, 04:30 PM' },
    { id: 'rt-3', description: 'Converted to Wallet Cash', points: 50, type: 'spent', date: '14 Oct, 11:15 AM' }
  ]);

  // Load preferred payment from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem('chalo_preferred_payment');
    if (saved) {
      setPreferredPayment(saved);
    }
  }, []);

  const handleUpdatePreferredPayment = (methodId: string) => {
    setPreferredPayment(methodId);
    localStorage.setItem('chalo_preferred_payment', methodId);
  };

  // Conversion factor: 20 Reward Points = ₹1 Wallet Money
  const handleConvertPoints = (pointsToConvert: number): boolean => {
    if (rewardPoints >= pointsToConvert && pointsToConvert > 0) {
      const cashAmount = pointsToConvert / 20;
      setRewardPoints(prev => prev - pointsToConvert);
      setWalletBalance(prev => prev + cashAmount);
      
      // Add transaction record
      const newTx: RewardTransaction = {
        id: `rt-${Date.now()}`,
        description: 'Converted to Wallet Cash',
        points: pointsToConvert,
        type: 'spent',
        date: 'Just Now'
      };
      setRewardTransactions(prev => [newTx, ...prev]);
      return true;
    }
    return false;
  };

  const handleAddRewards = (points: number, description: string = 'Referral Bonus') => {
    setRewardPoints(prev => prev + points);
    const newTx: RewardTransaction = {
      id: `rt-${Date.now()}`,
      description,
      points,
      type: 'earned',
      date: 'Just Now'
    };
    setRewardTransactions(prev => [newTx, ...prev]);
  };

  const handleAddWalletMoney = (amount: number) => {
    setWalletBalance(prev => prev + amount);
  };

  const handleAddSavedAddress = (newAddr: SavedAddress) => {
    setSavedAddresses(prev => {
      let updated = prev;
      if (newAddr.isPreferred) {
        updated = updated.map(a => ({ ...a, isPreferred: false }));
      }
      return [...updated, newAddr];
    });
  };

  const handleAddActivity = (newActivity: ActivityItem) => {
    setActivities(prev => [newActivity, ...prev]);
  };

  const handleAddGuest = (newGuest: Guest) => {
    setSavedGuests(prev => [...prev, newGuest]);
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeView 
            onChangeView={setCurrentView} 
            walletBalance={walletBalance} 
            rewardPoints={rewardPoints}
            onAddRewards={handleAddRewards}
            onAddWalletMoney={handleAddWalletMoney}
            profileName={profileName}
            rewardTransactions={rewardTransactions}
            currentLocation={currentLocation}
            onUpdateLocation={setCurrentLocation}
            onAddSavedAddress={handleAddSavedAddress}
          />
        );
      case 'booking':
        return <RideBookingView onBack={() => setCurrentView('home')} />;
      case 'food':
        return (
          <FoodView 
            onBack={() => setCurrentView('home')} 
            cart={cart}
            setCart={setCart}
            walletBalance={walletBalance}
            setWalletBalance={setWalletBalance}
            preferredPayment={preferredPayment}
            onUpdatePreferredPayment={handleUpdatePreferredPayment}
            onAddActivity={handleAddActivity}
            onAddRewards={handleAddRewards}
            savedAddresses={savedAddresses}
            upis={upis}
            setUpis={setUpis}
            cards={cards}
            setCards={setCards}
            wallets={wallets}
            setWallets={setWallets}
          />
        );
      case 'mart':
        return (
          <MartView 
            onBack={() => setCurrentView('home')} 
            cart={cart}
            setCart={setCart}
            walletBalance={walletBalance}
            setWalletBalance={setWalletBalance}
            preferredPayment={preferredPayment}
            onUpdatePreferredPayment={handleUpdatePreferredPayment}
            onAddActivity={handleAddActivity}
            onAddRewards={handleAddRewards}
            savedAddresses={savedAddresses}
            upis={upis}
            setUpis={setUpis}
            cards={cards}
            setCards={setCards}
            wallets={wallets}
            setWallets={setWallets}
          />
        );
      case 'stays':
        return (
          <StaysView 
            onBack={() => setCurrentView('home')} 
            onAddActivity={handleAddActivity}
            savedGuests={savedGuests}
            onAddGuest={handleAddGuest}
          />
        );
      case 'flights':
        return (
          <FlightsView 
            onBack={() => setCurrentView('home')} 
            onAddActivity={handleAddActivity}
            savedGuests={savedGuests}
            onAddGuest={handleAddGuest}
          />
        );
      case 'intercity':
        return (
          <IntercityView 
            onBack={() => setCurrentView('home')} 
            onAddActivity={handleAddActivity}
            savedGuests={savedGuests}
            onAddGuest={handleAddGuest}
          />
        );
      case 'linked_accounts':
        return <LinkedAccountsView onBack={() => setCurrentView('account')} />;
      case 'address_management':
        return (
          <AddressManagementView 
            onBack={() => setCurrentView('account')} 
            savedAddresses={savedAddresses}
            onUpdateAddresses={setSavedAddresses}
          />
        );
      case 'payment_methods':
        return (
          <PaymentMethodsView 
            onBack={() => setCurrentView('account')} 
            walletBalance={walletBalance}
            rewardPoints={rewardPoints}
            onConvertPoints={handleConvertPoints}
            preferredPayment={preferredPayment}
            onUpdatePreferredPayment={handleUpdatePreferredPayment}
            upis={upis}
            setUpis={setUpis}
            cards={cards}
            setCards={setCards}
            wallets={wallets}
            setWallets={setWallets}
          />
        );
      case 'insurance':
        return <ComingSoonView title="Insurance" onBack={() => setCurrentView('home')} />;
      case 'gifts':
        return <ComingSoonView title="Gifts" onBack={() => setCurrentView('home')} />;
      case 'pay_bills':
        return <ComingSoonView title="Pay Bills" onBack={() => setCurrentView('home')} />;
      case 'more':
        return <ComingSoonView title="More Services" onBack={() => setCurrentView('home')} />;
      case 'activity':
        return <ActivityView activities={activities} setActivities={setActivities} />;
      case 'account':
        return (
          <AccountView 
            onChangeView={setCurrentView} 
            profileName={profileName} 
            onUpdateProfile={setProfileName}
            preferredPayment={preferredPayment}
            onUpdatePreferredPayment={handleUpdatePreferredPayment}
          />
        );
      default:
        return <HomeView onChangeView={setCurrentView} walletBalance={walletBalance} rewardPoints={rewardPoints} onAddRewards={handleAddRewards} profileName={profileName} rewardTransactions={rewardTransactions} currentLocation={currentLocation} onUpdateLocation={setCurrentLocation} onAddSavedAddress={handleAddSavedAddress} />;
    }
  };

  // Only hide bottom nav on the active ride booking map view ('booking')
  const hideBottomNav = currentView === 'booking';

  return (
    <div className="w-full h-full bg-white relative font-sans min-h-screen">
      <main className="w-full h-full">
        {renderView()}
      </main>

      {!hideBottomNav && (
        <BottomNav currentView={currentView} onChangeView={setCurrentView} />
      )}
    </div>
  );
};

export default App;
