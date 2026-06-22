import React, { useState, useEffect } from 'react';
import { ViewState, RewardTransaction, SavedAddress, CartItem, ActivityItem, SavedMethod, WalletItem, Guest, LinkedAccount, Ticket, Theme } from './types';
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
import { AIAssistantView } from './views/AIAssistantView';
import { SupportView } from './views/SupportView';
import { RECENT_ACTIVITY } from './constants';

// Custom hook for localStorage persistence
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  
  // Persisted States
  const [walletBalance, setWalletBalance] = useLocalStorage<number>('chalo_walletBalance', 1240.50);
  const [rewardPoints, setRewardPoints] = useLocalStorage<number>('chalo_rewardPoints', 1450);
  
  const [profileName, setProfileName] = useLocalStorage<string>('chalo_profileName', 'Kunal Pareek');
  const [profileEmail, setProfileEmail] = useLocalStorage<string>('chalo_profileEmail', 'kunal.pareek@gmail.com');
  const [profilePhone, setProfilePhone] = useLocalStorage<string>('chalo_profilePhone', '+91 98765 43210');
  const [profileGender, setProfileGender] = useLocalStorage<'Male' | 'Female' | 'Other'>('chalo_profileGender', 'Male');
  const [appTheme, setAppTheme] = useLocalStorage<Theme>('chalo_theme', 'system');
  
  const [preferredPayment, setPreferredPayment] = useLocalStorage<string>('chalo_preferredPayment', 'upi-gpay');
  const [currentLocation, setCurrentLocation] = useLocalStorage<string>('chalo_currentLocation', '123, Palm Grove Apartments, Indiranagar, Bengaluru, Karnataka 560038');
  const [cart, setCart] = useLocalStorage<CartItem[]>('chalo_cart', []);
  const [activities, setActivities] = useLocalStorage<ActivityItem[]>('chalo_activities', RECENT_ACTIVITY);
  
  const [savedAddresses, setSavedAddresses] = useLocalStorage<SavedAddress[]>('chalo_savedAddresses', [
    { id: 'addr-1', label: 'Home', flatNo: '123', area: 'Palm Grove Apartments, Indiranagar', city: 'Bengaluru', state: 'Karnataka', pincode: '560038', fullAddress: '123, Palm Grove Apartments, Indiranagar, Bengaluru, Karnataka 560038', address: '123, Palm Grove Apartments, Indiranagar, Bengaluru, Karnataka 560038', isPrimary: true, isPreferred: true, lat: 12.9716, lng: 77.5946 },
    { id: 'addr-2', label: 'Work', flatNo: 'Block B', area: 'Tech Park, Outer Ring Road, Bellandur', city: 'Bengaluru', state: 'Karnataka', pincode: '560103', fullAddress: 'Block B, Tech Park, Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103', address: 'Block B, Tech Park, Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103', isPrimary: false, isPreferred: false, lat: 12.9279, lng: 77.6801 }
  ]);

  const [savedGuests, setSavedGuests] = useLocalStorage<Guest[]>('chalo_savedGuests', [
    { id: 'g-1', name: 'Kunal Pareek', phone: '+91 98765 43210', email: 'kunal.pareek@gmail.com' }
  ]);

  const [upis, setUpis] = useLocalStorage<SavedMethod[]>('chalo_upis', [
    { id: 'upi-gpay', type: 'upi', title: 'Google Pay', subtitle: 'arjun@okhdfcbank', iconUrl: 'https://icon.horse/icon/pay.google.com' },
  ]);

  const [cards, setCards] = useLocalStorage<SavedMethod[]>('chalo_cards', [
    { id: 'card-hdfc', type: 'card', title: 'HDFC Bank Visa Credit Card', subtitle: 'ARJUN KUMAR • **** 4242', iconUrl: 'https://icon.horse/icon/hdfcbank.com' },
  ]);

  const [wallets, setWallets] = useLocalStorage<WalletItem[]>('chalo_wallets', [
    { id: 'wallet-paytm', title: 'Paytm Wallet', balance: 350, isLinked: true, iconUrl: 'https://icon.horse/icon/paytm.com', domain: 'paytm.com' },
    { id: 'wallet-amazon', title: 'Amazon Pay', balance: 0, isLinked: false, iconUrl: 'https://icon.horse/icon/amazon.in', domain: 'amazon.in' },
    { id: 'wallet-mobikwik', title: 'MobiKwik', balance: 0, isLinked: false, iconUrl: 'https://icon.horse/icon/mobikwik.com', domain: 'mobikwik.com' },
  ]);
  
  const [rewardTransactions, setRewardTransactions] = useLocalStorage<RewardTransaction[]>('chalo_rewardTransactions', [
    { id: 'rt-1', description: 'Welcome Bonus', points: 500, type: 'earned', date: '10 Oct, 10:00 AM' },
    { id: 'rt-2', description: 'Referral: AMAN1000', points: 1000, type: 'earned', date: '12 Oct, 04:30 PM' },
    { id: 'rt-3', description: 'Converted to Wallet Cash', points: 50, type: 'spent', date: '14 Oct, 11:15 AM' }
  ]);

  const [linkedAccounts, setLinkedAccounts] = useLocalStorage<LinkedAccount[]>('chalo_linkedAccounts', [
    { id: 'la-1', providerId: 'uber', linkedSince: '12 Oct 2023', username: 'kunal.pareek@gmail.com' },
    { id: 'la-2', providerId: 'zomato', linkedSince: '15 Nov 2023', username: '+91 98765 43210' }
  ]);

  const [tickets, setTickets] = useLocalStorage<Ticket[]>('chalo_tickets', [
    {
      id: 'TKT-8921',
      title: 'Refund not received for cancelled ride',
      category: 'Rides',
      status: 'In Progress',
      date: '12 Oct, 2024',
      messages: [
        { id: 'm1', sender: 'user', text: 'I cancelled my Uber ride yesterday but the amount was deducted from my card. When will I get the refund?', timestamp: '12 Oct, 10:30 AM' },
        { id: 'm2', sender: 'support', text: 'Hi Kunal, we apologize for the inconvenience. Refunds for cancelled rides usually take 3-5 business days to reflect in your account. We have escalated this to Uber.', timestamp: '12 Oct, 11:15 AM' }
      ]
    },
    {
      id: 'TKT-7432',
      title: 'Food delivered late',
      category: 'Food',
      status: 'Resolved',
      date: '05 Oct, 2024',
      messages: [
        { id: 'm1', sender: 'user', text: 'My Zomato order from Truffles was delivered 45 minutes late and the food was cold.', timestamp: '05 Oct, 08:00 PM' },
        { id: 'm2', sender: 'support', text: 'We are extremely sorry for the poor experience. We have credited 500 Reward Points to your account as compensation.', timestamp: '05 Oct, 08:30 PM' }
      ]
    }
  ]);

  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);

  const handleUpdatePreferredPayment = (methodId: string) => {
    setPreferredPayment(methodId);
  };

  const handleConvertPoints = (pointsToConvert: number): boolean => {
    if (rewardPoints >= pointsToConvert && pointsToConvert > 0) {
      const cashAmount = pointsToConvert / 20;
      setRewardPoints(prev => prev - pointsToConvert);
      setWalletBalance(prev => prev + cashAmount);
      
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

  const handleEditProfile = () => {
    setCurrentView('account');
    setIsEditingProfile(true);
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
            savedAddresses={savedAddresses}
            onEditProfile={handleEditProfile}
          />
        );
      case 'booking':
        return (
          <RideBookingView 
            onBack={() => setCurrentView('home')} 
            currentLocation={currentLocation}
            preferredPayment={preferredPayment}
            upis={upis}
            cards={cards}
            wallets={wallets}
            walletBalance={walletBalance}
            onAddActivity={handleAddActivity}
          />
        );
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
            currentLocation={currentLocation}
            preferredPayment={preferredPayment}
            upis={upis}
            cards={cards}
            wallets={wallets}
            walletBalance={walletBalance}
            onAddActivity={handleAddActivity}
          />
        );
      case 'linked_accounts':
        return (
          <LinkedAccountsView 
            onBack={() => setCurrentView('account')} 
            linkedAccounts={linkedAccounts}
            setLinkedAccounts={setLinkedAccounts}
          />
        );
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
      case 'ai':
        return <AIAssistantView onBack={() => setCurrentView('home')} />;
      case 'support':
        return (
          <SupportView 
            onBack={() => setCurrentView('account')} 
            tickets={tickets}
            setTickets={setTickets}
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
            profileEmail={profileEmail}
            onUpdateEmail={setProfileEmail}
            profilePhone={profilePhone}
            onUpdatePhone={setProfilePhone}
            profileGender={profileGender}
            onUpdateGender={setProfileGender}
            appTheme={appTheme}
            onUpdateTheme={setAppTheme}
            isEditingProfile={isEditingProfile}
            setIsEditingProfile={setIsEditingProfile}
          />
        );
      default:
        return <HomeView onChangeView={setCurrentView} walletBalance={walletBalance} rewardPoints={rewardPoints} onAddRewards={handleAddRewards} onAddWalletMoney={handleAddWalletMoney} profileName={profileName} rewardTransactions={rewardTransactions} currentLocation={currentLocation} onUpdateLocation={setCurrentLocation} onAddSavedAddress={handleAddSavedAddress} savedAddresses={savedAddresses} onEditProfile={handleEditProfile} />;
    }
  };

  const hideBottomNav = currentView === 'booking' || currentView === 'ai' || currentView === 'support' || currentView === 'intercity';

  return (
    <div className={`w-full h-full relative font-sans min-h-screen ${appTheme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-800'}`}>
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
